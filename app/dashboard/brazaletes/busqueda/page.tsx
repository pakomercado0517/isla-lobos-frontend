"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  buscarBrazaletes,
  getUsuarios,
  getLotesBrazaletes,
} from "@/actions/brazaletes";
import { BusquedaAvanzada } from "@/components/brazaletes/BusquedaAvanzada";
import { ResultadosBusqueda } from "@/components/brazaletes/ResultadosBusqueda";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { FiltrosBrazaletes, Brazalete } from "@/lib/types/brazaletes";

export default function BusquedaBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user } = useAuth();

  const [brazaletes, setBrazaletes] = useState<Brazalete[]>([]);
  const [prestadores, setPrestadores] = useState<
    Array<{ id: string; nombre: string }>
  >([]);
  const [lotes, setLotes] = useState<
    Array<{ id: string; numero_lote: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtrosActivos, setFiltrosActivos] = useState<FiltrosBrazaletes>({});
  const [filtrosGuardados, setFiltrosGuardados] = useState<
    Array<{
      id: string;
      nombre: string;
      filtros: FiltrosBrazaletes;
    }>
  >([]);

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadInitialData();
    }
  }, [isLoading, isAuthorized, user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔍 Búsqueda: Cargando datos iniciales...");

      // Cargar prestadores y lotes para los filtros
      const [prestadoresResult, lotesResult] = await Promise.all([
        getUsuarios(1, 100, { rol: "prestador", activo: true }),
        getLotesBrazaletes({ limit: 100 }),
      ]);

      if (prestadoresResult.success && prestadoresResult.data) {
        const prestadoresData =
          prestadoresResult.data.usuarios?.map((usuario) => ({
            id: usuario.id,
            nombre: usuario.nombre,
          })) || [];
        setPrestadores(prestadoresData);
        console.log(
          "🔍 Búsqueda: Prestadores cargados:",
          prestadoresData.length
        );
      }

      if (lotesResult.success && lotesResult.data) {
        const lotesData =
          lotesResult.data.lotes?.map((lote) => ({
            id: lote.id,
            numero_lote: lote.numero_lote,
          })) || [];
        setLotes(lotesData);
        console.log("🔍 Búsqueda: Lotes cargados:", lotesData.length);
      }

      // Cargar filtros guardados desde localStorage
      loadFiltrosGuardados();
    } catch (error) {
      console.error("🔍 Búsqueda: Error al cargar datos iniciales:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const loadFiltrosGuardados = () => {
    try {
      const filtrosGuardadosStr = localStorage.getItem(
        "brazaletes-filtros-guardados"
      );
      if (filtrosGuardadosStr) {
        const filtros = JSON.parse(filtrosGuardadosStr);
        setFiltrosGuardados(filtros);
        console.log("🔍 Búsqueda: Filtros guardados cargados:", filtros.length);
      }
    } catch (error) {
      console.error("🔍 Búsqueda: Error al cargar filtros guardados:", error);
    }
  };

  const saveFiltrosGuardados = (
    filtros: Array<{ id: string; nombre: string; filtros: FiltrosBrazaletes }>
  ) => {
    try {
      localStorage.setItem(
        "brazaletes-filtros-guardados",
        JSON.stringify(filtros)
      );
      setFiltrosGuardados(filtros);
    } catch (error) {
      console.error("🔍 Búsqueda: Error al guardar filtros:", error);
    }
  };

  const handleSearch = async (filtros: FiltrosBrazaletes) => {
    try {
      setLoading(true);
      setError("");
      setFiltrosActivos(filtros);

      console.log("🔍 Búsqueda: Buscando con filtros:", filtros);

      const result = await buscarBrazaletes(filtros);

      if (result.success && result.data) {
        setBrazaletes(result.data.brazaletes || []);
        console.log(
          "🔍 Búsqueda: Resultados encontrados:",
          result.data.brazaletes?.length || 0
        );
      } else {
        throw new Error(result.message || "Error al buscar brazaletes");
      }
    } catch (error) {
      console.error("🔍 Búsqueda: Error al buscar:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setBrazaletes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFiltros = (nombre: string, filtros: FiltrosBrazaletes) => {
    const nuevoFiltro = {
      id: Date.now().toString(),
      nombre,
      filtros,
    };

    const nuevosFiltros = [...filtrosGuardados, nuevoFiltro];
    saveFiltrosGuardados(nuevosFiltros);
    console.log("🔍 Búsqueda: Filtros guardados:", nombre);
  };

  const handleExportar = (formato: "csv" | "excel") => {
    try {
      console.log("🔍 Búsqueda: Exportando en formato:", formato);

      if (brazaletes.length === 0) {
        alert("No hay datos para exportar");
        return;
      }

      // Preparar datos para exportación
      const datosExportacion = brazaletes.map((brazalete) => ({
        codigo: brazalete.codigo,
        tipo: brazalete.tipo,
        estado: brazalete.estado,
        precio: brazalete.precio,
        prestador: brazalete.prestador?.nombre || "",
        lote: brazalete.lote?.numero_lote || "",
        fecha_creacion: new Date(brazalete.fecha_creacion).toLocaleDateString(
          "es-MX"
        ),
        fecha_asignacion: brazalete.fecha_asignacion
          ? new Date(brazalete.fecha_asignacion).toLocaleDateString("es-MX")
          : "",
        fecha_uso: brazalete.fecha_uso
          ? new Date(brazalete.fecha_uso).toLocaleDateString("es-MX")
          : "",
        turista_nacionalidad: brazalete.turista_nacionalidad || "",
        turista_edad: brazalete.turista_edad || "",
      }));

      if (formato === "csv") {
        // Exportar como CSV
        const headers = Object.keys(datosExportacion[0]).join(",");
        const rows = datosExportacion.map((row) =>
          Object.values(row).join(",")
        );
        const csvContent = [headers, ...rows].join("\n");

        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `brazaletes-busqueda-${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Para Excel, usar una librería como xlsx o simplemente exportar como CSV con extensión .xlsx
        const headers = Object.keys(datosExportacion[0]).join("\t");
        const rows = datosExportacion.map((row) =>
          Object.values(row).join("\t")
        );
        const excelContent = [headers, ...rows].join("\n");

        const blob = new Blob([excelContent], {
          type: "application/vnd.ms-excel",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `brazaletes-busqueda-${new Date().toISOString().split("T")[0]}.xls`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      console.log("🔍 Búsqueda: Exportación completada");
    } catch (error) {
      console.error("🔍 Búsqueda: Error al exportar:", error);
      alert("Error al exportar los datos");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Search className="w-8 h-8 animate-pulse mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Cargando búsqueda avanzada...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Búsqueda Avanzada de Brazaletes
          </h1>
          <p className="text-gray-600 mt-1">
            Busca y filtra brazaletes con criterios específicos
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSearch({})}
            disabled={loading}
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar Todos
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

      {/* Componente de búsqueda */}
      <BusquedaAvanzada
        onSearch={handleSearch}
        loading={loading}
        resultadosCount={brazaletes.length}
        filtrosGuardados={filtrosGuardados}
        onSaveFiltros={handleSaveFiltros}
        prestadores={prestadores}
        lotes={lotes}
      />

      {/* Resultados */}
      {Object.keys(filtrosActivos).length > 0 && (
        <ResultadosBusqueda
          brazaletes={brazaletes}
          loading={loading}
          onVerDetalle={(brazalete) => console.log("Ver detalle:", brazalete)}
          onExportar={handleExportar}
          onActualizar={() => handleSearch(filtrosActivos)}
        />
      )}

      {/* Instrucciones iniciales */}
      {Object.keys(filtrosActivos).length === 0 && brazaletes.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Búsqueda Avanzada de Brazaletes
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Utiliza los filtros de búsqueda para encontrar brazaletes
            específicos. Puedes buscar por código, tipo, estado, prestador,
            lote, fechas y más.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => handleSearch({ estado: "disponible" })}
              disabled={loading}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Ver Disponibles
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSearch({ estado: "utilizado" })}
              disabled={loading}
            >
              <FileText className="w-4 h-4 mr-2" />
              Ver Utilizados
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

