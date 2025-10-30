import { useRouter } from "next/navigation";
import { useCallback } from "react";
import AuthErrorHandler from "@/lib/utils/auth-error-handler";

/**
 * Hook para manejar errores de autenticación en componentes de cliente.
 * Proporciona una función para verificar si un error requiere logout
 * y, si es así, lo maneja automáticamente (limpia tokens y redirige a login).
 * @returns Una función `handleAuthError` que toma un error y devuelve `true` si fue un error de autenticación manejado, `false` en caso contrario.
 */
export function useAuthError() {
  const router = useRouter();

  const handleError = useCallback(
    (error: unknown): boolean => {
      // Si es error de autenticación, hacer logout
      if (AuthErrorHandler.requiresLogout(error)) {
        AuthErrorHandler.handleAuthFailure(router, error);
        return true; // Error manejado
      }

      return false; // Error no manejado, debe procesarse normalmente
    },
    [router]
  );

  return handleError;
}
