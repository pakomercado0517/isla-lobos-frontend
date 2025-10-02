"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getInventarioBrazaletes,
  venderBrazaletes,
  getReporteVentasBrazaletes,
} from "@/actions/brazaletes";
import { getUsuarios } from "@/actions/dashboard";
import { VentaForm } from "@/components/brazaletes/VentaForm";
import { VentaCard } from "@/components/brazaletes/VentaCard";
import { InventarioWidget } from "@/components/brazaletes/InventarioWidget";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Plus,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Package,
} from "lucide-react";
import {
  InventarioBrazaletes,
  VentaBrazaletes,
  VentaBrazaletesFormData,
  ReporteVentasBrazaletes,
} from "@/lib/types/brazaletes";
import { User } from "@/lib/types/auth";

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
            fecha_fin: new Date().toISOString().split("T")[0],
          }),
        ]);

      if (inventarioResult.success && inventarioResult.data) {
        setInventario(inventarioResult.data);
        console.log("💰 Ventas: Inventario cargado:", inventarioResult.data);
      }

      if (prestadoresResult.success && prestadoresResult.data) {
        setPrestadores(prestadoresResult.data.usuarios || []);
        console.log(
          "💰 Ventas: Prestadores cargados:",
          prestadoresResult.data.usuarios?.length
        );
      }

      if (reporteResult.success && reporteResult.data) {
        setReporte(reporteResult.data);
        setVentas(reporteResult.data.ventas_detalle || []);
        console.log("💰 Ventas: Reporte cargado:", reporteResult.data);
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

        // Mostrar información detallada de la venta
        const { rango_brazaletes, prestador } = result.data;

        // Mostrar mensaje de éxito con detalles
        alert(
          `Venta realizada exitosamente!\n\n` +
            `Prestador: ${prestador.nombre}\n` +
            `Cantidad: ${rango_brazaletes.cantidad_total} brazaletes\n` +
            `Rango: ${rango_brazaletes.numero_inicial} - ${rango_brazaletes.numero_final}\n` +
            `Códigos: ${rango_brazaletes.primer_codigo} a ${rango_brazaletes.ultimo_codigo}`
        );

        setShowVentaForm(false);
        await loadData(); // Recargar datos
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Ventas de Brazaletes
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona las ventas de brazaletes a prestadores
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/dashboard/brazaletes/reportes">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Reportes
            </a>
          </Button>
          <Button variant="outline" onClick={loadData} disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Error general */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Widget de inventario */}
      {inventario && <InventarioWidget inventario={inventario} />}

      {/* Contenido principal */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
            <p className="text-gray-600">Cargando datos de ventas...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="ventas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ventas">Ventas ({ventas.length})</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>

          {/* Tab de Ventas */}
          <TabsContent value="ventas" className="space-y-6">
            {/* Filtros */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Prestador:</label>
                <select
                  value={filtroPrestador}
                  onChange={(e) => setFiltroPrestador(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="todos">Todos</option>
                  {prestadores.map((prestador) => (
                    <option key={prestador.id} value={prestador.id}>
                      {prestador.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Tipo:</label>
                <select
                  value={filtroTipo}
                  onChange={(e) =>
                    setFiltroTipo(e.target.value as "universal" | "todos")
                  }
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="universal">🎫 Universal</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Estado:</label>
                <select
                  value={filtroEstado}
                  onChange={(e) =>
                    setFiltroEstado(
                      e.target.value as
                        | "pagado"
                        | "pendiente"
                        | "cancelado"
                        | "todos"
                    )
                  }
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="pagado">Pagado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div className="ml-auto">
                <Dialog open={showVentaForm} onOpenChange={setShowVentaForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Venta
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Nueva Venta de Brazaletes</DialogTitle>
                      <DialogDescription>
                        Complete la información para realizar una venta de
                        brazaletes
                      </DialogDescription>
                    </DialogHeader>
                    <VentaForm
                      onSubmit={handleVenta}
                      loading={realizandoVenta}
                      error={ventaError}
                      prestadores={prestadores}
                      inventarioDisponible={
                        inventario?.por_tipo || { universal: 0 }
                      }
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Lista de ventas */}
            {ventasFiltradas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ventasFiltradas.map((venta) => (
                  <VentaCard
                    key={venta.id}
                    venta={venta}
                    onVerDetalles={(venta) => {
                      console.log("Ver detalles de la venta:", venta);
                      // TODO: Implementar vista de detalles
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay ventas registradas
                </h3>
                <p className="text-gray-600 mb-4">
                  {filtroPrestador !== "todos" ||
                  filtroTipo !== "todos" ||
                  filtroEstado !== "todos"
                    ? "No se encontraron ventas con los filtros aplicados"
                    : "Realiza tu primera venta de brazaletes"}
                </p>
                {filtroPrestador === "todos" &&
                  filtroTipo === "todos" &&
                  filtroEstado === "todos" && (
                    <Button onClick={() => setShowVentaForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Realizar Primera Venta
                    </Button>
                  )}
              </div>
            )}
          </TabsContent>

          {/* Tab de Estadísticas */}
          <TabsContent value="estadisticas" className="space-y-6">
            {reporte ? (
              <div className="space-y-6">
                {/* Resumen general */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 font-medium">
                          Total Ventas
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          {reporte.resumen.total_ventas}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Package className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600 font-medium">
                          Brazaletes Vendidos
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          {reporte.resumen.total_brazaletes}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-600 font-medium">
                          Ingresos Totales
                        </p>
                        <p className="text-2xl font-bold text-purple-900">
                          $
                          {reporte.resumen.total_ingresos.toLocaleString(
                            "es-MX"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ventas por prestador */}
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">
                    Ventas por Prestador
                  </h3>
                  <div className="space-y-3">
                    {reporte.ventas_por_prestador.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.prestador.nombre}</p>
                          <p className="text-sm text-gray-600">
                            {item.prestador.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            ${item.total_ingresos.toLocaleString("es-MX")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.total_brazaletes} brazaletes
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay estadísticas disponibles
                </h3>
                <p className="text-gray-600">
                  Las estadísticas aparecerán una vez que se realicen ventas
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
