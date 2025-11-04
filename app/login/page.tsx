"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ship, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { AuthErrorHandler } from "@/lib/utils/auth-error-handler";
import axiosInstance from "@/lib/utils/axios";
import { AuthService } from "@/lib/services/AuthService";
import { clientLogger } from "@/lib/logger-client";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, loginState, refreshUser } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Verificar si hay mensaje de error de sesión
  useEffect(() => {
    const storedError = AuthErrorHandler.getStoredError();
    if (storedError) {
      setSessionError(storedError);
    }
  }, []);

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      if (user.rol === "conanp") {
        router.replace("/dashboard");
      } else if (user.rol === "prestador") {
        router.replace("/prestador");
      }
    }
  }, [user, loading, router]);

  // Mostrar pantalla de redirección si se está redirigiendo o el usuario ya está autenticado
  if (
    loading ||
    (user && (user.rol === "conanp" || user.rol === "prestador")) ||
    loginState.success
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--isla-dark-teal)]">
            {loginState.success ? "Redirigiendo..." : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--isla-teal)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Ship className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)] mb-2">
            APFF
          </h1>
          <p className="text-[var(--isla-dark-teal)]/70">
            Sistema Arrecifal Lobos-Tuxpan
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[var(--isla-dark-teal)]">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSessionError(null);
                setLoginError(null);
                setIsPending(true);

                const formData = new FormData(e.currentTarget);
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;

                if (!email || !password) {
                  setLoginError("Por favor completa todos los campos");
                  setIsPending(false);
                  return;
                }

                try {
                  // Hacer petición directamente desde el cliente para que las cookies del backend se establezcan
                  const response = await axiosInstance.post("/auth/login", {
                    email,
                    password,
                  });

                  if (
                    response.data.status === "success" &&
                    response.data.data
                  ) {
                    const userData = response.data.data.user;
                    const redirectTo =
                      userData.rol === "conanp" ? "/dashboard" : "/prestador";

                    // Guardar datos del usuario en localStorage
                    AuthService.saveUserData(userData);

                    // Esperar un momento para que las cookies se establezcan
                    await new Promise((resolve) => setTimeout(resolve, 200));

                    // Actualizar el contexto de autenticación ANTES de redirigir
                    // Esto evita que el dashboard redirija a login
                    // Usamos refreshUser() que lee de localStorage y valida con el backend
                    await refreshUser();

                    // Esperar un momento adicional para que el contexto se actualice
                    await new Promise((resolve) => setTimeout(resolve, 100));

                    // Redirigir a la página correspondiente
                    router.replace(redirectTo);
                  } else {
                    setLoginError(
                      response.data.message || "Error al iniciar sesión"
                    );
                  }
                } catch (error) {
                  clientLogger.error("Error en login", error);
                  const errorMessage =
                    error instanceof Error
                      ? error.message
                      : "Error al iniciar sesión";
                  setLoginError(errorMessage);
                } finally {
                  setIsPending(false);
                }
              }}
              className="space-y-4"
            >
              {/* Mostrar error de sesión expirada */}
              {sessionError && (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertDescription className="text-amber-800">
                    {sessionError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Mostrar errores de login */}
              {(loginError || loginState.error) && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {loginError || loginState.error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  className="h-11"
                  disabled={loading || isPending}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="h-11 pr-10"
                    disabled={loading || isPending}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || isPending}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="flex justify-center mt-5">
                  <Button
                    disabled={isPending || loading || loginState.success}
                    className="min-w-[150px] relative"
                  >
                    {isPending || loading || loginState.success ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>
                          {loginState.success
                            ? "Iniciando sesión..."
                            : "Procesando..."}
                        </span>
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3 text-center">
                <Link
                  href="/olvide-password"
                  className="text-sm text-[var(--isla-teal)] hover:text-[var(--isla-dark-teal)] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>

                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm text-gray-600">
                    ¿No tienes cuenta?
                  </span>
                  <Link
                    href="/registro"
                    className="text-sm text-[var(--isla-teal)] hover:text-[var(--isla-dark-teal)] hover:underline font-medium"
                  >
                    Regístrate
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-[var(--isla-dark-teal)] hover:text-[var(--isla-teal)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
