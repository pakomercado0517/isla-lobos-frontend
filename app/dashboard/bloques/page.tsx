"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  getBloques,
  createBloque,
  updateBloque,
  deleteBloque,
} from "@/actions/dashboard";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Bloque {
  id: string;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  capacidad_registrada: number;
  fecha: string;
  estado: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
  createdAt: string;
  updatedAt: string;
}

interface CreateBloqueData {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  fecha: string;
  estado: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
}

export default function BloquesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [bloqueEditando, setBloqueEditando] = useState<Bloque | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulario para crear/editar bloque
  const [formData, setFormData] = useState<CreateBloqueData>({
    nombre: "",
    hora_inicio: "",
    hora_fin: "",
    capacidad_total: 50,
    fecha: fechaSeleccionada,
    estado: "activo",
  });

  const loadBloques = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getBloques({ fecha: fechaSeleccionada });

      if (result.success) {
        setBloques(result.data?.bloques || []);
      } else {
        setError(result.error || "Error al cargar los bloques");
      }
    } catch (error: unknown) {
      console.error("Error cargando bloques:", error);
      setError("Error al cargar los bloques");
    } finally {
      setLoading(false);
    }
  }, [fechaSeleccionada]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.rol !== "conanp") {
      router.push("/prestador");
      return;
    }

    if (user) {
      loadBloques();
    }
  }, [user, authLoading, router, loadBloques]);

  const handleCreateBloque = async () => {
    if (!formData.nombre || !formData.hora_inicio || !formData.hora_fin) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await createBloque(formData);

      if (!result.success) {
        throw new Error(result.error || "Error al crear el bloque");
      }

      setShowCreateDialog(false);
      resetForm();
      loadBloques();
    } catch (error: unknown) {
      console.error("Error creando bloque:", error);
      setError(
        error instanceof Error ? error.message : "Error al crear el bloque"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBloque = async () => {
    if (!bloqueEditando) return;

    try {
      setSubmitting(true);
      setError("");

      const result = await updateBloque(bloqueEditando.id, formData);

      if (!result.success) {
        throw new Error(result.error || "Error al actualizar el bloque");
      }

      setShowEditDialog(false);
      resetForm();
      setBloqueEditando(null);
      loadBloques();
    } catch (error: unknown) {
      console.error("Error editando bloque:", error);
      setError(
        error instanceof Error ? error.message : "Error al editar el bloque"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBloque = async (bloqueId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este bloque?")) return;

    try {
      const result = await deleteBloque(bloqueId);

      if (!result.success) {
        throw new Error(result.error || "Error al eliminar el bloque");
      }

      loadBloques();
    } catch (error: unknown) {
      console.error("Error eliminando bloque:", error);
      setError(
        error instanceof Error ? error.message : "Error al eliminar el bloque"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      hora_inicio: "",
      hora_fin: "",
      capacidad_total: 50,
      fecha: fechaSeleccionada,
      estado: "activo",
    });
  };

  const openEditDialog = (bloque: Bloque) => {
    setBloqueEditando(bloque);
    setFormData({
      nombre: bloque.nombre,
      hora_inicio: bloque.hora_inicio,
      hora_fin: bloque.hora_fin,
      capacidad_total: bloque.capacidad_total,
      fecha: bloque.fecha,
      estado: bloque.estado,
    });
    setShowEditDialog(true);
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "activo":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "lleno":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "suspendido_por_clima":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "cerrado_capitaria":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800";
      case "lleno":
        return "bg-red-100 text-red-800";
      case "suspendido_por_clima":
        return "bg-yellow-100 text-yellow-800";
      case "cerrado_capitaria":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOcupacionColor = (registrados: number, total: number) => {
    const porcentaje = (registrados / total) * 100;
    if (porcentaje >= 100) return "text-red-600";
    if (porcentaje >= 80) return "text-yellow-600";
    return "text-green-600";
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando bloques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestión de Bloques
          </h1>
          <p className="text-slate-600">
            Administra horarios y capacidad de salidas
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="fecha" className="text-sm font-medium">
              Fecha:
            </Label>
            <Input
              id="fecha"
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="w-auto"
            />
          </div>
          <Button onClick={loadBloques} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Bloque
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Bloque</DialogTitle>
                <DialogDescription>
                  Define un nuevo bloque horario con su capacidad
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="col-span-3"
                    placeholder="Bloque Matutino"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hora_inicio" className="text-right">
                    Inicio
                  </Label>
                  <Input
                    id="hora_inicio"
                    type="time"
                    value={formData.hora_inicio}
                    onChange={(e) =>
                      setFormData({ ...formData, hora_inicio: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hora_fin" className="text-right">
                    Fin
                  </Label>
                  <Input
                    id="hora_fin"
                    type="time"
                    value={formData.hora_fin}
                    onChange={(e) =>
                      setFormData({ ...formData, hora_fin: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacidad_total" className="text-right">
                    Capacidad
                  </Label>
                  <Input
                    id="capacidad_total"
                    type="number"
                    value={formData.capacidad_total}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacidad_total: parseInt(e.target.value) || 0,
                      })
                    }
                    className="col-span-3"
                    min="1"
                    max="150"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateBloque} disabled={submitting}>
                  {submitting ? "Creando..." : "Crear Bloque"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Contenido principal */}
      {bloques.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Bloques para {new Date(fechaSeleccionada).toLocaleDateString()}
            </CardTitle>
            <CardDescription>
              {bloques.length} bloque{bloques.length !== 1 ? "s" : ""}{" "}
              encontrado{bloques.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Ocupación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bloques.map((bloque) => (
                  <TableRow key={bloque.id}>
                    <TableCell className="font-medium">
                      {bloque.nombre}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {bloque.hora_inicio} - {bloque.hora_fin}
                      </div>
                    </TableCell>
                    <TableCell>{bloque.capacidad_total} personas</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span
                            className={getOcupacionColor(
                              bloque.capacidad_registrada,
                              bloque.capacidad_total
                            )}
                          >
                            {bloque.capacidad_registrada} /{" "}
                            {bloque.capacidad_total}
                          </span>
                          <span className="text-muted-foreground">
                            {Math.round(
                              (bloque.capacidad_registrada /
                                bloque.capacidad_total) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              (bloque.capacidad_registrada /
                                bloque.capacidad_total) *
                                100 >=
                              100
                                ? "bg-red-500"
                                : (bloque.capacidad_registrada /
                                    bloque.capacidad_total) *
                                    100 >=
                                  80
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (bloque.capacidad_registrada /
                                  bloque.capacidad_total) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getEstadoIcon(bloque.estado)}
                        <Badge className={getEstadoColor(bloque.estado)}>
                          {bloque.estado.replace("_", " ")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(bloque)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBloque(bloque.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay bloques para esta fecha
            </h3>
            <p className="text-gray-500 mb-4">
              Crea un nuevo bloque para comenzar
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Bloque
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Bloque</DialogTitle>
            <DialogDescription>
              Modifica los datos del bloque horario
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="edit-nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-hora_inicio" className="text-right">
                Inicio
              </Label>
              <Input
                id="edit-hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) =>
                  setFormData({ ...formData, hora_inicio: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-hora_fin" className="text-right">
                Fin
              </Label>
              <Input
                id="edit-hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={(e) =>
                  setFormData({ ...formData, hora_fin: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-capacidad_total" className="text-right">
                Capacidad
              </Label>
              <Input
                id="edit-capacidad_total"
                type="number"
                value={formData.capacidad_total}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacidad_total: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                min="1"
                max="150"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-estado" className="text-right">
                Estado
              </Label>
              <Select
                value={formData.estado}
                onValueChange={(value: string) =>
                  setFormData({
                    ...formData,
                    estado: value as
                      | "activo"
                      | "lleno"
                      | "suspendido_por_clima"
                      | "cerrado_capitaria",
                  })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="lleno">Lleno</SelectItem>
                  <SelectItem value="suspendido_por_clima">
                    Suspendido por clima
                  </SelectItem>
                  <SelectItem value="cerrado_capitaria">
                    Cerrado por capitanía
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditBloque} disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
