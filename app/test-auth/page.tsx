"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, User, Shield, Database, Cookie } from "lucide-react";
import { useState, useEffect } from "react";
import { clientLogger } from "@/lib/logger-client";

export default function TestAuthPage() {
  const { user, loading, logoutAction, refreshUser } = useAuth();
  const [storageInfo, setStorageInfo] = useState<{
    hasLocalStorageToken: boolean;
    hasCookies: boolean;
    tokenPreview: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      const hasToken = !!token;
      const hasCookies =
        document.cookie.includes("auth_token") ||
        document.cookie.includes("user_data");

      setStorageInfo({
        hasLocalStorageToken: hasToken,
        hasCookies,
        tokenPreview: token ? `${token.substring(0, 20)}...` : "No token",
      });
    }
  }, [user]);

  const handleLogout = () => {
    try {
      logoutAction();
      // El contexto manejará la redirección automáticamente
    } catch (error) {
      clientLogger.error("Error en logout:", error);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleRefreshAuth = async () => {
    try {
      await refreshUser();
    } catch (error) {
      clientLogger.error("Error al refrescar autenticación:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Cargando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Test de Autenticación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Usuario Autenticado
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      <strong>Nombre:</strong> {user.nombre}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Rol:</strong> {user.rol}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      {user.activo ? "Activo" : "Inactivo"}
                    </p>
                  </div>
                </div>

                {storageInfo && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4" />
                      Estado de Almacenamiento
                    </h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>
                        <Cookie className="w-3 h-3 inline mr-1" />
                        <strong>localStorage Token:</strong>{" "}
                        {storageInfo.hasLocalStorageToken
                          ? "✅ Presente"
                          : "❌ Ausente"}
                      </p>
                      <p>
                        <Cookie className="w-3 h-3 inline mr-1" />
                        <strong>Cookies:</strong>{" "}
                        {storageInfo.hasCookies
                          ? "✅ Presentes"
                          : "❌ Ausentes"}
                      </p>
                      <p className="text-xs opacity-75">
                        <strong>Token Preview:</strong>{" "}
                        {storageInfo.tokenPreview}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recargar Página
                  </Button>
                  <Button
                    onClick={handleRefreshAuth}
                    variant="outline"
                    size="sm"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Refrescar Auth
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    size="sm"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800">No Autenticado</h3>
                <p className="text-sm text-red-700 mt-1">
                  No hay usuario autenticado. Deberías ser redirigido al login.
                </p>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-4">
              <p>
                <strong>Instrucciones para probar persistencia:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1 mt-1">
                <li>Inicia sesión como CONANP o prestador</li>
                <li>Navega a /dashboard o /prestador según tu rol</li>
                <li>Verifica que puedes acceder normalmente</li>
                <li>Recarga la página (F5 o Ctrl+R)</li>
                <li>Verifica que NO te redirija al login</li>
                <li>
                  Opcionalmente, ven a esta página (/test-auth) para ver
                  detalles
                </li>
              </ol>
              <p className="mt-2 text-green-600">
                <strong>✅ Objetivo:</strong> La sesión debe persistir al
                recargar en /dashboard y /prestador
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
