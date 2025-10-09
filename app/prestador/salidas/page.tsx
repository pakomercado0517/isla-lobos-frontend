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

      console.log("🚢 Salidas: Cargando datos...");

      const [salidasResult, brazaletesResult] = await Promise.all([
        getMisSalidas(),
        getMisBrazaletes(),
      ]);

      if (salidasResult.success && salidasResult.data) {
        const salidas = salidasResult.data.salidas || [];
        setSalidas(salidas);

        // DEBUG: Ver formato de fechas que llegan del backend
        if (salidas.length > 0) {
          console.log("🚢 Salidas: Primera salida completa:", salidas[0]);
          console.log("🚢 Salidas: Tipo de fecha:", typeof salidas[0].fecha);
          console.log("🚢 Salidas: Valor de fecha:", salidas[0].fecha);
        }

        console.log(
          "🚢 Salidas: Salidas cargadas:",
          salidasResult.data.salidas?.length
        );
      } else {
        throw new Error("Error al cargar salidas");
      }

      if (brazaletesResult.success && brazaletesResult.data) {
        setBrazaletesData(brazaletesResult.data);
        console.log("🎫 Salidas: Brazaletes cargados:", brazaletesResult.data);
      }
    } catch (error) {
      console.error("🚢 Salidas: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarUso = async (data: UsoBrazaleteFormData) => {
    try {
      setRegistrandoUso(true);
      setUsoError("");

      console.log("🎫 Salidas: Registrando uso:", data);

      // Convertir UsoBrazaleteFormData a formato esperado por marcarBrazaletesUtilizados
      const fechaActual = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const result = await marcarBrazaletesUtilizados({
        salida_id: data.salida_id,
        fecha_uso: fechaActual,
      });

      if (result.success) {
        console.log("🎫 Salidas: Uso registrado exitosamente");
        setShowUsoDialog(false);
        setSelectedSalida(null);
        await loadData(); // Recargar datos
      } else {
        throw new Error(result.message || "Error al registrar uso");
      }
    } catch (error) {
      console.error("🎫 Salidas: Error al registrar uso:", error);
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
