"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import {
  Ship,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

function RegistroForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user,
    loading,
    registerState,
    registerAction,
    validateInvitationState,
    validateInvitationAction,
  } = useAuth();

  const codigoFromUrl = searchParams.get("codigo");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [invitationValidated, setInvitationValidated] = useState(false);
  const [codigoValidado, setCodigoValidado] = useState("");

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

  // Validar código de URL automáticamente
  useEffect(() => {
    if (codigoFromUrl && !invitationValidated) {
      const formData = new FormData();
      formData.append("codigo", codigoFromUrl);
      validateInvitationAction(formData);
    }
  }, [codigoFromUrl, invitationValidated, validateInvitationAction]);

  // Manejar validación de invitación
  useEffect(() => {
    if (
      validateInvitationState.success &&
      validateInvitationState.data?.valid
    ) {
      setInvitationValidated(true);
      setCodigoValidado(codigoFromUrl || "");
    }
  }, [validateInvitationState, codigoFromUrl]);

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

  // Mostrar mensaje de éxito si el registro fue exitoso
  if (registerState.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--isla-dark-teal)] mb-2">
                  ¡Registro Exitoso!
                </h2>
                <p className="text-gray-600 mb-6">{registerState.message}</p>
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
            APFF
          </h1>
          <p className="text-[var(--isla-dark-teal)]/70">
            Sistema Arrecifal Lobos-Tuxpan
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-[var(--isla-dark-teal)]">
              Crear Cuenta
            </CardTitle>
            <CardDescription className="text-center">
              Regístrate con tu código de invitación
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!invitationValidated ? (
              // Formulario de validación de invitación
              <form action={validateInvitationAction} className="space-y-4">
                {validateInvitationState.error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      {validateInvitationState.error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="codigo">Código de Invitación</Label>
                  <Input
                    id="codigo"
                    name="codigo"
                    type="text"
                    placeholder="Ingresa tu código de invitación"
                    defaultValue={codigoFromUrl || ""}
                    required
                    className="h-11"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-[var(--isla-teal)] hover:bg-[var(--isla-dark-teal)] text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Validando...</span>
                    </div>
                  ) : (
                    "Validar Código"
                  )}
                </Button>
              </form>
            ) : (
              // Formulario de registro completo
              <form action={registerAction} className="space-y-4">
                {registerState.error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{registerState.error}</AlertDescription>
                  </Alert>
                )}

                {validateInvitationState.data?.organizacion && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Código válido para:{" "}
                      <strong>
                        {validateInvitationState.data.organizacion}
                      </strong>
                      {validateInvitationState.data.email && (
                        <span className="block mt-1 text-sm">
                          📧 Email asignado:{" "}
                          <strong>{validateInvitationState.data.email}</strong>
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Código de invitación (hidden) */}
                <input
                  type="hidden"
                  name="codigoInvitacion"
                  value={codigoValidado}
                />

                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre completo"
                    required
                    className="h-11"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email
                    {validateInvitationState.data?.email && (
                      <span className="text-xs text-gray-500 ml-2">
                        (Asignado por la invitación)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    defaultValue={validateInvitationState.data?.email || ""}
                    readOnly={!!validateInvitationState.data?.email}
                    required
                    className={`h-11 ${
                      validateInvitationState.data?.email
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                  />
                  {validateInvitationState.data?.email && (
                    <p className="text-xs text-gray-600">
                      ℹ️ Este email fue asignado por CONANP y no puede ser
                      modificado
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="telefono">
                    Teléfono (Opcional)
                    <span className="text-xs text-gray-500 ml-2">
                      Para notificaciones por WhatsApp
                    </span>
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="2291234567"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    className="h-11"
                  />
                  <p className="text-xs text-gray-500">
                    📱 10 dígitos sin espacios ni guiones. Si proporcionas tu
                    teléfono, recibirás alertas importantes por WhatsApp.
                  </p>
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
                </div>

                {/* Confirm Password */}
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
                      <span>Registrando...</span>
                    </div>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>

                {/* Back to validation */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setInvitationValidated(false);
                    setCodigoValidado("");
                  }}
                >
                  Cambiar Código de Invitación
                </Button>
              </form>
            )}

            {/* Links */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm text-gray-600">
                  ¿Ya tienes cuenta?
                </span>
                <Link
                  href="/login"
                  className="text-sm text-[var(--isla-teal)] hover:text-[var(--isla-dark-teal)] hover:underline font-medium"
                >
                  Inicia sesión
                </Link>
              </div>
            </div>
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

export default function RegistroPage() {
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
      <RegistroForm />
    </Suspense>
  );
}
