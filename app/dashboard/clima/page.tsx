"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getCondicionActual,
  getAlertasMeteorologicas,
  getCondicionesMeteorologicas,
  getPrediccionMeteorologica,
  getEstadisticasMeteorologicas,
  sincronizarDatosSMN,
  crearCondicionMeteorologica,
} from "@/actions/clima";
import type {
  CondicionMeteorologica,
  AlertasMeteorologicas,
  PrediccionMeteorologica,
  EstadisticasMeteorologicas,
  CrearCondicionMeteorologicaData,
} from "@/lib/types/clima";
import {
  ClimaHeader,
  CondicionActualCard,
  AlertasCard,
  TablaHistorial,
  PrediccionCard,
  EstadisticasCard,
  DialogCrearCondicion,
  LoadingState,
  ErrorAlert,
  EmptyState,
  tiempoTranscurrido,
} from "./components";

export default function ClimaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Estados principales
  const [condicionActual, setCondicionActual] =
    useState<CondicionMeteorologica | null>(null);
  const [alertas, setAlertas] = useState<AlertasMeteorologicas | null>(null);
  const [historial, setHistorial] = useState<CondicionMeteorologica[]>([]);
  const [prediccion, setPrediccion] = useState<PrediccionMeteorologica | null>(
    null
  );
  const [estadisticas, setEstadisticas] =
    useState<EstadisticasMeteorologicas | null>(null);

  // Estados de carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sincronizando, setSincronizando] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // UI States
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [tabActual, setTabActual] = useState("actual");

  const esConanp = user?.rol === "conanp";

  // Cargar datos iniciales
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.rol !== "conanp" && user.rol !== "prestador") {
      router.push("/");
      return;
    }

    const loadDataWrapper = async () => {
      await loadData();
    };

    loadDataWrapper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar datos en paralelo
      const [actualResult, alertasResult, historialResult, prediccionResult] =
        await Promise.all([
          getCondicionActual(),
          getAlertasMeteorologicas(),
          getCondicionesMeteorologicas({ limit: 20 }),
          getPrediccionMeteorologica({ dias: 5 }),
        ]);

      // Condición actual
      if (actualResult.success && actualResult.data) {
        setCondicionActual(actualResult.data.condicion);
      }

      // Alertas
      if (alertasResult.success && alertasResult.data) {
        setAlertas(alertasResult.data);
      }

      // Historial
      if (historialResult.success && historialResult.data) {
        setHistorial(historialResult.data.condiciones || []);
      }

      // Predicción
      if (prediccionResult.success && prediccionResult.data) {
        setPrediccion(prediccionResult.data);
      }

      // Estadísticas (solo para CONANP)
      if (esConanp) {
        const estadisticasResult = await getEstadisticasMeteorologicas();
        if (estadisticasResult.success && estadisticasResult.data) {
          setEstadisticas(estadisticasResult.data);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar datos";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSincronizar = async () => {
    try {
      setSincronizando(true);
      setError("");

      const result = await sincronizarDatosSMN({
        horas_limite: 24,
        solo_isla_lobos: true,
      });

      if (result.success && result.data) {
        setSuccessMessage(
          `Sincronización exitosa: ${result.data.condiciones_creadas} condiciones creadas, ${result.data.condiciones_actualizadas} actualizadas`
        );
        await loadData();
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        throw new Error(result.error || "Error al sincronizar");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al sincronizar";
      setError(errorMessage);
    } finally {
      setSincronizando(false);
    }
  };

  const handleCrearCondicion = async (
    data: CrearCondicionMeteorologicaData
  ) => {
    try {
      setSubmitting(true);
      setError("");

      const result = await crearCondicionMeteorologica(data);

      if (result.success) {
        setSuccessMessage("Condición meteorológica creada exitosamente");
        setShowCreateDialog(false);
        await loadData();
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        throw new Error(result.error || "Error al crear condición");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear condición";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingState />;
  }

  if (!condicionActual && !loading) {
    return (
      <div className="space-y-6">
        <ClimaHeader
          onSincronizar={handleSincronizar}
          sincronizando={sincronizando}
          esConanp={esConanp}
        />
        <EmptyState mensaje="No hay datos meteorológicos disponibles. Sincronice con el SMN para obtener datos." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClimaHeader
        onSincronizar={handleSincronizar}
        sincronizando={sincronizando}
        ultimaActualizacion={
          condicionActual
            ? tiempoTranscurrido(condicionActual.fecha_hora)
            : undefined
        }
        esConanp={esConanp}
      />

      {error && <ErrorAlert error={error} onRetry={loadData} />}
      {successMessage && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <Tabs value={tabActual} onValueChange={setTabActual}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="actual">Actual</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="prediccion">Predicción</TabsTrigger>
          {esConanp && (
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          )}
        </TabsList>

        {/* Tab: Condición Actual */}
        <TabsContent value="actual" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {condicionActual && (
              <CondicionActualCard condicion={condicionActual} />
            )}
            {alertas && <AlertasCard alertas={alertas} />}
          </div>
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="historial" className="space-y-4">
          {historial.length > 0 ? (
            <TablaHistorial condiciones={historial} esConanp={esConanp} />
          ) : (
            <EmptyState mensaje="No hay historial de condiciones disponible" />
          )}
        </TabsContent>

        {/* Tab: Predicción */}
        <TabsContent value="prediccion" className="space-y-4">
          {prediccion ? (
            <PrediccionCard prediccion={prediccion} />
          ) : (
            <EmptyState mensaje="No hay suficientes datos para generar predicción" />
          )}
        </TabsContent>

        {/* Tab: Estadísticas (solo CONANP) */}
        {esConanp && (
          <TabsContent value="estadisticas" className="space-y-4">
            {estadisticas ? (
              <EstadisticasCard estadisticas={estadisticas} />
            ) : (
              <EmptyState mensaje="No hay suficientes datos para mostrar estadísticas" />
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Dialogs */}
      {esConanp && (
        <>
          <DialogCrearCondicion
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onCrear={handleCrearCondicion}
            submitting={submitting}
          />

          {/* Botón flotante para crear condición */}
          <button
            onClick={() => setShowCreateDialog(true)}
            className="fixed bottom-8 right-8 rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Crear condición meteorológica"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
