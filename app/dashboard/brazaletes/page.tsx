"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import {
  getInventarioBrazaletes,
  getLotesBrazaletes,
  createLoteBrazaletes,
} from "@/actions/brazaletes";
import { InventarioCard } from "@/components/brazaletes/InventarioCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InventarioBrazaletes,
  LoteBrazaletes,
  CreateLoteFormData,
  AlertaBrazaletes,
} from "@/lib/types/brazaletes";
import {
  BrazaletesHeader,
  FiltrosLotes,
  ListaLotes,
  AlertasSistema,
  ErrorState,
  DialogCrearLote,
  LoadingState,
  AuthLoadingState,
  ErrorAlert,
} from "./components";

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

  // Debug: Log cuando cambie showCreateForm
  useEffect(() => {}, [showCreateForm]);

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

      // Cargar inventario y lotes en paralelo
      const [inventarioResult, lotesResult] = await Promise.all([
        getInventarioBrazaletes(),
        getLotesBrazaletes({ limit: 50 }),
      ]);

      if (inventarioResult.success && inventarioResult.data) {
        setInventario(inventarioResult.data);
      } else {
        throw new Error(
          inventarioResult.message || "Error al cargar inventario"
        );
      }

      if (lotesResult.success && lotesResult.data) {
        setLotes(lotesResult.data.lotes);
      } else {
        throw new Error(lotesResult.message || "Error al cargar lotes");
      }

      // TODO: Cargar alertas cuando esté disponible
      setAlertas([]);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al cargar datos de brazaletes", error, {
        userId: user?.id,
      });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLote = async (data: CreateLoteFormData) => {
    try {
      setCreatingLote(true);
      setCreateError("");

      const result = await createLoteBrazaletes(data);

      if (result.success) {
        setShowCreateForm(false);
        await loadData(); // Recargar datos
      } else {
        throw new Error(result.message || "Error al crear lote");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al crear lote de brazaletes", error, {
        userId: user?.id,
        data,
      });
      setCreateError(errorMsg);
    } finally {
      setCreatingLote(false);
    }
  };

  // Filtrar lotes
  const lotesFiltrados = lotes.filter((lote) => {
    const tipoMatch = filtroTipo === "todos"; // Todos los lotes son "universal"
    const estadoMatch =
      filtroEstado === "todos" || lote.estado === filtroEstado;
    return tipoMatch && estadoMatch;
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
      <BrazaletesHeader loading={loading} onRefresh={loadData} />

      <ErrorAlert error={error} />

      <AlertasSistema alertas={alertas} />

      {/* Contenido principal */}
      {loading ? (
        <LoadingState />
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
            <FiltrosLotes
              filtroTipo={filtroTipo}
              filtroEstado={filtroEstado}
              onFiltroTipoChange={setFiltroTipo}
              onFiltroEstadoChange={setFiltroEstado}
              onCrearLote={() => setShowCreateForm(true)}
            />

            <ListaLotes
              lotes={lotesFiltrados}
              filtroTipo={filtroTipo}
              filtroEstado={filtroEstado}
              onCrearLote={() => setShowCreateForm(true)}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <ErrorState onRetry={loadData} />
      )}

      <DialogCrearLote
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        onSubmit={handleCreateLote}
        loading={creatingLote}
        error={createError}
      />
    </div>
  );
}
