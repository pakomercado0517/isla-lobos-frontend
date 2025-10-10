"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  activateUsuario,
} from "@/actions/dashboard";
import {
  UsuariosHeader,
  TablaUsuarios,
  DialogCrearUsuario,
  DialogEditarUsuario,
  LoadingState,
  ErrorAlert,
} from "./components";
import { clientLogger } from "@/lib/logger-client";

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

      const result = await getUsuarios(1, 50);

      if (result.success) {
        const usuarios = result.data?.users || result.data?.data || [];
        setUsuarios(usuarios);
      } else {
        setError(result.error || "Error al cargar usuarios");
      }
    } catch (error: unknown) {
      clientLogger.error("Error al cargar usuarios", error);
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
        await loadUsuarios();
      } else {
        setError(result.error || "Error al crear usuario");
      }
    } catch (error) {
      clientLogger.error("Error al crear usuario", error);
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
        await loadUsuarios();
      } else {
        setError(result.error || "Error al actualizar usuario");
      }
    } catch (error) {
      clientLogger.error("Error al actualizar usuario", error, {
        usuarioId: usuarioEditando?.id,
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
        await loadUsuarios();
      } else {
        setError(result.error || "Error al desactivar usuario");
      }
    } catch (error) {
      clientLogger.error("Error al desactivar usuario", error, { usuarioId });
      setError("Error al desactivar usuario");
    }
  };

  const handleActivateUsuario = async (usuarioId: string) => {
    try {
      setError("");
      const result = await activateUsuario(usuarioId);

      if (result.success) {
        await loadUsuarios();
      } else {
        setError(result.error || "Error al activar usuario");
      }
    } catch (error) {
      clientLogger.error("Error al activar usuario", error, { usuarioId });
      setError("Error al activar usuario");
    }
  };

  const openEditDialog = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      password: "",
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setShowEditDialog(true);
  };

  if (authLoading || loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] p-6">
      <div className="max-w-7xl mx-auto">
        <UsuariosHeader
          onRefresh={loadUsuarios}
          onCreateClick={() => setShowCreateDialog(true)}
        />

        <ErrorAlert error={error} />

        <TablaUsuarios
          usuarios={usuarios}
          onEdit={openEditDialog}
          onDelete={handleDeleteUsuario}
          onActivate={handleActivateUsuario}
        />

        <DialogCrearUsuario
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          formData={formData}
          onFormChange={setFormData}
          onSubmit={handleCreateUsuario}
          submitting={submitting}
        />

        <DialogEditarUsuario
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          nombre={formData.nombre}
          telefono={formData.telefono}
          activo={formData.activo}
          onNombreChange={(nombre) => setFormData({ ...formData, nombre })}
          onTelefonoChange={(telefono) =>
            setFormData({ ...formData, telefono })
          }
          onActivoChange={(activo) => setFormData({ ...formData, activo })}
          onSubmit={handleEditUsuario}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
