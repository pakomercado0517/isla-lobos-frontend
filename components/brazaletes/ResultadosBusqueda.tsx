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
  filtrosAplicados,
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
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900">
                  {estadisticasCalculadas.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">
                  Disponibles
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {estadisticasCalculadas.porEstado.disponible || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-yellow-600 font-medium">Asignados</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {estadisticasCalculadas.porEstado.asignado || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Utilizados</p>
                <p className="text-2xl font-bold text-blue-900">
                  {estadisticasCalculadas.porEstado.utilizado || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            Resultados ({brazaletes.length} brazaletes)
          </h3>
          {estadisticasCalculadas.porTipo &&
            Object.entries(estadisticasCalculadas.porTipo).map(
              ([tipo, cantidad]) => (
                <Badge key={tipo} variant="outline">
                  {getTipoIcon()} {tipo}: {cantidad}
                </Badge>
              )
            )}
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={formatoExportacion}
            onValueChange={(value: "csv" | "excel") =>
              setFormatoExportacion(value)
            }
          >
            <SelectTrigger className="w-32">
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
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" onClick={onActualizar}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Tabla de resultados */}
      <Card>
        <CardContent className="p-0">
          {brazaletes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Prestador</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Fecha Uso</TableHead>
                  <TableHead>Turista</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brazaletes.map((brazalete) => (
                  <TableRow key={brazalete.id}>
                    <TableCell className="font-mono text-sm">
                      {brazalete.codigo}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTipoIcon()} {brazalete.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstadoColor(brazalete.estado)}>
                        <span className="flex items-center gap-1">
                          {getEstadoIcon(brazalete.estado)}
                          {brazalete.estado}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {brazalete.prestador ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {brazalete.prestador.nombre}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {brazalete.lote ? (
                        <span className="text-sm">
                          {brazalete.lote.numero_lote}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {brazalete.fecha_uso ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            {formatearFecha(brazalete.fecha_uso)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {brazalete.turista_nacionalidad ? (
                        <div className="space-y-1">
                          <Badge variant="outline" className="text-xs">
                            {brazalete.turista_nacionalidad}
                          </Badge>
                          {brazalete.turista_edad && (
                            <div className="text-xs text-gray-600">
                              {brazalete.turista_edad} años
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
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
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron brazaletes
              </h3>
              <p className="text-gray-600">
                Ajusta los filtros de búsqueda para obtener más resultados
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {pagination && pagination.total_pages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {brazaletes.length} de {pagination.total} resultados
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPaginar?.(pagination.page - 1)}
                  disabled={!pagination.has_prev}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
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
                      <div key={page} className="flex items-center gap-1">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="text-gray-400">...</span>
                        )}
                        <Button
                          variant={
                            page === pagination.page ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => onPaginar?.(page)}
                          className="w-8 h-8 p-0"
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
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Brazalete</DialogTitle>
            <DialogDescription>
              Información completa del brazalete seleccionado
            </DialogDescription>
          </DialogHeader>
          {brazaleteSeleccionado && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Código</Label>
                  <p className="font-mono text-lg">
                    {brazaleteSeleccionado.codigo}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <Badge variant="outline" className="mt-1">
                    {getTipoIcon()} {brazaleteSeleccionado.tipo}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <Badge
                    className={getEstadoColor(brazaleteSeleccionado.estado)}
                  >
                    <span className="flex items-center gap-1">
                      {getEstadoIcon(brazaleteSeleccionado.estado)}
                      {brazaleteSeleccionado.estado}
                    </span>
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Precio</Label>
                  <p className="text-lg font-semibold">
                    ${brazaleteSeleccionado.precio}
                  </p>
                </div>
              </div>

              {brazaleteSeleccionado.prestador && (
                <div>
                  <Label className="text-sm font-medium">Prestador</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      {brazaleteSeleccionado.prestador.nombre}
                    </p>
                    <p className="text-sm text-gray-600">
                      {brazaleteSeleccionado.prestador.email}
                    </p>
                  </div>
                </div>
              )}

              {brazaleteSeleccionado.lote && (
                <div>
                  <Label className="text-sm font-medium">Lote</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      {brazaleteSeleccionado.lote.numero_lote}
                    </p>
                    <p className="text-sm text-gray-600">
                      Tipo: {brazaleteSeleccionado.lote.tipo}
                    </p>
                  </div>
                </div>
              )}

              {brazaleteSeleccionado.salida && (
                <div>
                  <Label className="text-sm font-medium">Salida</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      Salida #{brazaleteSeleccionado.salida.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatearFecha(brazaleteSeleccionado.salida.fecha)} -{" "}
                      {brazaleteSeleccionado.salida.numero_pasajeros} pasajeros
                    </p>
                  </div>
                </div>
              )}

              {(brazaleteSeleccionado.turista_nacionalidad ||
                brazaleteSeleccionado.turista_edad) && (
                <div>
                  <Label className="text-sm font-medium">
                    Información del Turista
                  </Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    {brazaleteSeleccionado.turista_nacionalidad && (
                      <p className="font-medium capitalize">
                        {brazaleteSeleccionado.turista_nacionalidad}
                      </p>
                    )}
                    {brazaleteSeleccionado.turista_edad && (
                      <p className="text-sm text-gray-600">
                        {brazaleteSeleccionado.turista_edad} años
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Fecha Creación</Label>
                  <p className="text-sm">
                    {formatearFecha(brazaleteSeleccionado.fecha_creacion)}
                  </p>
                </div>
                {brazaleteSeleccionado.fecha_asignacion && (
                  <div>
                    <Label className="text-sm font-medium">
                      Fecha Asignación
                    </Label>
                    <p className="text-sm">
                      {formatearFecha(brazaleteSeleccionado.fecha_asignacion)}
                    </p>
                  </div>
                )}
                {brazaleteSeleccionado.fecha_uso && (
                  <div>
                    <Label className="text-sm font-medium">Fecha Uso</Label>
                    <p className="text-sm">
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
