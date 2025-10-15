"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import {
  getProfileAction,
  changePasswordAction,
  uploadAvatarAction,
  deleteAvatarAction,
  updatePhoneAction,
} from "@/actions/profile";
import { RefreshCw } from "lucide-react";
import { useActionState } from "react";
import {
  HeaderPerfil,
  InformacionPersonal,
  CambioPassword,
  InformacionSistema,
  EstadosPerfil,
} from "./components";

interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: "conanp" | "prestador";
  activo: boolean;
  avatar?: string;
  fechaVencimientoPermiso?: string;
  estadoPermiso?: string;
  diasNotificacion?: number;
  createdAt: string;
  updatedAt: string;
}

export default function PerfilPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para el cambio de contraseña
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para el avatar
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Estados para el teléfono
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);

  // Estados para formularios
  const [changePasswordState, changePasswordActionWithState] = useActionState(
    changePasswordAction,
    {
      success: false,
    }
  );
  const [uploadAvatarState, uploadAvatarActionWithState] = useActionState(
    uploadAvatarAction,
    {
      success: false,
    }
  );
  const [, deleteAvatarActionWithState] = useActionState(deleteAvatarAction, {
    success: false,
  });
  const [updatePhoneState, updatePhoneActionWithState] = useActionState(
    updatePhoneAction,
    {
      success: false,
    }
  );

  // Definir loadProfile antes de los useEffects
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProfileAction();

      if (result.success && result.data?.user) {
        setProfile(result.data.user);
        if (result.data.user.avatar) {
          setAvatarPreview(result.data.user.avatar);
        }
      } else {
        setError(result.error || "Error al cargar el perfil");
      }
    } catch (error) {
      clientLogger.error("Error al cargar perfil de prestador", error, {
        userId: user?.id,
      });
      setError("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar perfil inicial
  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthorized, user]);

  // Efecto para recargar el perfil cuando se actualice el teléfono exitosamente
  useEffect(() => {
    if (updatePhoneState.success) {
      loadProfile();
      setTimeout(() => {
        setShowPhoneDialog(false);
      }, 1500); // Esperar 1.5s para que el usuario vea el mensaje de éxito
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePhoneState.success]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async (formData: FormData) => {
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }
    await uploadAvatarActionWithState(formData);
  };

  const handleDeleteAvatar = async () => {
    await deleteAvatarActionWithState();
    setAvatarPreview(null);
    setSelectedFile(null);
  };

  const handleChangePassword = async (formData: FormData) => {
    await changePasswordActionWithState(formData);
  };

  const handleUpdatePhone = async (formData: FormData) => {
    await updatePhoneActionWithState(formData);
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <HeaderPerfil />

      {/* Estados especiales */}
      <EstadosPerfil loading={loading} error={error} />

      {/* Main Content */}
      {!loading && !error && (
        <div className="max-w-4xl">
          {/* Información del Perfil */}
          <InformacionPersonal
            profile={profile}
            avatarPreview={avatarPreview}
            showAvatarDialog={showAvatarDialog}
            uploadAvatarState={uploadAvatarState}
            showPhoneDialog={showPhoneDialog}
            updatePhoneState={updatePhoneState}
            onShowAvatarDialogChange={setShowAvatarDialog}
            onShowPhoneDialogChange={setShowPhoneDialog}
            onFileSelect={handleFileSelect}
            onUploadAvatar={handleUploadAvatar}
            onDeleteAvatar={handleDeleteAvatar}
            onUpdatePhone={handleUpdatePhone}
          />

          {/* Cambio de Contraseña */}
          <CambioPassword
            showChangePassword={showChangePassword}
            showCurrentPassword={showCurrentPassword}
            showNewPassword={showNewPassword}
            showConfirmPassword={showConfirmPassword}
            changePasswordState={changePasswordState}
            onShowChangePasswordChange={setShowChangePassword}
            onShowCurrentPasswordToggle={() =>
              setShowCurrentPassword(!showCurrentPassword)
            }
            onShowNewPasswordToggle={() => setShowNewPassword(!showNewPassword)}
            onShowConfirmPasswordToggle={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            onChangePassword={handleChangePassword}
          />

          {/* Información del Sistema */}
          <InformacionSistema profile={profile} />
        </div>
      )}
    </div>
  );
}
