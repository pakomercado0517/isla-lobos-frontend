"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { getMisEmbarcaciones, registrarSalida } from "@/actions/prestador";
import { asignarBrazaletes, buscarBrazaletes } from "@/actions/brazaletes";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Embarcacion } from "@/lib/types/embarcacion";
import { DESTINOS } from "@/lib/types/salida";
import {
  FormularioNuevaSalida,
  MensajeEstado,
  BloqueBackend,
  SalidaFormData,
} from "./components";

export default function NuevaSalidaPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const router = useRouter();

  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [embarcacionesConSalidasPorBloque] = useState<Map<string, Set<string>>>(
    new Map()
  );
  const [bloques] = useState<BloqueBackend[]>([]);
  const [brazaletesDisponibles, setBrazaletesDisponibles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingBloques] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrandoBrazaletes, setRegistrandoBrazaletes] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🚢 Nueva Salida: Cargando datos...");

      const [embarcacionesResult, brazaletesResult] = await Promise.all([
        getMisEmbarcaciones(),
        buscarBrazaletes({ estado: "disponible", limit: 1000 }),
      ]);

      if (embarcacionesResult.success && embarcacionesResult.data) {
        setEmbarcaciones(embarcacionesResult.data.embarcaciones || []);
        console.log(
          "🚢 Nueva Salida: Embarcaciones cargadas:",
          embarcacionesResult.data.embarcaciones?.length
        );
      } else {
        throw new Error("Error al cargar embarcaciones");
      }

      if (brazaletesResult.success && brazaletesResult.data) {
        const brazaletesDisponibles =
          brazaletesResult.data.estadisticas.total_encontrados || 0;
        setBrazaletesDisponibles(brazaletesDisponibles);

        console.log(
          "🎫 Nueva Salida: Brazaletes disponibles encontrados:",
          brazaletesDisponibles
        );
      } else {
        console.warn("⚠️ Nueva Salida: No se pudieron cargar los brazaletes");
        setBrazaletesDisponibles(0);
      }
    } catch (error) {
      console.error("🚢 Nueva Salida: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Asigna brazaletes automáticamente después de crear la salida
   */
  const asignarBrazaletesAutomaticamente = async (
    salidaId: string,
    cantidadBrazaletes: number,
    fechaSalida: string
  ) => {
    try {
      setRegistrandoBrazaletes(true);
      console.log("🎫 Asignando brazaletes automáticamente...", {
        salidaId,
        cantidadBrazaletes,
        fechaSalida,
      });

      if (!salidaId) {
        throw new Error("salida_id es requerido");
      }
      if (!fechaSalida) {
        throw new Error("fecha_asignacion es requerida");
      }
      if (cantidadBrazaletes <= 0) {
        throw new Error("La cantidad de brazaletes debe ser mayor a 0");
      }

      const asignacionData = {
        salida_id: salidaId,
        cantidad: cantidadBrazaletes,
        fecha_asignacion: fechaSalida,
      };

      const resultado = await asignarBrazaletes(asignacionData);

      if (resultado.success) {
        console.log("🎫 Brazaletes asignados exitosamente:", resultado.data);
        setSuccessMessage(
          `✅ Salida creada y ${cantidadBrazaletes} brazaletes asignados exitosamente`
        );
      } else {
        console.error("🎫 Error al asignar brazaletes:", resultado.message);
        setSuccessMessage(
          `⚠️ Salida creada exitosamente, pero hubo un problema al asignar los brazaletes: ${resultado.message}. Puedes asignarlos manualmente más tarde.`
        );
      }
    } catch (error) {
      console.error("🎫 Error al asignar brazaletes automáticamente:", error);
      setSuccessMessage(
        `⚠️ Salida creada exitosamente, pero hubo un problema al asignar los brazaletes: ${
          error instanceof Error ? error.message : "Error desconocido"
        }. Puedes asignarlos manualmente más tarde.`
      );
    } finally {
      setRegistrandoBrazaletes(false);
    }
  };

  const onSubmit = async (data: SalidaFormData) => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      // Preparar datos según el destino
      let salidaData;
      const esIslaLobos = data.destino === DESTINOS.ISLA_LOBOS;

      if (esIslaLobos && data.bloque_id) {
        salidaData = {
          fecha: data.fecha,
          embarcacion_id: data.embarcacion_id,
          numero_pasajeros: data.numero_pasajeros,
          numero_brazaletes: data.numero_brazaletes,
          destino: data.destino,
          observaciones: data.observaciones || "",
          bloque_id: data.bloque_id,
        };
      } else if (data.hora) {
        salidaData = {
          fecha: data.fecha,
          hora: data.hora,
          embarcacion_id: data.embarcacion_id,
          numero_pasajeros: data.numero_pasajeros,
          numero_brazaletes: data.numero_brazaletes,
          destino: data.destino,
          observaciones: data.observaciones || "",
          bloque_id: null,
        };
      } else {
        throw new Error("Debe proporcionar un bloque horario o una hora");
      }

      console.log(
        "🚢 Nueva Salida: Datos que se enviarán al backend:",
        JSON.stringify(salidaData, null, 2)
      );

      const result = await registrarSalida(salidaData);

      if (result.success) {
        console.log("🚢 Nueva Salida: Salida registrada exitosamente");

        // Si se especificaron brazaletes, asignarlos automáticamente
        if (data.numero_brazaletes > 0 && result.data?.salida?.id) {
          console.log(
            "🚢 Nueva Salida: Iniciando asignación automática de brazaletes..."
          );
          await asignarBrazaletesAutomaticamente(
            result.data.salida.id,
            data.numero_brazaletes,
            data.fecha
          );
        } else {
          // Si no hay brazaletes, redirigir inmediatamente
          router.push("/prestador/salidas");
        }
      } else {
        throw new Error(result.message || "Error al registrar la salida");
      }
    } catch (error) {
      console.error("🚢 Nueva Salida: Error al registrar salida:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)]">
            Nueva Salida
          </h1>
          <p className="text-gray-600 mt-2">
            Registra una nueva salida turística
          </p>
        </div>
        <div className="flex items-center gap-3">
          {embarcaciones.length > 0 ? (
            <Badge variant="secondary" className="text-sm">
              {embarcaciones.length} embarcaciones disponibles
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-sm">
              Sin embarcaciones
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Mensajes de estado */}
        <MensajeEstado
          error={error}
          successMessage={successMessage}
          onVerSalidas={() => router.push("/prestador/salidas")}
        />

        {/* Formulario */}
        <FormularioNuevaSalida
          embarcaciones={embarcaciones}
          bloques={bloques}
          brazaletesDisponibles={brazaletesDisponibles}
          loadingBloques={loadingBloques}
          embarcacionesConSalidasPorBloque={embarcacionesConSalidasPorBloque}
          isSubmitting={isSubmitting}
          registrandoBrazaletes={registrandoBrazaletes}
          loading={loading}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
