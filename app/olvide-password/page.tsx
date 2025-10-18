"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Mail, Ship } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function OlvidePasswordPage() {
  const router = useRouter();
  const { user, loading, forgotPasswordState, forgotPasswordAction } =
    useAuth();

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

  // Mostrar mensaje de éxito si el email fue enviado
  if (forgotPasswordState.success) {
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
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--isla-dark-teal)] mb-2">
                  Email Enviado
                </h2>
                <p className="text-gray-600 mb-6">
                  {forgotPasswordState.message}
                </p>
                <div className="space-y-3">
                  <Link href="/login">
                    <Button className="w-full bg-[var(--isla-teal)] hover:bg-[var(--isla-dark-teal)]">
                      Volver al Login
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.reload()}
                  >
                    Enviar Otro Email
                  </Button>
                </div>
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
            APFF
          </h1>
          <p className="text-[var(--isla-dark-teal)]/70">
            Sistema Arrecifal Lobos-Tuxpan
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[var(--isla-dark-teal)]">
              Recuperar Contraseña
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tu email para recibir un enlace de recuperación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={forgotPasswordAction} className="space-y-4">
              {/* Mostrar errores */}
              {forgotPasswordState.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {forgotPasswordState.error}
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
                />
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
                    <span>Enviando...</span>
                  </div>
                ) : (
                  "Enviar Enlace de Recuperación"
                )}
              </Button>

              {/* Links */}
              <div className="space-y-3 text-center">
                <Link
                  href="/login"
                  className="text-sm text-[var(--isla-teal)] hover:text-[var(--isla-dark-teal)] hover:underline"
                >
                  Volver al login
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
