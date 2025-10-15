"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  activateUsuario,
} from "@/actions/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Plus,
  Edit,
  UserCheck,
  UserX,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: "conanp" | "prestador";
  activo: boolean;
  fechaVencimientoPermiso: string | null;
  estadoPermiso: "vigente" | "por_vencer" | "vencido" | "suspendido";
  createdAt: string;
  updatedAt: string;
}

interface CreateUsuarioData {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  rol: "conanp" | "prestador";
  activo: boolean;
}

export default function UsuariosPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Formulario para crear/editar usuario
  const [formData, setFormData] = useState<CreateUsuarioData>({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    rol: "prestador",
    activo: true,
  });

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getUsuarios(1, 50); // Cargar más usuarios para la demo

      if (result.success) {
        const usuarios = result.data?.users || result.data?.data || [];
        setUsuarios(usuarios);
      } else {
        setError(result.error || "Error al cargar usuarios");
      }
    } catch (error: unknown) {
      clientLogger.error("Error al cargar usuarios", error, {
        userId: user?.id,
      });
      setError("Error al cargar usuarios");
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
      loadUsuarios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const handleCreateUsuario = async () => {
    if (!formData.nombre || !formData.email || !formData.password) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await createUsuario(formData);

      if (result.success) {
        setShowCreateDialog(false);
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          password: "",
          rol: "prestador",
          activo: true,
        });
        await loadUsuarios(); // Recargar la lista
      } else {
        setError(result.error || "Error al crear usuario");
      }
    } catch (error) {
      clientLogger.error("Error al crear usuario", error, {
        userId: user?.id,
        formData: { ...formData, password: "[REDACTED]" },
      });
      setError("Error al crear usuario");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditUsuario = async () => {
    if (!usuarioEditando) return;

    try {
      setSubmitting(true);
      setError("");

      const updateData = {
        nombre: formData.nombre,
        telefono: formData.telefono,
        activo: formData.activo,
      };

      const result = await updateUsuario(usuarioEditando.id, updateData);

      if (result.success) {
        setShowEditDialog(false);
        setUsuarioEditando(null);
        await loadUsuarios(); // Recargar la lista
      } else {
        setError(result.error || "Error al actualizar usuario");
      }
    } catch (error) {
      clientLogger.error("Error al actualizar usuario", error, {
        userId: user?.id,
        usuarioEditandoId: usuarioEditando?.id,
      });
      setError("Error al actualizar usuario");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUsuario = async (usuarioId: string) => {
    if (!confirm("¿Estás seguro de que quieres desactivar este usuario?")) {
      return;
    }

    try {
      setError("");
      const result = await deleteUsuario(usuarioId);

      if (result.success) {
        await loadUsuarios(); // Recargar la lista
      } else {
        setError(result.error || "Error al desactivar usuario");
      }
    } catch (error) {
      clientLogger.error("Error al desactivar usuario", error, {
        userId: user?.id,
        usuarioId,
      });
      setError("Error al desactivar usuario");
    }
  };

  const handleActivateUsuario = async (usuarioId: string) => {
    try {
      setError("");
      const result = await activateUsuario(usuarioId);

      if (result.success) {
        await loadUsuarios(); // Recargar la lista
      } else {
        setError(result.error || "Error al activar usuario");
      }
    } catch (error) {
      clientLogger.error("Error al activar usuario", error, {
        userId: user?.id,
        usuarioId,
      });
      setError("Error al activar usuario");
    }
  };

  const openEditDialog = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      password: "", // No mostramos la contraseña
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setShowEditDialog(true);
  };

  const getRolBadgeColor = (rol: string) => {
    return rol === "conanp"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getEstadoBadgeColor = (activo: boolean) => {
    return activo
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-[var(--isla-dark-teal)]">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--isla-teal)] rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--isla-dark-teal)]">
                Gestión de Usuarios
              </h1>
              <p className="text-gray-600">
                Administra prestadores y usuarios del sistema
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={loadUsuarios}
              className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                  <DialogDescription>
                    Completa la información para crear un nuevo usuario
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nombre" className="text-right">
                      Nombre *
                    </Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="telefono" className="text-right">
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="2291234567"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Contraseña *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="Contraseña segura"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="rol" className="text-right">
                      Rol
                    </Label>
                    <Select
                      value={formData.rol}
                      onValueChange={(value: "conanp" | "prestador") =>
                        setFormData({ ...formData, rol: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prestador">Prestador</SelectItem>
                        <SelectItem value="conanp">CONANP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateUsuario}
                    disabled={submitting}
                    className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      "Crear Usuario"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Tabla de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>
              {usuarios.length} usuarios registrados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">
                        {usuario.nombre}
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.telefono || "N/A"}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${getRolBadgeColor(usuario.rol)} text-xs`}
                        >
                          {usuario.rol.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getEstadoBadgeColor(
                            usuario.activo
                          )} text-xs`}
                        >
                          {usuario.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(usuario.createdAt).toLocaleDateString(
                          "es-MX"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(usuario)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {usuario.activo ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUsuario(usuario.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActivateUsuario(usuario.id)}
                              className="border-green-300 text-green-600 hover:bg-green-50"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {usuarios.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay usuarios registrados
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Crea el primer usuario para comenzar
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialog de Edición */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Usuario</DialogTitle>
              <DialogDescription>
                Modifica la información del usuario
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
                <Label htmlFor="edit-telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="edit-telefono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-activo" className="text-right">
                  Estado
                </Label>
                <Select
                  value={formData.activo ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, activo: value === "true" })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Activo</SelectItem>
                    <SelectItem value="false">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleEditUsuario}
                disabled={submitting}
                className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
