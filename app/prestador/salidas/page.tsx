"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { getMisSalidas } from "@/actions/prestador";
import {
  marcarBrazaletesUtilizados,
  getMisBrazaletes,
} from "@/actions/brazaletes";
import { RefreshCw } from "lucide-react";
import { Salida } from "@/lib/types/salida";
import {
  BrazaletesPrestador,
  UsoBrazaleteFormData,
} from "@/lib/types/brazaletes";
import {
  HeaderSalidas,
  ResumenBrazaletes,
  EstadosSalidas,
  TablaSalidas,
} from "./components";

export default function SalidasPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();

  const [salidas, setSalidas] = useState<Salida[]>([]);
  const [brazaletesData, setBrazaletesData] =
    useState<BrazaletesPrestador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSalida, setSelectedSalida] = useState<Salida | null>(null);
  const [showUsoDialog, setShowUsoDialog] = useState(false);
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

      const [salidasResult, brazaletesResult] = await Promise.all([
        getMisSalidas(),
        getMisBrazaletes(),
      ]);

      if (salidasResult.success && salidasResult.data) {
        setSalidas(salidasResult.data.salidas || []);
      } else {
        throw new Error("Error al cargar salidas");
      }

      if (brazaletesResult.success && brazaletesResult.data) {
        setBrazaletesData(brazaletesResult.data);
      }
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

      // Obtener fecha actual en formato YYYY-MM-DD sin timezone
      const { obtenerFechaActualYYYYMMDD } = await import("@/lib/utils");
      const fechaActual = obtenerFechaActualYYYYMMDD();
      const result = await marcarBrazaletesUtilizados({
        salida_id: data.salida_id,
        fecha_uso: fechaActual,
      });

      if (result.success) {
        setShowUsoDialog(false);
        setSelectedSalida(null);
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

  const handleOpenUsoDialog = (salida: Salida) => {
    setSelectedSalida(salida);
    setShowUsoDialog(true);
    setUsoError("");
  };

  const handleCloseUsoDialog = () => {
    setShowUsoDialog(false);
    setSelectedSalida(null);
    setUsoError("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <HeaderSalidas
        totalSalidas={salidas.length}
        loading={loading}
        onActualizar={loadData}
      />

      <div className="space-y-6">
        {/* Estados especiales */}
        <EstadosSalidas
          loading={loading}
          error={error}
          salidasLength={salidas.length}
        />

        {/* Resumen de brazaletes */}
        <ResumenBrazaletes brazaletesData={brazaletesData} />

        {/* Lista de salidas */}
        {!loading && !error && salidas.length > 0 && (
          <TablaSalidas
            salidas={salidas}
            brazaletesData={brazaletesData}
            selectedSalida={selectedSalida}
            showUsoDialog={showUsoDialog}
            registrandoUso={registrandoUso}
            usoError={usoError}
            onOpenUsoDialog={handleOpenUsoDialog}
            onCloseUsoDialog={handleCloseUsoDialog}
            onRegistrarUso={handleRegistrarUso}
          />
        )}
      </div>
    </div>
  );
}
