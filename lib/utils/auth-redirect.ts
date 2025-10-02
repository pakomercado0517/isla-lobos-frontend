/**
 * Utilidades para manejar redirecciones de autenticación de manera segura
 * Evita bucles infinitos entre rutas protegidas
 */

export interface RedirectOptions {
  currentPath: string;
  userRole?: string;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RedirectResult {
  shouldRedirect: boolean;
  redirectTo?: string;
  reason?: string;
}

/**
 * Determina si se debe redirigir y a dónde, evitando bucles infinitos
 */
export function getAuthRedirect({
  currentPath,
  userRole,
  isAuthenticated,
  isLoading,
}: RedirectOptions): RedirectResult {
  // No redirigir si aún estamos cargando
  if (isLoading) {
    return { shouldRedirect: false };
  }

  // Si no está autenticado, redirigir al login (excepto si ya está ahí)
  if (!isAuthenticated) {
    if (
      currentPath === "/login" ||
      currentPath === "/registro" ||
      currentPath === "/"
    ) {
      return { shouldRedirect: false };
    }
    return {
      shouldRedirect: true,
      redirectTo: "/login",
      reason: "Usuario no autenticado",
    };
  }

  // Si está autenticado pero no tiene rol válido
  if (!userRole || (userRole !== "conanp" && userRole !== "prestador")) {
    return {
      shouldRedirect: true,
      redirectTo: "/login",
      reason: `Rol inválido: ${userRole}`,
    };
  }

  // Redirecciones basadas en rol
  if (userRole === "conanp") {
    // Usuario CONANP intentando acceder a rutas de prestador
    if (currentPath.startsWith("/prestador")) {
      return {
        shouldRedirect: true,
        redirectTo: "/dashboard",
        reason: "Usuario CONANP redirigido desde prestador a dashboard",
      };
    }
  } else if (userRole === "prestador") {
    // Usuario prestador intentando acceder a rutas de dashboard
    if (currentPath.startsWith("/dashboard")) {
      return {
        shouldRedirect: true,
        redirectTo: "/prestador",
        reason: "Usuario prestador redirigido desde dashboard a prestador",
      };
    }
  }

  // No necesita redirección
  return { shouldRedirect: false };
}

/**
 * Hook personalizado para manejar redirecciones de manera segura
 */
export function shouldRedirectUser(
  currentPath: string,
  user: { rol?: string } | null,
  isLoading: boolean
): RedirectResult {
  return getAuthRedirect({
    currentPath,
    userRole: user?.rol,
    isAuthenticated: !!user,
    isLoading,
  });
}
