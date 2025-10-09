"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

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

// Config
import { config } from "@/lib/config/env";

// Función cliente para verificar cookies de autenticación
function checkClientAuthStatus(): {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
} {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }

  try {
    // Leer cookies del cliente
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const userCookie = cookies[config.storage.userKey];
    // No podemos acceder al token desde cookies httpOnly, pero si tenemos usuario, confiamos en que hay token válido

    if (userCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(userCookie)) as User;
        return {
          isAuthenticated: true,
          user,
          token: "cookie-httpOnly", // Placeholder - el token real está en cookie httpOnly
        };
      } catch (parseError) {
        // Error parsing user cookie - silently continue
      }
    }

    // Fallback: verificar localStorage (para compatibilidad)
    const localToken = localStorage.getItem(config.storage.tokenKey);
    const localUser = localStorage.getItem(config.storage.userKey);

    if (localToken && localUser) {
      try {
        const user = JSON.parse(localUser) as User;
        return {
          isAuthenticated: true,
          user,
          token: localToken,
        };
      } catch (parseError) {
        // Error parsing localStorage user - silently continue
      }
    }

    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

// Nuevo tipo para el contexto con server actions
interface ServerActionAuthContextType {
  user: User | null;
  loading: boolean;

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
}

const ServerActionAuthContext = createContext<
  ServerActionAuthContextType | undefined
>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Función para refrescar el usuario
  const refreshUser = async (): Promise<void> => {
    try {
      const authStatus = checkClientAuthStatus();

      setUser(authStatus.user);

      // Si tenemos un token válido, sincronizar con localStorage para compatibilidad
      if (authStatus.token && typeof window !== "undefined") {
        const currentToken = localStorage.getItem(config.storage.tokenKey);
        if (!currentToken || currentToken !== authStatus.token) {
          localStorage.setItem(config.storage.tokenKey, authStatus.token);
        }

        // También sincronizar el usuario en localStorage si no está
        if (authStatus.user) {
          const currentUser = localStorage.getItem(config.storage.userKey);
          if (!currentUser) {
            localStorage.setItem(
              config.storage.userKey,
              JSON.stringify(authStatus.user)
            );
          }
        }
      }

      setLoading(false);
    } catch (error) {
      setUser(null);
      setLoading(false);
    }
  };

  // Verificar autenticación al cargar
  useEffect(() => {
    refreshUser();
  }, []);

  // Manejar redirección después del login exitoso
  useEffect(() => {
    if (loginState.success && loginState.redirectTo) {
      setUser(loginState.data || null);

      // Si tenemos token del login, guardarlo en localStorage para ApiClient
      if (loginState.token && typeof window !== "undefined") {
        localStorage.setItem(config.storage.tokenKey, loginState.token);
        // Token ya está en cookies, no necesitamos ApiClient
      }

      router.replace(loginState.redirectTo);
    }
  }, [loginState, router]);

  // Manejar logout exitoso
  useEffect(() => {
    if (logoutState.success) {
      setUser(null);

      // Limpiar localStorage para completar el logout
      if (typeof window !== "undefined") {
        localStorage.removeItem(config.storage.tokenKey);
        localStorage.removeItem(config.storage.userKey);
        localStorage.removeItem(config.storage.refreshTokenKey);
      }

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
