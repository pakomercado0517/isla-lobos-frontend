"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getMisBrazaletes,
  marcarBrazaletesUtilizados,
} from "@/actions/brazaletes";
import { getMisSalidas } from "@/actions/prestador";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  BrazaletesPrestador,
  UsoBrazaleteFormData,
  UsoBrazaleteSalida,
} from "@/lib/types/brazaletes";
import type { Salida } from "@/lib/types/salida";
import {
  UsoBrazaletesHeader,
  ResumenBrazaletesDisponibles,
  ListaSalidasDisponibles,
  FormularioRegistro,
  EstadoNoDisponible,
  HistorialUso,
  AuthLoadingState,
  LoadingState,
  ErrorAlert,
  filtrarBrazaletesDisponibles,
  filtrarSalidasConBrazaletes,
  getFechaActualFormato,
  puedeRegistrarBrazaletes,
} from "./components";

export default function UsoBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();

  // Estados para datos
  const [brazaletesData, setBrazaletesData] =
    useState<BrazaletesPrestador | null>(null);
  const [salidasDisponibles, setSalidasDisponibles] = useState<Salida[]>([]);
  const [registrosUso, setRegistrosUso] = useState<UsoBrazaleteSalida[]>([]);

  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUsoForm, setShowUsoForm] = useState(false);
  const [registrandoUso, setRegistrandoUso] = useState(false);
  const [usoError, setUsoError] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar datos en paralelo
      const [brazaletesResult, salidasResult] = await Promise.all([
        getMisBrazaletes(),
        getMisSalidas({ limit: 50 }), // Todas las salidas (se filtrarán después)
      ]);

      if (brazaletesResult.success && brazaletesResult.data) {
        setBrazaletesData(brazaletesResult.data);
      }

      if (salidasResult.success && salidasResult.data) {
        setSalidasDisponibles(salidasResult.data.salidas || []);
      }

      // Cargar registros de uso (esto se implementaría con un endpoint específico)
      setRegistrosUso([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarUso = async (data: UsoBrazaleteFormData) => {
    try {
      setRegistrandoUso(true);
      setUsoError("");

      // Convertir UsoBrazaleteFormData a formato esperado por marcarBrazaletesUtilizados
      const fechaActual = getFechaActualFormato();
      const result = await marcarBrazaletesUtilizados({
        salida_id: data.salida_id,
        fecha_uso: fechaActual,
      });

      if (result.success) {
        setShowUsoForm(false);
        await loadData(); // Recargar datos
      } else {
        throw new Error(result.message || "Error al registrar uso");
      }
    } catch (error) {
      setUsoError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setRegistrandoUso(false);
    }
  };

  // Filtrar datos usando utils
  const brazaletesDisponibles = filtrarBrazaletesDisponibles(brazaletesData);
  const salidasConBrazaletes = filtrarSalidasConBrazaletes(salidasDisponibles);
  const puedeRegistrar = puedeRegistrarBrazaletes(
    brazaletesDisponibles,
    salidasConBrazaletes
  );

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <AuthLoadingState />;
  }

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-8">
      <UsoBrazaletesHeader
        brazaletesDisponibles={brazaletesDisponibles}
        loading={loading}
        onRefresh={loadData}
      />

      <div className="space-y-6">
        <ErrorAlert error={error} />

        {/* Contenido principal */}
        {loading ? (
          <LoadingState />
        ) : (
          <Tabs defaultValue="registro" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="registro">Nuevo Registro</TabsTrigger>
              <TabsTrigger value="historial">
                Historial ({registrosUso.length})
              </TabsTrigger>
            </TabsList>

            {/* Tab de Registro */}
            <TabsContent value="registro" className="space-y-6">
              {/* Resumen de brazaletes disponibles */}
              {brazaletesData && (
                <ResumenBrazaletesDisponibles
                  brazaletesData={brazaletesData}
                  brazaletesDisponibles={brazaletesDisponibles}
                />
              )}

              {/* Salidas disponibles */}
              <ListaSalidasDisponibles
                salidasConBrazaletes={salidasConBrazaletes}
              />

              {/* Formulario de registro o estado no disponible */}
              {puedeRegistrar ? (
                <FormularioRegistro
                  showUsoForm={showUsoForm}
                  onShowUsoFormChange={setShowUsoForm}
                  onRegistrarUso={handleRegistrarUso}
                  registrandoUso={registrandoUso}
                  usoError={usoError}
                  brazaletesDisponibles={brazaletesDisponibles}
                />
              ) : (
                <EstadoNoDisponible
                  brazaletesDisponibles={brazaletesDisponibles}
                  onVerificarEstado={loadData}
                />
              )}
            </TabsContent>

            {/* Tab de Historial */}
            <TabsContent value="historial" className="space-y-6">
              <HistorialUso registrosUso={registrosUso} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
