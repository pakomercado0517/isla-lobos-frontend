"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import { getLotesBrazaletes } from "@/actions/brazaletes";
import { getUsuarios } from "@/actions/dashboard";
import { OperacionesLote } from "@/components/brazaletes/OperacionesLote";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertTriangle, Settings } from "lucide-react";
import { User } from "@/lib/types/auth";

interface OperacionLote {
  tipo: string;
  [key: string]: unknown;
}

export default function OperacionesLotePage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user } = useAuth();

  const [prestadores, setPrestadores] = useState<
    Array<{ id: string; nombre: string }>
  >([]);
  const [lotes, setLotes] = useState<
    Array<{ id: string; numero_lote: string }>
  >([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthorized, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [prestadoresResult, lotesResult] = await Promise.all([
        getUsuarios(1, 100, { rol: "prestador", activo: true }),
        getLotesBrazaletes({ limit: 100 }),
      ]);

      if (prestadoresResult.success && prestadoresResult.data) {
        const prestadoresData =
          prestadoresResult.data.users?.map((usuario: User) => ({
            id: usuario.id,
            nombre: usuario.nombre,
          })) || [];
        setPrestadores(prestadoresData);
      }

      if (lotesResult.success && lotesResult.data) {
        const lotesData =
          lotesResult.data.lotes?.map((lote) => ({
            id: lote.id,
            numero_lote: lote.numero_lote,
          })) || [];
        setLotes(lotesData);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error(
        "Error al cargar datos de operaciones en lote",
        error,
        { userId: user?.id }
      );
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEjecutarOperacion = async (operacion: OperacionLote) => {
    try {
      // Simular la ejecución de la operación
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // En una implementación real, aquí se haría la llamada al backend
      const afectados = Math.floor(Math.random() * 100) + 1;

      return {
        success: true,
        message: `Operación "${operacion.tipo}" ejecutada exitosamente`,
        afectados: afectados,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
        afectados: 0,
      };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Cargando operaciones en lote...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Operaciones en Lote
          </h1>
          <p className="text-gray-600 mt-1">
            Realiza operaciones masivas sobre múltiples brazaletes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-[var(--isla-teal)]" />
          <span className="text-sm text-gray-600">Gestión Masiva</span>
        </div>
      </div>

      {/* Error general */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Advertencia de seguridad */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Advertencia:</strong> Las operaciones en lote pueden afectar
          múltiples registros simultáneamente. Asegúrate de revisar
          cuidadosamente los criterios antes de ejecutar cualquier operación.
        </AlertDescription>
      </Alert>

      {/* Componente de operaciones en lote */}
      <OperacionesLote
        onEjecutarOperacion={handleEjecutarOperacion}
        prestadores={prestadores}
        lotes={lotes}
      />

      {/* Información adicional */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Tipos de Operaciones Disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              <span>
                <strong>Actualizar Estados:</strong> Cambiar el estado de
                múltiples brazaletes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>
                <strong>Asignar a Prestador:</strong> Asignar brazaletes a un
                prestador específico
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>
                <strong>Cancelar Lotes:</strong> Cancelar múltiples lotes de
                brazaletes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>
                <strong>Marcar como Perdidos:</strong> Marcar brazaletes como
                perdidos
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
