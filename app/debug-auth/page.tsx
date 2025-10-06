"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts/AuthContext";
import { checkAuthStatus } from "@/actions/user";
import { config } from "@/lib/config/env";

export default function DebugAuthPage() {
  const { user, loading, refreshUser } = useAuth();
  const [debugInfo, setDebugInfo] = useState<{
    localStorage: { [key: string]: string | null };
    cookies: string;
    serverAuthCheck: unknown;
    contextState: unknown;
  } | null>(null);

  const runDiagnostic = useCallback(async () => {
    if (typeof window === "undefined") return;

    // 1. Check localStorage
    const localStorageInfo = {
      auth_token: localStorage.getItem(config.storage.tokenKey),
      user_key: localStorage.getItem(config.storage.userKey),
      refresh_token: localStorage.getItem(config.storage.refreshTokenKey),
    };

    // 2. Check cookies
    const cookies = document.cookie;

    // 3. Check server auth status
    let serverAuthCheck;
    try {
      serverAuthCheck = await checkAuthStatus();
    } catch (error) {
      serverAuthCheck = {
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    }

    // 4. Context state
    const contextState = {
      user: user ? { ...user } : null,
      loading,
      hasUser: !!user,
    };

    setDebugInfo({
      localStorage: localStorageInfo,
      cookies,
      serverAuthCheck,
      contextState,
    });
  }, [user, loading]);

  useEffect(() => {
    runDiagnostic();
  }, [runDiagnostic]);

  const clearStorage = () => {
    localStorage.clear();
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔍 Diagnóstico de Autenticación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={runDiagnostic} variant="outline">
                🔄 Refrescar Diagnóstico
              </Button>
              <Button onClick={refreshUser} variant="outline">
                🔐 Refrescar Auth Context
              </Button>
              <Button onClick={clearStorage} variant="destructive">
                🗑️ Limpiar Storage
              </Button>
            </div>

            {debugInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Context State */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Context State</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                      {JSON.stringify(debugInfo.contextState, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                {/* localStorage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">localStorage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                      {JSON.stringify(debugInfo.localStorage, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                {/* Server Auth Check */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Server Auth Check</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                      {JSON.stringify(debugInfo.serverAuthCheck, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                {/* Cookies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Cookies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                      {debugInfo.cookies || "No cookies"}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">
                Pasos para probar:
              </h3>
              <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
                <li>Inicia sesión normalmente</li>
                <li>Ven a esta página (/debug-auth)</li>
                <li>Verifica que todo esté presente</li>
                <li>Ve a /dashboard o /prestador</li>
                <li>Recarga la página</li>
                <li>
                  Si te redirige al login, regresa aquí y revisa qué falta
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
