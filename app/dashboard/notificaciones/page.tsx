"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NotificacionesHeader,
  EstadoServicioCard,
  FormularioIndividual,
  FormularioMasivo,
  FormularioAlertaClima,
  FormularioAlertaPermisos,
  PlantillasCard,
  LoadingState,
  ErrorAlert,
} from "./components";
import { getEstadoServicios } from "@/actions/notificaciones";
import {
  EstadoServiciosNotificaciones,
  CanalNotificacion,
} from "@/lib/types/notificaciones";
import { clientLogger } from "@/lib/logger-client";

export default function NotificacionesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [estadoServicios, setEstadoServicios] =
    useState<EstadoServiciosNotificaciones | null>(null);
  const [canalSeleccionado, setCanalSeleccionado] =
    useState<CanalNotificacion>("whatsapp");

  useEffect(() => {
    if (!authLoading && !user) {
      clientLogger.warn("Usuario no autenticado, redirigiendo a login");
      router.push("/login");
      return;
    }

    if (user && user.rol !== "conanp") {
      clientLogger.warn("Usuario sin permisos para notificaciones", {
        rol: user.rol,
      });
      router.push("/dashboard");
      return;
    }

    if (user) {
      loadEstadoServicio();
    }
  }, [user, authLoading, router]);

  const loadEstadoServicio = async () => {
    try {
      setLoading(true);
      setError("");

      clientLogger.info("Cargando estado de los servicios de notificaciones");

      const result = await getEstadoServicios();

      if (result.success && result.data) {
        setEstadoServicios(result.data);
        clientLogger.info("Estado de los servicios cargado", {
          whatsapp: result.data.whatsapp.configurado,
          email: result.data.email.configurado,
        });
      } else {
        throw new Error(result.error || "Error al cargar estado");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      clientLogger.error("Error al cargar estado de los servicios", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorAlert error={error} onRetry={loadEstadoServicio} />;
  }

  return (
    <div className="space-y-6">
      <NotificacionesHeader
        estadoServicios={estadoServicios}
        canalSeleccionado={canalSeleccionado}
        onCanalChange={setCanalSeleccionado}
        onRefresh={loadEstadoServicio}
      />

      {/* Alertas de configuración */}
      {estadoServicios && (
        <>
          {canalSeleccionado === "whatsapp" &&
            !estadoServicios.whatsapp.configurado && (
              <ErrorAlert error="El servicio de WhatsApp no está configurado. Contacte al administrador del sistema." />
            )}

          {canalSeleccionado === "email" &&
            !estadoServicios.email.configurado && (
              <ErrorAlert error="El servicio de Email no está configurado. Contacte al administrador del sistema." />
            )}

          {canalSeleccionado === "ambos" &&
            (!estadoServicios.whatsapp.configurado ||
              !estadoServicios.email.configurado) && (
              <ErrorAlert error="Al menos uno de los servicios no está configurado. Algunos envíos podrían fallar." />
            )}
        </>
      )}

      <Tabs defaultValue="individual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="masivo">Masivo</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FormularioIndividual canal={canalSeleccionado} />
            </div>
            <div>
              <EstadoServicioCard
                estadoServicios={estadoServicios}
                canalSeleccionado={canalSeleccionado}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="masivo" className="space-y-4">
          <FormularioMasivo canal={canalSeleccionado} />
        </TabsContent>

        <TabsContent value="alertas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormularioAlertaClima canal={canalSeleccionado} />
            <FormularioAlertaPermisos canal={canalSeleccionado} />
          </div>
        </TabsContent>

        <TabsContent value="plantillas" className="space-y-4">
          <PlantillasCard canal={canalSeleccionado} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
