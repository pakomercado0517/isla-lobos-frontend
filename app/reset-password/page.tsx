"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Ship,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, resetPasswordState, resetPasswordAction } = useAuth();

  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setTokenError("Token de recuperación no válido o faltante");
    }
  }, [searchParams]);

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

  // Mostrar pantalla de carga si está autenticado
  if (
    loading ||
    (user && (user.rol === "conanp" || user.rol === "prestador"))
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--isla-dark-teal)]">Cargando...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de éxito si la contraseña fue restablecida
  if (resetPasswordState.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--isla-teal)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Ship className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)] mb-2">
              Isla Lobos
            </h1>
            <p className="text-[var(--isla-dark-teal)]/70">
              Sistema de Gestión de Turismo
            </p>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--isla-dark-teal)] mb-2">
                  ¡Contraseña Restablecida!
                </h2>
                <p className="text-gray-600 mb-6">
                  {resetPasswordState.message}
                </p>
                <Link href="/login">
                  <Button className="w-full bg-[var(--isla-teal)] hover:bg-[var(--isla-dark-teal)]">
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
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
            Isla Lobos
          </h1>
          <p className="text-[var(--isla-dark-teal)]/70">
            Sistema de Gestión de Turismo
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[var(--isla-dark-teal)]">
              Restablecer Contraseña
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tu nueva contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tokenError ? (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{tokenError}</AlertDescription>
                </Alert>
                <div className="text-center space-y-3">
                  <Link href="/olvide-password">
                    <Button className="w-full bg-[var(--isla-teal)] hover:bg-[var(--isla-dark-teal)]">
                      Solicitar Nuevo Enlace
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Volver al Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form action={resetPasswordAction} className="space-y-4">
                {/* Mostrar errores */}
                {resetPasswordState.error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      {resetPasswordState.error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Token hidden */}
                <input type="hidden" name="token" value={token} />

                {/* Nueva Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="password">Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-[var(--isla-teal)] hover:bg-[var(--isla-dark-teal)] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Restableciendo...</span>
                    </div>
                  ) : (
                    "Restablecer Contraseña"
                  )}
                </Button>

                {/* Links */}
                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm text-[var(--isla-teal)] hover:text-[var(--isla-dark-teal)] hover:underline"
                  >
                    Volver al login
                  </Link>
                </div>
              </form>
            )}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--isla-dark-teal)]">Cargando...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
