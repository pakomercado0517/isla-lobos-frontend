"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getMisEmbarcaciones,
  crearMiEmbarcacion,
  actualizarMiEmbarcacion,
} from "@/actions/prestador";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ship,
  Plus,
  Edit,
  Wrench,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  Hash,
  RefreshCw,
} from "lucide-react";

import type { Embarcacion } from "@/lib/types/embarcacion";

interface EmbarcacionFormData {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
}

export default function EmbarcacionesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEmbarcacion, setEditingEmbarcacion] =
    useState<Embarcacion | null>(null);
  const [formData, setFormData] = useState<EmbarcacionFormData>({
    nombre: "",
    matricula: "",
    capacidad: 0,
    tipo: "menor",
    estado: "disponible",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadEmbarcaciones();
    }
  }, [isLoading, isAuthorized, user]);

  const loadEmbarcaciones = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMisEmbarcaciones();

      if (result.success && result.data) {
        setEmbarcaciones(result.data.embarcaciones || []);
      } else {
        setError(result.error || "Error al cargar embarcaciones");
      }
    } catch (err) {
      console.error("Error al cargar embarcaciones:", err);
      setError("Error inesperado al cargar embarcaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmbarcacion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.matricula || formData.capacidad <= 0) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await crearMiEmbarcacion(formData);

      if (result.success) {
        setIsCreateDialogOpen(false);
        setFormData({
          nombre: "",
          matricula: "",
          capacidad: 0,
          tipo: "menor",
          estado: "disponible",
        });
        await loadEmbarcaciones();
      } else {
        setError(result.error || "Error al crear embarcación");
      }
    } catch (err) {
      console.error("Error al crear embarcación:", err);
      setError("Error inesperado al crear embarcación");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEmbarcacion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEmbarcacion || !formData.nombre || formData.capacidad <= 0) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await actualizarMiEmbarcacion(editingEmbarcacion.id, {
        nombre: formData.nombre,
        capacidad: formData.capacidad,
        estado: formData.estado,
      });

      if (result.success) {
        setIsEditDialogOpen(false);
        setEditingEmbarcacion(null);
        setFormData({
          nombre: "",
          matricula: "",
          capacidad: 0,
          tipo: "menor",
          estado: "disponible",
        });
        await loadEmbarcaciones();
      } else {
        setError(result.error || "Error al actualizar embarcación");
      }
    } catch (err) {
      console.error("Error al actualizar embarcación:", err);
      setError("Error inesperado al actualizar embarcación");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDialog = (embarcacion: Embarcacion) => {
    setEditingEmbarcacion(embarcacion);
    setFormData({
      nombre: embarcacion.nombre,
      matricula: embarcacion.matricula,
      capacidad: embarcacion.capacidad,
      tipo: embarcacion.tipo,
      estado: embarcacion.estado,
    });
    setIsEditDialogOpen(true);
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "disponible":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "en_uso":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "mantenimiento":
        return <Wrench className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-100 text-green-800 border-green-200";
      case "en_uso":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "mantenimiento":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "mayor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "menor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--isla-dark-teal)]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)]">
            Mis Embarcaciones
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tu flota de embarcaciones
          </p>
        </div>
        <div className="flex items-center gap-3">
          {embarcaciones.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              {embarcaciones.length} embarcaciones
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={loadEmbarcaciones}
            disabled={loading}
            className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Embarcación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nueva Embarcación</DialogTitle>
                <DialogDescription>
                  Registra una nueva embarcación en tu flota.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEmbarcacion} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Embarcación</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Ej: Lancha María"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula</Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        matricula: e.target.value,
                      })
                    }
                    placeholder="Ej: VER-001-ABC"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacidad">Capacidad de Pasajeros</Label>
                  <Input
                    id="capacidad"
                    type="number"
                    min="1"
                    value={formData.capacidad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacidad: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Ej: 25"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Embarcación</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: "menor" | "mayor") =>
                      setFormData({ ...formData, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menor">Menor</SelectItem>
                      <SelectItem value="mayor">Mayor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creando..." : "Crear Embarcación"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--isla-dark-teal)]">
              Cargando embarcaciones...
            </p>
          </div>
        )}

        {/* Embarcaciones Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {embarcaciones.length === 0 ? (
              <div className="col-span-full">
                <Card className="text-center py-12">
                  <CardContent>
                    <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No tienes embarcaciones registradas
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Comienza registrando tu primera embarcación
                    </p>
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-[var(--isla-teal)] hover:bg-[var(--isla-dark-teal)] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar Primera Embarcación
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              embarcaciones.map((embarcacion) => (
                <Card
                  key={embarcacion.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Ship className="w-5 h-5 text-[var(--isla-teal)]" />
                        <CardTitle className="text-lg">
                          {embarcacion.nombre}
                        </CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(embarcacion)}
                        className="text-gray-500 hover:text-[var(--isla-teal)]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardDescription className="flex items-center space-x-2">
                      <Hash className="w-4 h-4" />
                      <span>{embarcacion.matricula}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {embarcacion.capacidad} pasajeros
                        </span>
                      </div>
                      <Badge className={getTipoColor(embarcacion.tipo)}>
                        {embarcacion.tipo === "mayor" ? "Mayor" : "Menor"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getEstadoIcon(embarcacion.estado)}
                        <span className="text-sm text-gray-600">
                          {embarcacion.estado.replace("_", " ")}
                        </span>
                      </div>
                      <Badge className={getEstadoColor(embarcacion.estado)}>
                        {embarcacion.estado.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Embarcación</DialogTitle>
              <DialogDescription>
                Actualiza la información de tu embarcación.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditEmbarcacion} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre de la Embarcación</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Ej: Lancha María"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacidad">Capacidad de Pasajeros</Label>
                <Input
                  id="edit-capacidad"
                  type="number"
                  min="1"
                  value={formData.capacidad}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacidad: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Ej: 25"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(
                    value: "disponible" | "en_uso" | "mantenimiento"
                  ) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="en_uso">En Uso</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Actualizando..." : "Actualizar Embarcación"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
