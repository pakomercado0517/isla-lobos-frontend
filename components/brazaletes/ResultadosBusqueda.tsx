"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Package,
  Calendar,
  User,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Brazalete, RespuestaBusquedaBrazaletes } from "@/lib/types/brazaletes";

interface ResultadosBusquedaProps {
  brazaletes: Brazalete[];
  estadisticas?: RespuestaBusquedaBrazaletes["estadisticas"];
  pagination?: RespuestaBusquedaBrazaletes["pagination"];
  filtrosAplicados?: RespuestaBusquedaBrazaletes["filtros_aplicados"];
  loading?: boolean;
  onVerDetalle?: (brazalete: Brazalete) => void;
  onExportar?: (formato: "csv" | "excel") => void;
  onActualizar?: () => void;
  onPaginar?: (page: number) => void;
}

export function ResultadosBusqueda({
  brazaletes,
  estadisticas,
  pagination,
  loading = false,
  onVerDetalle,
  onExportar,
  onActualizar,
  onPaginar,
}: ResultadosBusquedaProps) {
  const [formatoExportacion, setFormatoExportacion] = useState<"csv" | "excel">(
    "excel"
  );
  const [brazaleteSeleccionado, setBrazaleteSeleccionado] =
    useState<Brazalete | null>(null);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-100 text-green-800 border-green-200";
      case "asignado":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "utilizado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "perdido":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "disponible":
        return <CheckCircle className="w-4 h-4" />;
      case "asignado":
        return <Clock className="w-4 h-4" />;
      case "utilizado":
        return <CheckCircle className="w-4 h-4" />;
      case "perdido":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTipoIcon = () => {
    return "🎫";
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstadisticas = () => {
    // Usar estadísticas de la API si están disponibles, sino calcularlas localmente
    if (estadisticas) {
      return {
        total: estadisticas.total_encontrados,
        porEstado: {
          disponible: estadisticas.por_estado.disponible,
          asignado: estadisticas.por_estado.asignado,
          utilizado: estadisticas.por_estado.utilizado,
          perdido: estadisticas.por_estado.perdido,
        },
        porNacionalidad: estadisticas.por_nacionalidad,
      };
    }

    // Fallback: calcular estadísticas localmente
    const total = brazaletes.length;
    const porEstado = brazaletes.reduce((acc, brazalete) => {
      acc[brazalete.estado] = (acc[brazalete.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porTipo = brazaletes.reduce((acc, brazalete) => {
      acc[brazalete.tipo] = (acc[brazalete.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, porEstado, porTipo };
  };

  const estadisticasCalculadas = getEstadisticas();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
              <p className="text-gray-600">Buscando brazaletes...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-blue-600 font-medium">
                  Total
                </p>
                <p className="text-lg md:text-2xl font-bold text-blue-900">
                  {estadisticasCalculadas.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-green-600 font-medium">
                  Disponibles
                </p>
                <p className="text-lg md:text-2xl font-bold text-green-900">
                  {estadisticasCalculadas.porEstado.disponible || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-yellow-600 font-medium">
                  Asignados
                </p>
                <p className="text-lg md:text-2xl font-bold text-yellow-900">
                  {estadisticasCalculadas.porEstado.asignado || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-blue-600 font-medium">
                  Utilizados
                </p>
                <p className="text-lg md:text-2xl font-bold text-blue-900">
                  {estadisticasCalculadas.porEstado.utilizado || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 min-w-0">
          <h3 className="text-base md:text-lg font-semibold truncate">
            Resultados ({brazaletes.length})
          </h3>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {estadisticasCalculadas.porTipo &&
              Object.entries(estadisticasCalculadas.porTipo).map(
                ([tipo, cantidad]) => (
                  <Badge
                    key={tipo}
                    variant="outline"
                    className="text-xs md:text-sm"
                  >
                    {getTipoIcon()} {tipo}: {cantidad}
                  </Badge>
                )
              )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Select
            value={formatoExportacion}
            onValueChange={(value: "csv" | "excel") =>
              setFormatoExportacion(value)
            }
          >
            <SelectTrigger className="w-full sm:w-32 text-xs md:text-sm h-9 md:h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => onExportar?.(formatoExportacion)}
            disabled={brazaletes.length === 0}
            className="text-xs md:text-sm h-9 md:h-10"
          >
            <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Exportar</span>
            <span className="sm:hidden">Exportar</span>
          </Button>
          <Button
            variant="outline"
            onClick={onActualizar}
            className="text-xs md:text-sm h-9 md:h-10"
          >
            <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Actualizar</span>
            <span className="sm:hidden">Actualizar</span>
          </Button>
        </div>
      </div>

      {/* Tabla de resultados */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {brazaletes.length > 0 ? (
            <div className="inline-block min-w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs md:text-sm">Código</TableHead>
                    <TableHead className="text-xs md:text-sm">Tipo</TableHead>
                    <TableHead className="text-xs md:text-sm">Estado</TableHead>
                    <TableHead className="text-xs md:text-sm hidden sm:table-cell">
                      Prestador
                    </TableHead>
                    <TableHead className="text-xs md:text-sm hidden md:table-cell">
                      Lote
                    </TableHead>
                    <TableHead className="text-xs md:text-sm hidden lg:table-cell">
                      Fecha Uso
                    </TableHead>
                    <TableHead className="text-xs md:text-sm hidden sm:table-cell">
                      Turista
                    </TableHead>
                    <TableHead className="text-xs md:text-sm">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brazaletes.map((brazalete) => (
                    <TableRow key={brazalete.id}>
                      <TableCell className="font-mono text-xs md:text-sm">
                        {brazalete.codigo}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {getTipoIcon()} {brazalete.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getEstadoColor(
                            brazalete.estado
                          )} text-xs`}
                        >
                          <span className="flex items-center gap-1">
                            {getEstadoIcon(brazalete.estado)}
                            <span className="hidden sm:inline">
                              {brazalete.estado}
                            </span>
                            <span className="sm:hidden">
                              {brazalete.estado.slice(0, 3)}
                            </span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm hidden sm:table-cell">
                        {brazalete.prestador ? (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            <span className="truncate">
                              {brazalete.prestador.nombre}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm hidden md:table-cell">
                        {brazalete.lote ? (
                          <span>{brazalete.lote.numero_lote}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm hidden lg:table-cell">
                        {brazalete.fecha_uso ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-500 flex-shrink-0" />
                            <span className="truncate text-xs">
                              {new Date(brazalete.fecha_uso).toLocaleDateString(
                                "es-MX"
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm hidden sm:table-cell">
                        {brazalete.turista_nacionalidad ? (
                          <div className="space-y-0.5">
                            <Badge variant="outline" className="text-xs">
                              {brazalete.turista_nacionalidad.slice(0, 3)}
                            </Badge>
                            {brazalete.turista_edad && (
                              <div className="text-xs text-gray-600">
                                {brazalete.turista_edad}a
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setBrazaleteSeleccionado(brazalete);
                            onVerDetalle?.(brazalete);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-6 md:p-12 text-center">
              <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                No se encontraron brazaletes
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                Ajusta los filtros de búsqueda para obtener más resultados
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {pagination && pagination.total_pages > 1 && (
        <Card>
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="text-xs md:text-sm text-gray-600 text-center md:text-left">
                Mostrando {brazaletes.length} de {pagination.total} resultados
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPaginar?.(pagination.page - 1)}
                  disabled={!pagination.has_prev}
                  className="text-xs h-8 md:h-10"
                >
                  <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline ml-1">Anterior</span>
                </Button>
                <div className="flex items-center gap-0.5">
                  {Array.from(
                    { length: pagination.total_pages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.total_pages ||
                        Math.abs(page - pagination.page) <= 1
                    )
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center gap-0.5">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="text-gray-400 text-xs px-1">
                            ...
                          </span>
                        )}
                        <Button
                          variant={
                            page === pagination.page ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => onPaginar?.(page)}
                          className="w-7 h-7 md:w-8 md:h-8 p-0 text-xs"
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPaginar?.(pagination.page + 1)}
                  disabled={!pagination.has_next}
                  className="text-xs h-8 md:h-10"
                >
                  <span className="hidden sm:inline mr-1">Siguiente</span>
                  <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalle */}
      <Dialog
        open={!!brazaleteSeleccionado}
        onOpenChange={() => setBrazaleteSeleccionado(null)}
      >
        <DialogContent className="max-w-sm md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 md:p-6 gap-4 md:gap-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg md:text-xl">
              Detalle del Brazalete
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Información completa del brazalete seleccionado
            </DialogDescription>
          </DialogHeader>
          {brazaleteSeleccionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label className="text-xs md:text-sm font-medium">
                    Código
                  </Label>
                  <p className="font-mono text-base md:text-lg mt-1">
                    {brazaleteSeleccionado.codigo}
                  </p>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-medium">Tipo</Label>
                  <Badge variant="outline" className="mt-1 text-xs md:text-sm">
                    {getTipoIcon()} {brazaleteSeleccionado.tipo}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-medium">
                    Estado
                  </Label>
                  <Badge
                    className={`${getEstadoColor(
                      brazaleteSeleccionado.estado
                    )} text-xs md:text-sm mt-1`}
                  >
                    <span className="flex items-center gap-1">
                      {getEstadoIcon(brazaleteSeleccionado.estado)}
                      {brazaleteSeleccionado.estado}
                    </span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs md:text-sm font-medium">
                    Precio
                  </Label>
                  <p className="text-base md:text-lg font-semibold mt-1">
                    ${brazaleteSeleccionado.precio}
                  </p>
                </div>
              </div>

              {brazaleteSeleccionado.prestador && (
                <div>
                  <Label className="text-xs md:text-sm font-medium">
                    Prestador
                  </Label>
                  <div className="mt-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">
                      {brazaleteSeleccionado.prestador.nombre}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {brazaleteSeleccionado.prestador.email}
                    </p>
                  </div>
                </div>
              )}

              {brazaleteSeleccionado.lote && (
                <div>
                  <Label className="text-xs md:text-sm font-medium">Lote</Label>
                  <div className="mt-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">
                      {brazaleteSeleccionado.lote.numero_lote}
                    </p>
                    <p className="text-xs text-gray-600">
                      Tipo: {brazaleteSeleccionado.lote.tipo}
                    </p>
                  </div>
                </div>
              )}

              {brazaleteSeleccionado.salida && (
                <div>
                  <Label className="text-xs md:text-sm font-medium">
                    Salida
                  </Label>
                  <div className="mt-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-sm">
                      Salida #{brazaleteSeleccionado.salida.id}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatearFecha(brazaleteSeleccionado.salida.fecha)} -{" "}
                      {brazaleteSeleccionado.salida.numero_pasajeros} pasajeros
                    </p>
                  </div>
                </div>
              )}

              {(brazaleteSeleccionado.turista_nacionalidad ||
                brazaleteSeleccionado.turista_edad) && (
                <div>
                  <Label className="text-xs md:text-sm font-medium">
                    Información del Turista
                  </Label>
                  <div className="mt-2 p-2 md:p-3 bg-gray-50 rounded-lg">
                    {brazaleteSeleccionado.turista_nacionalidad && (
                      <p className="font-medium text-sm capitalize">
                        {brazaleteSeleccionado.turista_nacionalidad}
                      </p>
                    )}
                    {brazaleteSeleccionado.turista_edad && (
                      <p className="text-xs text-gray-600">
                        {brazaleteSeleccionado.turista_edad} años
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label className="text-xs md:text-sm font-medium">
                    Fecha Creación
                  </Label>
                  <p className="text-xs md:text-sm mt-1">
                    {formatearFecha(brazaleteSeleccionado.fecha_creacion)}
                  </p>
                </div>
                {brazaleteSeleccionado.fecha_asignacion && (
                  <div>
                    <Label className="text-xs md:text-sm font-medium">
                      Fecha Asignación
                    </Label>
                    <p className="text-xs md:text-sm mt-1">
                      {formatearFecha(brazaleteSeleccionado.fecha_asignacion)}
                    </p>
                  </div>
                )}
                {brazaleteSeleccionado.fecha_uso && (
                  <div>
                    <Label className="text-xs md:text-sm font-medium">
                      Fecha Uso
                    </Label>
                    <p className="text-xs md:text-sm mt-1">
                      {formatearFecha(brazaleteSeleccionado.fecha_uso)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
