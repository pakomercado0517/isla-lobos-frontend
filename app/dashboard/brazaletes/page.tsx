"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
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
  console.log("🎫 BrazaletesPage renderizando");

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
  useEffect(() => {
    console.log("🎫 showCreateForm cambió a:", showCreateForm);
  }, [showCreateForm]);

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
      console.log(
        "🎫 Brazaletes: Datos del formulario:",
        JSON.stringify(data, null, 2)
      );
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