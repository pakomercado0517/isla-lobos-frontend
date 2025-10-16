"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import {
  getProfileAction,
  changePasswordAction,
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
  EstadisticasConanp,
  ConfiguracionesAvanzadas,
} from "./components";

import { User } from "@/lib/types/auth";

interface UserProfile extends User {
  fechaVencimientoPermiso?: string;
  estadoPermiso?: string;
  diasNotificacion?: number;
  createdAt: string;
  updatedAt: string;
}

export default function PerfilConanpPage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user, refreshUserFromBackend } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para el cambio de contraseña
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para el teléfono
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);

  // Estados para formularios
  const [changePasswordState, changePasswordActionWithState] = useActionState(
    changePasswordAction,
    {
      success: false,
    }
  );
  const [updatePhoneState, updatePhoneActionWithState] = useActionState(
    updatePhoneAction,
    {
      success: false,
    }
  );

  // Cargar perfil
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProfileAction();

      if (result.success && result.data?.user) {
        const userData = result.data.user as UserProfile & {
          avatar?: string;
          avatar_url?: string;
        };
        const mappedUser: UserProfile = {
          ...userData,
          avatar_url: userData.avatar || userData.avatar_url,
          created_at: userData.createdAt,
          updated_at: userData.updatedAt,
        };

        setProfile(mappedUser);
      } else {
        setError(result.error || "Error al cargar el perfil");
      }
    } catch (error) {
      clientLogger.error("Error al cargar perfil de CONANP", error, {
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
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePhoneState.success]);

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
    <div className="space-y-4 sm:space-y-6 md:space-y-8 p-4 sm:p-6 lg:p-0">
      {/* Header */}
      <HeaderPerfil />

      {/* Estados especiales */}
      <EstadosPerfil loading={loading} error={error} />

      {/* Main Content */}
      {!loading && !error && (
        <div className="max-w-6xl px-4 sm:px-6 lg:px-0">
          {/* Información del Perfil */}
          <InformacionPersonal
            profile={profile}
            showPhoneDialog={showPhoneDialog}
            updatePhoneState={updatePhoneState}
            onShowPhoneDialogChange={setShowPhoneDialog}
            onUpdatePhone={handleUpdatePhone}
            onAvatarUpdate={async (newAvatarUrl) => {
              // Actualizar el perfil local inmediatamente
              if (profile) {
                setProfile({
                  ...profile,
                  avatar_url: newAvatarUrl || undefined,
                });
              }
              
              // Refrescar usuario desde backend después de un delay
              setTimeout(async () => {
                try {
                  await refreshUserFromBackend();
                } catch (error) {
                  // Error al actualizar usuario desde backend
                }
              }, 500);
            }}
          />

          {/* Estadísticas CONANP */}
          <EstadisticasConanp />

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

          {/* Configuraciones Avanzadas */}
          <ConfiguracionesAvanzadas />

          {/* Información del Sistema */}
          <InformacionSistema profile={profile} />
        </div>
      )}
    </div>
  );
}
