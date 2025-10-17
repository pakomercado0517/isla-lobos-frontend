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
import { Ship, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, loginState, loginAction } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

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
            <form action={loginAction} className="space-y-4">
              {/* Mostrar errores */}
              {loginState.error && (
                <Alert variant="destructive">
                  <AlertDescription>{loginState.error}</AlertDescription>
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
                <div className="flex justify-center mt-5">
                  <Button>Iniciar Sesión</Button>
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
