"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getInventarioBrazaletes,
  venderBrazaletes,
  getReporteVentasBrazaletes,
} from "@/actions/brazaletes";
import { getUsuarios } from "@/actions/dashboard";
import { InventarioWidget } from "@/components/brazaletes/InventarioWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InventarioBrazaletes,
  VentaBrazaletes,
  VentaBrazaletesFormData,
  ReporteVentasBrazaletes,
} from "@/lib/types/brazaletes";
import { User } from "@/lib/types/auth";
import {
  VentasHeader,
  FiltrosVentas,
  ListaVentas,
  EstadisticasVentas,
  LoadingState,
  AuthLoadingState,
  ErrorAlert,
  SuccessAlert,
} from "./components";

export default function VentasBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user } = useAuth();

  // Estados para datos
  const [inventario, setInventario] = useState<InventarioBrazaletes | null>(
    null
  );
  const [prestadores, setPrestadores] = useState<User[]>([]);
  const [ventas, setVentas] = useState<VentaBrazaletes[]>([]);
  const [reporte, setReporte] = useState<ReporteVentasBrazaletes | null>(null);

  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showVentaForm, setShowVentaForm] = useState(false);
  const [realizandoVenta, setRealizandoVenta] = useState(false);
  const [ventaError, setVentaError] = useState("");
  const [ventaExito, setVentaExito] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  // Estados para filtros
  const [filtroPrestador, setFiltroPrestador] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<"universal" | "todos">("todos");
  const [filtroEstado, setFiltroEstado] = useState<
    "pagado" | "pendiente" | "cancelado" | "todos"
  >("todos");

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("💰 Ventas: Cargando datos...");

      // Cargar datos en paralelo
      const [inventarioResult, prestadoresResult, reporteResult] =
        await Promise.all([
          getInventarioBrazaletes(),
          getUsuarios(1, 100, { rol: "prestador", activo: true }),
          getReporteVentasBrazaletes({
            fecha_inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0], // Últimos 30 días
            fecha_fin: new Date(Date.now() + 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0], // Incluir hasta mañana para asegurar que las ventas de hoy se incluyan
          }),
        ]);

      console.log("💰 Ventas: Resultado de prestadores:", prestadoresResult);

      if (inventarioResult.success && inventarioResult.data) {
        setInventario(inventarioResult.data);
        console.log("💰 Ventas: Inventario cargado:", inventarioResult.data);
      }

      if (prestadoresResult.success && prestadoresResult.data) {
        setPrestadores(prestadoresResult.data.users || []);
        console.log(
          "💰 Ventas: Prestadores cargados:",
          prestadoresResult.data.users?.length
        );
        console.log("💰 Ventas: Datos completos:", prestadoresResult.data);
      }

      if (reporteResult.success && reporteResult.data) {
        setReporte(reporteResult.data);
        setVentas(reporteResult.data.ventas_detalle || []);
        console.log("💰 Ventas: Reporte cargado:", reporteResult.data);
        console.log(
          "💰 Ventas: Ventas cargadas:",
          reporteResult.data.ventas_detalle?.length || 0
        );
      } else {
        console.error("💰 Ventas: Error al cargar reporte:", reporteResult);
      }
    } catch (error) {
      console.error("💰 Ventas: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleVenta = async (data: VentaBrazaletesFormData) => {
    try {
      setRealizandoVenta(true);
      setVentaError("");

      console.log("💰 Ventas: Realizando venta:", data);
      const result = await venderBrazaletes(data);

      if (result.success) {
        console.log("💰 Ventas: Venta realizada exitosamente");

        // Cerrar el formulario primero
        setShowVentaForm(false);

        // Pequeño delay para asegurar que el backend haya procesado la venta
        console.log("💰 Ventas: Esperando procesamiento del backend...");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Recargar datos después del delay
        console.log("💰 Ventas: Recargando datos después de venta exitosa...");
        await loadData();

        // Mostrar información detallada de la venta después de recargar
        const { rango_brazaletes, prestador } = result.data;

        // Mostrar mensaje de éxito con shadcn/ui Alert
        setVentaExito({
          show: true,
          message: `Venta realizada exitosamente! Prestador: ${prestador.nombre}, Cantidad: ${rango_brazaletes.cantidad_total} brazaletes, Rango: ${rango_brazaletes.numero_inicial} - ${rango_brazaletes.numero_final}`,
        });

        // Auto-ocultar el mensaje después de 8 segundos
        setTimeout(() => {
          setVentaExito({ show: false, message: "" });
        }, 8000);
      } else {
        throw new Error("Error al realizar venta");
      }
    } catch (error) {
      console.error("💰 Ventas: Error al realizar venta:", error);
      setVentaError(
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setRealizandoVenta(false);
    }
  };

  // Filtrar ventas
  const ventasFiltradas = ventas.filter((venta) => {
    const prestadorMatch =
      filtroPrestador === "todos" || venta.prestador_id === filtroPrestador;
    const tipoMatch = filtroTipo === "todos" || venta.lote?.tipo === filtroTipo;
    const estadoMatch =
      filtroEstado === "todos" || venta.estado_pago === filtroEstado;
    return prestadorMatch && tipoMatch && estadoMatch;
  });

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <AuthLoadingState />;
  }

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <VentasHeader loading={loading} onRefresh={loadData} />

      <ErrorAlert error={error} />

      <SuccessAlert show={ventaExito.show} message={ventaExito.message} />

      {/* Widget de inventario */}
      {inventario && <InventarioWidget inventario={inventario} />}

      {/* Contenido principal */}
      {loading ? (
        <LoadingState />
      ) : (
        <Tabs defaultValue="ventas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ventas">Ventas ({ventas.length})</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          {/* Tab de Ventas */}
          <TabsContent value="ventas" className="space-y-6">
            <FiltrosVentas
              filtroPrestador={filtroPrestador}
              filtroTipo={filtroTipo}
              filtroEstado={filtroEstado}
              prestadores={prestadores}
              showVentaForm={showVentaForm}
              realizandoVenta={realizandoVenta}
              ventaError={ventaError}
              inventarioDisponible={inventario?.por_tipo || { universal: 0 }}
              onFiltroPrestadorChange={setFiltroPrestador}
              onFiltroTipoChange={setFiltroTipo}
              onFiltroEstadoChange={setFiltroEstado}
              onShowVentaFormChange={setShowVentaForm}
              onVentaSubmit={handleVenta}
            />

            <ListaVentas
              ventas={ventasFiltradas}
              filtroPrestador={filtroPrestador}
              filtroTipo={filtroTipo}
              filtroEstado={filtroEstado}
              onShowVentaForm={() => setShowVentaForm(true)}
            />
          </TabsContent>

          {/* Tab de Estadísticas */}
          <TabsContent value="estadisticas" className="space-y-6">
            {reporte && <EstadisticasVentas reporte={reporte} />}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}