"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { clientLogger } from "@/lib/logger-client";

// Server Actions
import {
  loginAction,
  logoutAction,
  registerAction,
  forgotPasswordAction,
  resetPasswordAction,
  changePasswordAction,
  validateInvitationAction,
} from "@/actions/auth";

// Types
import { User } from "@/lib/types/auth";
import {
  LoginState,
  RegisterState,
  LogoutState,
  ForgotPasswordState,
  ResetPasswordState,
  ChangePasswordState,
  ValidateInvitationState,
} from "@/lib/types/actions";

// Utils & Services
import { AuthService } from "@/lib/services/AuthService";
import axiosInstance from "@/lib/utils/axios";

// Config

interface AuthProviderProps {
  children: ReactNode;
}

// Nuevo tipo para el contexto con server actions
interface ServerActionAuthContextType {
  user: User | null;
  loading: boolean;
  isRefreshing: boolean;

  // Estados de las acciones
  loginState: LoginState;
  registerState: RegisterState;
  logoutState: LogoutState;
  forgotPasswordState: ForgotPasswordState;
  resetPasswordState: ResetPasswordState;
  changePasswordState: ChangePasswordState;
  validateInvitationState: ValidateInvitationState;

  // Acciones
  loginAction: (formData: FormData) => void;
  registerAction: (formData: FormData) => void;
  logoutAction: () => void;
  forgotPasswordAction: (formData: FormData) => void;
  resetPasswordAction: (formData: FormData) => void;
  changePasswordAction: (formData: FormData) => void;
  validateInvitationAction: (formData: FormData) => void;

  // Funciones auxiliares
  refreshUser: () => Promise<void>;
  refreshUserFromBackend: () => Promise<void>;
}

const ServerActionAuthContext = createContext<
  ServerActionAuthContextType | undefined
>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing] = useState(false);
  const router = useRouter();

  // Estados de las server actions
  const [loginState, loginActionDispatch] = useActionState(loginAction, {
    success: false,
  });

  const [registerState, registerActionDispatch] = useActionState(
    registerAction,
    {
      success: false,
    }
  );

  const [logoutState, logoutActionDispatch] = useActionState(logoutAction, {
    success: false,
  });

  const [forgotPasswordState, forgotPasswordActionDispatch] = useActionState(
    forgotPasswordAction,
    {
      success: false,
    }
  );

  const [resetPasswordState, resetPasswordActionDispatch] = useActionState(
    resetPasswordAction,
    {
      success: false,
    }
  );

  const [changePasswordState, changePasswordActionDispatch] = useActionState(
    changePasswordAction,
    {
      success: false,
    }
  );

  const [validateInvitationState, validateInvitationActionDispatch] =
    useActionState(validateInvitationAction, {
      success: false,
      data: { valid: false },
    });

  // Función para refrescar el usuario validando con el backend
  const refreshUser = async (): Promise<void> => {
    try {
      // Intentar obtener usuario de cookies o localStorage
      const cachedUser = AuthService.getUser();

      if (!cachedUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Establecer usuario temporalmente con datos cacheados
      // Normalizar a tipo User con valores por defecto hasta validar contra backend
      const nowIso = new Date().toISOString();
      const normalizedUser: User = {
        id: cachedUser.id,
        nombre: cachedUser.nombre,
        email: cachedUser.email,
        rol: cachedUser.rol,
        telefono: "",
        activo: true,
        created_at: nowIso,
        updated_at: nowIso,
      };
      setUser(normalizedUser);

      // Validar token con el backend obteniendo el perfil
      try {
        const response = await axiosInstance.get("/auth/profile");

        if (response.data.status === "success" && response.data.data?.user) {
          const validatedUser = response.data.data.user;
          setUser(validatedUser);

          // Guardar datos del usuario en localStorage para acceso rápido
          // Los tokens permanecen seguros en httpOnly cookies
          AuthService.saveUserData(validatedUser);
        } else {
          // Respuesta exitosa pero sin datos de usuario válidos

          setUser(null);
          AuthService.clearClientSession();
        }
      } catch (apiError) {
        // Error al validar con el backend (401, 403, network error, etc.)
        const _errorMessage =
          apiError instanceof Error
            ? apiError.message
            : "Error desconocido al validar token";

        // Mantener usuario cacheado aunque falle la validación backend
        // El interceptor manejará la renovación de tokens si es necesario
      }
    } catch (error) {
      // Error inesperado en el proceso de validación
      clientLogger.error("❌ Error inesperado al refrescar usuario", error);
      setUser(null);
      AuthService.clearClientSession();
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el usuario desde el backend
  const refreshUserFromBackend = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get("/auth/profile");

      if (response.data.status === "success" && response.data.data?.user) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);

        // Guardar datos actualizados en localStorage (no tokens)
        AuthService.saveUserData(updatedUser);
      }
    } catch (error) {
      clientLogger.error("Error al actualizar usuario desde backend", error);
      await refreshUser();
    }
  };

  // Verificar autenticación al cargar
  useEffect(() => {
    refreshUser();
  }, []);


  // Manejar redirección después del login exitoso
  useEffect(() => {
    const handleLoginSuccess = async () => {
      if (loginState.success && loginState.redirectTo) {
        // Establecer usuario en el estado
        if (loginState.data) {
          setUser(loginState.data);

          // Guardar datos del usuario en localStorage (tokens ya están en cookies httpOnly)
          AuthService.saveUserData(loginState.data);

          // Esperar un momento para que las cookies se establezcan
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Redirigir a la página correspondiente
          router.replace(loginState.redirectTo);
        }
      }
    };

    handleLoginSuccess();
  }, [loginState.success, loginState.redirectTo, loginState.data, router]);

  // Manejar logout exitoso
  useEffect(() => {
    if (logoutState.success) {
      setUser(null);
      AuthService.clearClientSession();
      router.replace("/login");
    }
  }, [logoutState, router]);

  // Manejar registro exitoso
  useEffect(() => {
    if (registerState.success) {
      router.replace("/login");
    }
  }, [registerState, router]);

  const value: ServerActionAuthContextType = {
    user,
    loading,
    isRefreshing,

    // Estados
    loginState,
    registerState,
    logoutState,
    forgotPasswordState,
    resetPasswordState,
    changePasswordState,
    validateInvitationState,

    // Acciones
    loginAction: loginActionDispatch,
    registerAction: registerActionDispatch,
    logoutAction: logoutActionDispatch,
    forgotPasswordAction: forgotPasswordActionDispatch,
    resetPasswordAction: resetPasswordActionDispatch,
    changePasswordAction: changePasswordActionDispatch,
    validateInvitationAction: validateInvitationActionDispatch,

    // Funciones auxiliares
    refreshUser,
    refreshUserFromBackend,
  };

  return (
    <ServerActionAuthContext.Provider value={value}>
      {children}
    </ServerActionAuthContext.Provider>
  );
}

// Hook para usar el contexto de autenticación con server actions
export function useAuth(): ServerActionAuthContextType {
  const context = useContext(ServerActionAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook para verificar si el usuario tiene un rol específico
export function useRole(requiredRole: "conanp" | "prestador"): boolean {
  const { user } = useAuth();
  if (!user?.rol) return false;

  // Normalizar ambos roles a minúsculas para comparación
  const userRole = user.rol.toLowerCase();
  const normalizedRequiredRole = requiredRole.toLowerCase();

  return userRole === normalizedRequiredRole;
}

// Hook para verificar si el usuario está autenticado
export function useIsAuthenticated(): boolean {
  const { user, loading } = useAuth();
  return !loading && user !== null;
}

// Hook simplificado para protección de rutas
export function useRouteProtection(requiredRole?: "conanp" | "prestador") {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // No hacer nada mientras está cargando la autenticación
    if (loading) {
      return;
    }

    setIsChecking(false);

    // Si no hay usuario, redirigir al login
    if (!user) {
      if (!hasRedirected) {
        setHasRedirected(true);
        router.push("/login");
      }
      return;
    }

    // Si se requiere un rol específico, verificar autorización
    if (requiredRole) {
      const userRole = user.rol?.toLowerCase();
      const normalizedRequiredRole = requiredRole.toLowerCase();

      if (userRole !== normalizedRequiredRole) {
        if (!hasRedirected) {
          setHasRedirected(true);
          router.push("/login");
        }
        return;
      }
    }

    setHasRedirected(false); // Reset flag si está autorizado
  }, [user, loading, requiredRole, router, hasRedirected]);

  const isAuthorized =
    !requiredRole || user?.rol?.toLowerCase() === requiredRole.toLowerCase();

  return {
    isAuthenticated: !!user,
    isAuthorized: isAuthorized && !!user,
    isLoading: loading || isChecking,
    user,
    refreshAuth: refreshUser,
  };
}
