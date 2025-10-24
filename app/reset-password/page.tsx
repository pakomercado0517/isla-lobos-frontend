"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Ship,
  Lock,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

// Componente interno que usa useSearchParams
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

  if (loading) {
    return (
      <div className="animate-pulse text-center">
        <Ship className="mx-auto h-12 w-12 text-primary" />
        <p className="mt-4 text-sm text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] lg:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Lock className="mx-auto h-8 w-8 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Restablecer Contraseña
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu nueva contraseña para restablecer tu cuenta.
        </p>
      </div>

      <Card className="border-2">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al login
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {tokenError ? (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{tokenError}</AlertDescription>
            </Alert>
          ) : resetPasswordState.success ? (
            <Alert className="mb-4">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                {resetPasswordState.message}
                <br />
                <Link
                  href="/login"
                  className="mt-2 inline-block text-primary hover:underline"
                >
                  Iniciar sesión
                </Link>
              </AlertDescription>
            </Alert>
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Requisitos de contraseña */}
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>La contraseña debe tener al menos:</span>
                </div>
                <ul className="list-inside list-disc space-y-1 pl-6 text-xs">
                  <li>6 caracteres</li>
                  <li>Una letra mayúscula</li>
                  <li>Una letra minúscula</li>
                  <li>Un número</li>
                </ul>
              </div>

              {/* Botón de restablecer */}
              <Button type="submit" className="w-full">
                Restablecer Contraseña
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente principal envuelto en Suspense
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Columna izquierda - Contenido informativo */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Ship className="mr-2 h-6 w-6" />
            CONANP Isla de Lobos
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Protegiendo nuestros recursos naturales a través de una
                gestión eficiente y segura.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>

        {/* Columna derecha - Formulario */}
        <div className="lg:p-8">
          <Suspense
            fallback={
              <div className="animate-pulse text-center">
                <Ship className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-4 text-sm text-gray-600">Cargando...</p>
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
