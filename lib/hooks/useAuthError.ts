import { useRouter } from "next/navigation";
import { useCallback } from "react";
import AuthErrorHandler from "@/lib/utils/auth-error-handler";

/**
 * Hook para manejar errores de autenticación
 * Uso: const handleAuthError = useAuthError();
 */
export function useAuthError() {
  const router = useRouter();

  const handleError = useCallback(
    (error: any) => {
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

