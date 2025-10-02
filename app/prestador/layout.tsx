"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { shouldRedirectUser } from "@/lib/utils/auth-redirect";

interface PrestadorLayoutProps {
  children: React.ReactNode;
}

export default function PrestadorLayout({ children }: PrestadorLayoutProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Verificar autenticación y redirección
  useEffect(() => {
    console.log(
      "🚤 Prestador Layout: authLoading:",
      authLoading,
      "user:",
      user,
      "pathname:",
      pathname
    );

    const redirectResult = shouldRedirectUser(pathname, user, authLoading);

    if (redirectResult.shouldRedirect && redirectResult.redirectTo) {
      console.log("🚤 Prestador Layout:", redirectResult.reason);
      router.push(redirectResult.redirectTo);
    } else if (user?.rol === "prestador") {
      console.log(
        "🚤 Prestador Layout: Usuario prestador autenticado correctamente"
      );
    }
  }, [user, authLoading, router, pathname]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--isla-dark-teal)]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || user.rol !== "prestador") {
    return null;
  }

  return <>{children}</>;
}
