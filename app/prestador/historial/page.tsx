"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { getMisSalidas, getMisEstadisticas } from "@/actions/prestador";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Ship,
  Calendar,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  TrendingUp,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Salida } from "@/lib/types/salida";
import { formatearFechaSalida } from "@/lib/utils";

interface HistorialFilters {
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  page: number;
  limit: number;
}

interface HistorialStats {
  total_salidas: number;
  total_pasajeros: number;
  promedio_pasajeros_por_salida: number;
  por_estado: {
    programadas: number;
    en_curso: number;
    completadas: number;
    canceladas: number;
  };
}

export default function HistorialPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();

  const [salidas, setSalidas] = useState<Salida[]>([]);
  const [stats, setStats] = useState<HistorialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSalidas, setTotalSalidas] = useState(0);

  const [filters, setFilters] = useState<HistorialFilters>({
    fechaInicio: "",
    fechaFin: "",
    estado: "todos",
    page: 1,
    limit: 10,
  });

  const loadData = useCallback(async (filtersToUse: HistorialFilters) => {
    try {
      setLoading(true);
      setError("");

      console.log("📊 Historial: Cargando datos...", filtersToUse);

      // Cargar salidas con filtros
      const salidasResult = await getMisSalidas({
        page: filtersToUse.page,
        limit: filtersToUse.limit,
        fecha: filtersToUse.fechaInicio,
        estado:
          filtersToUse.estado === "todos" ? undefined : filtersToUse.estado,
      });

      if (salidasResult.success && salidasResult.data) {
        setSalidas(salidasResult.data.salidas || []);
        setTotalPages(salidasResult.data.pagination?.totalPages || 1);
        setTotalSalidas(salidasResult.data.pagination?.total || 0);
        console.log(
          "📊 Historial: Salidas cargadas:",
          salidasResult.data.salidas?.length
        );
      } else {
        throw new Error("Error al cargar salidas");
      }

      // Intentar cargar estadísticas (opcional, puede fallar si no hay permisos)
      try {
        const statsResult = await getMisEstadisticas(
          filtersToUse.fechaInicio,
          filtersToUse.fechaFin
        );

        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data.estadisticas);
          console.log(
            "📊 Historial: Estadísticas cargadas:",
            statsResult.data.estadisticas
          );
        }
      } catch (statsError) {
        console.warn(
          "📊 Historial: No se pudieron cargar las estadísticas:",
          statsError
        );
        // Las estadísticas son opcionales, no fallar la operación completa
        setStats(null);
      }
    } catch (error) {
      console.error("📊 Historial: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      // Establecer fechas por defecto (últimos 30 días)
      const fechaFin = new Date();
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaFin.getDate() - 30);

      const defaultFilters = {
        fechaInicio: fechaInicio.toISOString().split("T")[0],
        fechaFin: fechaFin.toISOString().split("T")[0],
        estado: "todos",
        page: 1,
        limit: 10,
      };

      setFilters(defaultFilters);
      loadData(defaultFilters);
    }
  }, [isLoading, isAuthorized, user, loadData]);

  const handleFilterChange = (
    key: keyof HistorialFilters,
    value: string | number
  ) => {
    const newFilters = { ...filters, [key]: value, page: 1 }; // Reset a página 1
    setFilters(newFilters);
    setCurrentPage(1);
    loadData(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    setCurrentPage(newPage);
    loadData(newFilters);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "programada":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "en_curso":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completada":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelada_por_clima":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelada_capitaria":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "programada":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "en_curso":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "completada":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelada":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "cancelada_por_clima":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "cancelada_capitaria":
        return <AlertTriangle className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "programada":
        return "Programada";
      case "en_curso":
        return "En Curso";
      case "completada":
        return "Completada";
      case "cancelada":
        return "Cancelada";
      case "cancelada_por_clima":
        return "Cancelada por Clima";
      case "cancelada_capitaria":
        return "Cancelada por Capitanía";
      default:
        return estado;
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
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="Historial de Salidas"
        description="Consulta el historial completo de tus salidas turísticas"
        breadcrumbs={[
          { label: "Dashboard", href: "/prestador" },
          { label: "Historial" },
        ]}
        backHref="/prestador"
        backLabel="Volver al Dashboard"
        onRefresh={() => loadData(filters)}
        refreshing={loading}
        badge={
          totalSalidas > 0
            ? {
                text: `${totalSalidas} salidas`,
                variant: "secondary",
              }
            : undefined
        }
      />

      <div className="px-6 py-6 space-y-6">
        {/* Error general */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Estadísticas del período */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Estadísticas del Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.total_salidas}
                  </div>
                  <div className="text-sm text-blue-700">Total Salidas</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.total_pasajeros}
                  </div>
                  <div className="text-sm text-green-700">Total Pasajeros</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.promedio_pasajeros_por_salida.toFixed(1)}
                  </div>
                  <div className="text-sm text-purple-700">
                    Promedio por Salida
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.por_estado.completadas}
                  </div>
                  <div className="text-sm text-orange-700">Completadas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={filters.fechaInicio}
                  onChange={(e) =>
                    handleFilterChange("fechaInicio", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="fechaFin">Fecha Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={filters.fechaFin}
                  onChange={(e) =>
                    handleFilterChange("fechaFin", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={filters.estado}
                  onValueChange={(value) => handleFilterChange("estado", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="programada">Programada</SelectItem>
                    <SelectItem value="en_curso">En Curso</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                    <SelectItem value="cancelada_por_clima">
                      Cancelada por Clima
                    </SelectItem>
                    <SelectItem value="cancelada_capitaria">
                      Cancelada por Capitanía
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="limit">Resultados por página</Label>
                <Select
                  value={filters.limit.toString()}
                  onValueChange={(value) =>
                    handleFilterChange("limit", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de salidas */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
                <p className="text-gray-600">Cargando historial...</p>
              </div>
            </div>
          ) : salidas.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4">
                {salidas.map((salida) => (
                  <Card
                    key={salida.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={getEstadoColor(salida.estado)}>
                              <span className="flex items-center gap-1">
                                {getEstadoIcon(salida.estado)}
                                {getEstadoLabel(salida.estado)}
                              </span>
                            </Badge>
                            <div className="text-sm text-gray-600">
                              ID: {salida.id.slice(-8)}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="text-sm text-gray-600">
                                  Fecha
                                </div>
                                <div className="font-medium">
                                  {formatearFechaSalida(salida.fecha)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Ship className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="text-sm text-gray-600">
                                  Embarcación
                                </div>
                                <div className="font-medium">
                                  {salida.embarcacion?.nombre ||
                                    "Sin embarcación"}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="text-sm text-gray-600">
                                  Pasajeros
                                </div>
                                <div className="font-medium">
                                  {salida.numero_pasajeros}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <div>
                                <div className="text-sm text-gray-600">
                                  Destino
                                </div>
                                <div className="font-medium">
                                  {salida.destino || "Sin destino"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {salida.observaciones && (
                            <div className="mb-4">
                              <div className="text-sm text-gray-600 mb-1">
                                Observaciones
                              </div>
                              <p className="text-sm bg-gray-50 p-2 rounded">
                                {salida.observaciones}
                              </p>
                            </div>
                          )}

                          {salida.bloque && (
                            <div className="mb-4">
                              <div className="text-sm text-gray-600 mb-1">
                                Bloque Horario
                              </div>
                              <p className="text-sm bg-blue-50 p-2 rounded">
                                {salida.bloque.nombre} (
                                {salida.bloque.hora_inicio} -{" "}
                                {salida.bloque.hora_fin})
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
                          >
                            <Link href={`/prestador/salidas/${salida.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Detalles
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Mostrando {(currentPage - 1) * filters.limit + 1} -{" "}
                        {Math.min(currentPage * filters.limit, totalSalidas)} de{" "}
                        {totalSalidas} salidas
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              const pageNum = i + 1;
                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    currentPage === pageNum
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(pageNum)}
                                  className={
                                    currentPage === pageNum
                                      ? "bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
                                      : ""
                                  }
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron salidas
              </h3>
              <p className="text-gray-600 mb-4">
                No hay salidas que coincidan con los filtros seleccionados
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  const newFilters = {
                    fechaInicio: "",
                    fechaFin: "",
                    estado: "todos",
                    page: 1,
                    limit: 10,
                  };
                  setFilters(newFilters);
                  loadData(newFilters);
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
