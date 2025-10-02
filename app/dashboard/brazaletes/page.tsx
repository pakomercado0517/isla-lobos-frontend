"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getInventarioBrazaletes,
  getLotesBrazaletes,
  createLoteBrazaletes,
} from "@/actions/brazaletes";
import { InventarioCard } from "@/components/brazaletes/InventarioCard";
import { LoteForm } from "@/components/brazaletes/LoteForm";
import { LoteCard } from "@/components/brazaletes/LoteCard";
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
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ShoppingCart,
} from "lucide-react";
import {
  InventarioBrazaletes,
  LoteBrazaletes,
  CreateLoteFormData,
  AlertaBrazaletes,
} from "@/lib/types/brazaletes";

export default function BrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user } = useAuth();

  // Estados para datos
  const [inventario, setInventario] = useState<InventarioBrazaletes | null>(
    null
  );
  const [lotes, setLotes] = useState<LoteBrazaletes[]>([]);
  const [alertas, setAlertas] = useState<AlertaBrazaletes[]>([]);

  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creatingLote, setCreatingLote] = useState(false);
  const [createError, setCreateError] = useState("");

  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState<"isla" | "arrecife" | "todos">(
    "todos"
  );
  const [filtroEstado, setFiltroEstado] = useState<
    "activo" | "agotado" | "vencido" | "cancelado" | "todos"
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

      console.log("🎫 Brazaletes: Cargando datos del inventario...");

      // Cargar inventario y lotes en paralelo
      const [inventarioResult, lotesResult] = await Promise.all([
        getInventarioBrazaletes(),
        getLotesBrazaletes({ limit: 50 }),
      ]);

      if (inventarioResult.success && inventarioResult.data) {
        setInventario(inventarioResult.data);
        console.log(
          "🎫 Brazaletes: Inventario cargado:",
          inventarioResult.data
        );
      } else {
        throw new Error(
          inventarioResult.message || "Error al cargar inventario"
        );
      }

      if (lotesResult.success && lotesResult.data) {
        setLotes(lotesResult.data.lotes);
        console.log(
          "🎫 Brazaletes: Lotes cargados:",
          lotesResult.data.lotes.length
        );
      } else {
        throw new Error(lotesResult.message || "Error al cargar lotes");
      }

      // TODO: Cargar alertas cuando esté disponible
      setAlertas([]);
    } catch (error) {
      console.error("🎫 Brazaletes: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLote = async (data: CreateLoteFormData) => {
    try {
      setCreatingLote(true);
      setCreateError("");

      console.log("🎫 Brazaletes: Creando lote:", data);
      const result = await createLoteBrazaletes(data);

      if (result.success) {
        console.log("🎫 Brazaletes: Lote creado exitosamente");
        setShowCreateForm(false);
        await loadData(); // Recargar datos
      } else {
        throw new Error(result.message || "Error al crear lote");
      }
    } catch (error) {
      console.error("🎫 Brazaletes: Error al crear lote:", error);
      setCreateError(
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setCreatingLote(false);
    }
  };

  // Filtrar lotes
  const lotesFiltrados = lotes.filter((lote) => {
    const tipoMatch = filtroTipo === "todos" || lote.tipo === filtroTipo;
    const estadoMatch =
      filtroEstado === "todos" || lote.estado === filtroEstado;
    return tipoMatch && estadoMatch;
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
            Gestión de Brazaletes
          </h1>
          <p className="text-gray-600 mt-1">
            Administra el inventario, lotes y ventas de brazaletes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/dashboard/brazaletes/ventas">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ver Ventas
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

      {/* Alertas del sistema */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((alerta, index) => (
            <Alert
              key={index}
              variant={alerta.severidad === "alta" ? "destructive" : "default"}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alerta.tipo}:</strong> {alerta.mensaje}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Contenido principal */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
            <p className="text-gray-600">Cargando datos de brazaletes...</p>
          </div>
        </div>
      ) : inventario ? (
        <Tabs defaultValue="inventario" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="lotes">Lotes ({lotes.length})</TabsTrigger>
          </TabsList>

          {/* Tab de Inventario */}
          <TabsContent value="inventario" className="space-y-6">
            <InventarioCard
              inventario={inventario}
              onCrearLote={() => setShowCreateForm(true)}
              onVerDetalles={() => {
                /* TODO: Implementar vista de detalles */
              }}
            />
          </TabsContent>

          {/* Tab de Lotes */}
          <TabsContent value="lotes" className="space-y-6">
            {/* Filtros */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Tipo:</label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="isla">🏝️ Isla</option>
                  <option value="arrecife">🐠 Arrecife</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Estado:</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="activo">Activo</option>
                  <option value="agotado">Agotado</option>
                  <option value="vencido">Vencido</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div className="ml-auto">
                <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Lote
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Lote de Brazaletes</DialogTitle>
                      <DialogDescription>
                        Complete la información para crear un nuevo lote de
                        brazaletes
                      </DialogDescription>
                    </DialogHeader>
                    <LoteForm
                      onSubmit={handleCreateLote}
                      loading={creatingLote}
                      error={createError}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Lista de lotes */}
            {lotesFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lotesFiltrados.map((lote) => (
                  <LoteCard
                    key={lote.id}
                    lote={lote}
                    onVerDetalles={(lote) => {
                      console.log("Ver detalles del lote:", lote);
                      // TODO: Implementar vista de detalles
                    }}
                    onEditar={(lote) => {
                      console.log("Editar lote:", lote);
                      // TODO: Implementar edición de lote
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay lotes disponibles
                </h3>
                <p className="text-gray-600 mb-4">
                  {filtroTipo !== "todos" || filtroEstado !== "todos"
                    ? "No se encontraron lotes con los filtros aplicados"
                    : "Crea tu primer lote de brazaletes para comenzar"}
                </p>
                {filtroTipo === "todos" && filtroEstado === "todos" && (
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Primer Lote
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error al cargar datos
          </h3>
          <p className="text-gray-600 mb-4">
            No se pudieron cargar los datos de brazaletes
          </p>
          <Button onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      )}
    </div>
  );
}
