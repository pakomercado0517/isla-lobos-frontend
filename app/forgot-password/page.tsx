"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Ship,
  Mail,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function ForgotPasswordPage() {
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
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-center">
          <Ship className="mx-auto h-12 w-12 text-primary" />
          <p className="mt-4 text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

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
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] lg:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
              <Mail className="mx-auto h-8 w-8 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Recuperar Contraseña
              </h1>
              <p className="text-sm text-muted-foreground">
                Ingresa tu email y te enviaremos un enlace para recuperar tu
                contraseña.
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
                {forgotPasswordState.success ? (
                  <Alert className="mb-4">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">
                      {forgotPasswordState.message}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form action={forgotPasswordAction} className="space-y-4">
                    {/* Mostrar errores */}
                    {forgotPasswordState.error && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
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

                    {/* Información de seguridad */}
                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Por tu seguridad:</span>
                      </div>
                      <ul className="list-inside list-disc space-y-1 pl-6 text-xs">
                        <li>El enlace expirará en 15 minutos</li>
                        <li>Solo funciona una vez</li>
                        <li>Revisa tu carpeta de spam si no lo recibes</li>
                      </ul>
                    </div>

                    {/* Botón de enviar */}
                    <Button type="submit" className="w-full">
                      Enviar enlace de recuperación
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
