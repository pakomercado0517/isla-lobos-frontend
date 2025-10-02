"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  getEmbarcaciones,
  createEmbarcacion,
  updateEmbarcacion,
  deleteEmbarcacion,
  getUsuarios,
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
  Ship,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Activity,
  Search,
  Filter,
} from "lucide-react";

interface Embarcacion {
  id: string;
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador_id: string;
  prestador?: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Prestador {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  activo: boolean;
}

interface CreateEmbarcacionData {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador_id: string;
}

export default function EmbarcacionesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [embarcacionEditando, setEmbarcacionEditando] =
    useState<Embarcacion | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulario para crear/editar embarcación
  const [formData, setFormData] = useState<CreateEmbarcacionData>({
    nombre: "",
    matricula: "",
    capacidad: 20,
    tipo: "menor",
    estado: "disponible",
    prestador_id: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🚤 Embarcaciones: Cargando datos...");

      const [embarcacionesResult, prestadoresResult] = await Promise.all([
        getEmbarcaciones(),
        getUsuarios(1, 100, { rol: "prestador", activo: true }),
      ]);

      if (embarcacionesResult.success) {
        setEmbarcaciones(embarcacionesResult.data.embarcaciones || []);
        console.log(
          "🚤 Embarcaciones: Datos recibidos:",
          embarcacionesResult.data
        );
      } else {
        console.error("🚤 Embarcaciones: Error:", embarcacionesResult.error);
        setError(
          embarcacionesResult.error || "Error al cargar las embarcaciones"
        );
      }

      if (prestadoresResult.success) {
        setPrestadores(prestadoresResult.data.users || []);
        console.log("🚤 Prestadores: Datos recibidos:", prestadoresResult.data);
      } else {
        console.error("🚤 Prestadores: Error:", prestadoresResult.error);
        setError(prestadoresResult.error || "Error al cargar los prestadores");
      }
    } catch (error: unknown) {
      console.error("Error cargando datos:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

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
      loadData();
    }
  }, [user, authLoading, router]);

  const handleCreateEmbarcacion = async () => {
    if (!formData.nombre || !formData.matricula || !formData.prestador_id) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await createEmbarcacion(formData);

      if (result.success) {
        setShowCreateDialog(false);
        resetForm();
        loadData();
      } else {
        setError(result.error || "Error al crear la embarcación");
      }
    } catch (error: unknown) {
      console.error("Error creando embarcación:", error);
      setError("Error al crear la embarcación");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEmbarcacion = async () => {
    if (!embarcacionEditando) return;

    try {
      setSubmitting(true);
      setError("");

      const result = await updateEmbarcacion(embarcacionEditando.id, formData);

      if (result.success) {
        setShowEditDialog(false);
        resetForm();
        setEmbarcacionEditando(null);
        loadData();
      } else {
        setError(result.error || "Error al editar la embarcación");
      }
    } catch (error: unknown) {
      console.error("Error editando embarcación:", error);
      setError("Error al editar la embarcación");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmbarcacion = async (embarcacionId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta embarcación?"))
      return;

    try {
      const result = await deleteEmbarcacion(embarcacionId);

      if (result.success) {
        loadData();
      } else {
        setError(result.error || "Error al eliminar la embarcación");
      }
    } catch (error: unknown) {
      console.error("Error eliminando embarcación:", error);
      setError("Error al eliminar la embarcación");
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      matricula: "",
      capacidad: 20,
      tipo: "menor",
      estado: "disponible",
      prestador_id: "",
    });
  };

  const openEditDialog = (embarcacion: Embarcacion) => {
    setEmbarcacionEditando(embarcacion);
    setFormData({
      nombre: embarcacion.nombre,
      matricula: embarcacion.matricula,
      capacidad: embarcacion.capacidad,
      tipo: embarcacion.tipo,
      estado: embarcacion.estado,
      prestador_id: embarcacion.prestador_id,
    });
    setShowEditDialog(true);
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "disponible":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "en_uso":
        return <Activity className="w-4 h-4 text-blue-500" />;
      case "mantenimiento":
        return <Wrench className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-100 text-green-800";
      case "en_uso":
        return "bg-blue-100 text-blue-800";
      case "mantenimiento":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTipoColor = (tipo: string) => {
    return tipo === "mayor"
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  const embarcacionesFiltradas = embarcaciones.filter((embarcacion) => {
    const estadoMatch =
      filtroEstado === "todos" || embarcacion.estado === filtroEstado;
    const tipoMatch = filtroTipo === "todos" || embarcacion.tipo === filtroTipo;
    const busquedaMatch =
      busqueda === "" ||
      embarcacion.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      embarcacion.matricula.toLowerCase().includes(busqueda.toLowerCase()) ||
      embarcacion.prestador?.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
    return estadoMatch && tipoMatch && busquedaMatch;
  });

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando embarcaciones...</p>
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
            Gestión de Embarcaciones
          </h1>
          <p className="text-slate-600">
            Administra la flota de embarcaciones y prestadores
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <Button onClick={loadData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Embarcación
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nueva Embarcación</DialogTitle>
                <DialogDescription>
                  Agrega una nueva embarcación al sistema
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
                    placeholder="Lobos Express"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="matricula" className="text-right">
                    Matrícula
                  </Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        matricula: e.target.value.toUpperCase(),
                      })
                    }
                    className="col-span-3"
                    placeholder="VER-001-ABC"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacidad" className="text-right">
                    Capacidad
                  </Label>
                  <Input
                    id="capacidad"
                    type="number"
                    value={formData.capacidad}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacidad: parseInt(e.target.value) || 0,
                      })
                    }
                    className="col-span-3"
                    min="1"
                    max="150"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tipo" className="text-right">
                    Tipo
                  </Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: "menor" | "mayor") =>
                      setFormData({ ...formData, tipo: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="menor">Embarcación Menor</SelectItem>
                      <SelectItem value="mayor">Embarcación Mayor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="prestador_id" className="text-right">
                    Prestador
                  </Label>
                  <Select
                    value={formData.prestador_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, prestador_id: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Seleccionar prestador" />
                    </SelectTrigger>
                    <SelectContent>
                      {prestadores.map((prestador) => (
                        <SelectItem key={prestador.id} value={prestador.id}>
                          {prestador.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Button onClick={handleCreateEmbarcacion} disabled={submitting}>
                  {submitting ? "Registrando..." : "Registrar"}
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

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar embarcación..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="en_uso">En uso</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="menor">Embarcación Menor</SelectItem>
                <SelectItem value="mayor">Embarcación Mayor</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center text-sm text-gray-600">
              <span>
                {embarcacionesFiltradas.length} de {embarcaciones.length}{" "}
                embarcaciones
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de embarcaciones */}
      {embarcacionesFiltradas.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Embarcaciones</CardTitle>
            <CardDescription>
              {embarcacionesFiltradas.length} embarcación
              {embarcacionesFiltradas.length !== 1 ? "es" : ""} encontrada
              {embarcacionesFiltradas.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {embarcacionesFiltradas.map((embarcacion) => (
                  <TableRow key={embarcacion.id}>
                    <TableCell className="font-medium">
                      {embarcacion.nombre}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {embarcacion.matricula}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(embarcacion.tipo)}>
                        {embarcacion.tipo === "mayor"
                          ? "Embarcación Mayor"
                          : "Embarcación Menor"}
                      </Badge>
                    </TableCell>
                    <TableCell>{embarcacion.capacidad} personas</TableCell>
                    <TableCell>
                      {embarcacion.prestador?.nombre || "No asignado"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getEstadoIcon(embarcacion.estado)}
                        <Badge className={getEstadoColor(embarcacion.estado)}>
                          {embarcacion.estado.replace("_", " ")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(embarcacion)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteEmbarcacion(embarcacion.id)
                          }
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
            <Ship className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay embarcaciones
            </h3>
            <p className="text-gray-500 mb-4">
              Registra la primera embarcación para comenzar
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Registrar Primera Embarcación
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Embarcación</DialogTitle>
            <DialogDescription>
              Modifica los datos de la embarcación
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
              <Label htmlFor="edit-matricula" className="text-right">
                Matrícula
              </Label>
              <Input
                id="edit-matricula"
                value={formData.matricula}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    matricula: e.target.value.toUpperCase(),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-capacidad" className="text-right">
                Capacidad
              </Label>
              <Input
                id="edit-capacidad"
                type="number"
                value={formData.capacidad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacidad: parseInt(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                min="1"
                max="150"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-tipo" className="text-right">
                Tipo
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: "menor" | "mayor") =>
                  setFormData({ ...formData, tipo: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menor">Embarcación Menor</SelectItem>
                  <SelectItem value="mayor">Embarcación Mayor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-estado" className="text-right">
                Estado
              </Label>
              <Select
                value={formData.estado}
                onValueChange={(
                  value: "disponible" | "en_uso" | "mantenimiento"
                ) => setFormData({ ...formData, estado: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="en_uso">En uso</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-prestador_id" className="text-right">
                Prestador
              </Label>
              <Select
                value={formData.prestador_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, prestador_id: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar prestador" />
                </SelectTrigger>
                <SelectContent>
                  {prestadores.map((prestador) => (
                    <SelectItem key={prestador.id} value={prestador.id}>
                      {prestador.nombre}
                    </SelectItem>
                  ))}
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
            <Button onClick={handleEditEmbarcacion} disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
