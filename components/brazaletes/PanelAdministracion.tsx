"use client";

import { useState } from "react";
import { clientLogger } from "@/lib/logger-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Database,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  BarChart3,
  Shield,
  Activity,
} from "lucide-react";

interface PanelAdministracionProps {
  onOperacionMasiva?: (operacion: string, datos: unknown) => Promise<void>;
  onExportarDatos?: (tipo: string) => Promise<void>;
  onImportarDatos?: (archivo: File) => Promise<void>;
  onLimpiarCache?: () => Promise<void>;
  onOptimizarBD?: () => Promise<void>;
  estadisticas?: {
    totalBrazaletes: number;
    totalLotes: number;
    totalVentas: number;
    totalUsos: number;
    ultimaActualizacion: string;
  };
}

export function PanelAdministracion({
  onOperacionMasiva,
  onExportarDatos,
  onImportarDatos,
  onLimpiarCache,
  onOptimizarBD,
  estadisticas,
}: PanelAdministracionProps) {
  const [operacionSeleccionada, setOperacionSeleccionada] = useState("");
  const [mostrarDialogOperacion, setMostrarDialogOperacion] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const operacionesMasivas = [
    {
      id: "actualizar-estados",
      nombre: "Actualizar Estados",
      descripcion: "Cambiar el estado de múltiples brazaletes",
      icono: <RefreshCw className="w-5 h-5" />,
      color: "text-blue-600",
    },
    {
      id: "asignar-prestador",
      nombre: "Asignar a Prestador",
      descripcion: "Asignar múltiples brazaletes a un prestador",
      icono: <Shield className="w-5 h-5" />,
      color: "text-green-600",
    },
    {
      id: "cancelar-lotes",
      nombre: "Cancelar Lotes",
      descripcion: "Cancelar múltiples lotes de brazaletes",
      icono: <Trash2 className="w-5 h-5" />,
      color: "text-red-600",
    },
    {
      id: "marcar-perdidos",
      nombre: "Marcar como Perdidos",
      descripcion: "Marcar múltiples brazaletes como perdidos",
      icono: <AlertTriangle className="w-5 h-5" />,
      color: "text-orange-600",
    },
  ];

  const herramientasMantenimiento = [
    {
      id: "limpiar-cache",
      nombre: "Limpiar Cache",
      descripcion: "Limpiar cache del sistema para mejorar rendimiento",
      accion: onLimpiarCache,
      icono: <Database className="w-5 h-5" />,
      color: "text-blue-600",
    },
    {
      id: "optimizar-bd",
      nombre: "Optimizar Base de Datos",
      descripcion: "Ejecutar optimizaciones en la base de datos",
      accion: onOptimizarBD,
      icono: <BarChart3 className="w-5 h-5" />,
      color: "text-green-600",
    },
    {
      id: "verificar-integridad",
      nombre: "Verificar Integridad",
      descripcion: "Verificar la integridad de los datos",
      accion: () => {},
      icono: <CheckCircle className="w-5 h-5" />,
      color: "text-purple-600",
    },
    {
      id: "generar-backup",
      nombre: "Generar Backup",
      descripcion: "Crear backup completo del sistema",
      accion: () => {},
      icono: <Download className="w-5 h-5" />,
      color: "text-orange-600",
    },
  ];

  const handleOperacionMasiva = async (operacion: { id: string }) => {
    setOperacionSeleccionada(operacion.id);
    setMostrarDialogOperacion(true);
  };

  const handleConfirmarOperacion = async () => {
    if (!operacionSeleccionada || !onOperacionMasiva) return;

    try {
      setCargando(true);
      setError("");
      await onOperacionMasiva(operacionSeleccionada, {});
      setMostrarDialogOperacion(false);
      setOperacionSeleccionada("");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error(
        "Error al ejecutar operación de administración",
        error,
        { operacion: operacionSeleccionada }
      );
      setError(errorMsg);
    } finally {
      setCargando(false);
    }
  };

  const handleHerramienta = async (herramienta: {
    id: string;
    accion?: () => Promise<void> | void;
  }) => {
    if (!herramienta.accion) return;

    try {
      setCargando(true);
      setError("");
      await herramienta.accion();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error(
        "Error al ejecutar herramienta de administración",
        error,
        { herramientaId: herramienta.id }
      );
      setError(errorMsg);
    } finally {
      setCargando(false);
    }
  };

  const handleExportarDatos = async (tipo: string) => {
    if (!onExportarDatos) return;

    try {
      setCargando(true);
      setError("");
      await onExportarDatos(tipo);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al exportar datos", error, { tipo });
      setError(errorMsg);
    } finally {
      setCargando(false);
    }
  };

  const handleImportarDatos = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !onImportarDatos) return;

    try {
      setCargando(true);
      setError("");
      await onImportarDatos(file);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al importar datos", error, {
        fileName: file.name,
      });
      setError(errorMsg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Error general */}
      {error && (
        <Alert variant="destructive" className="mx-2 sm:mx-0">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <AlertDescription className="text-xs sm:text-sm break-words">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Estadísticas del sistema */}
      {estadisticas && (
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate">Estadísticas del Sistema</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Información general del sistema de brazaletes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
                  {estadisticas.totalBrazaletes.toLocaleString()}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-blue-700 mt-1">
                  Total Brazaletes
                </div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                  {estadisticas.totalLotes}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-green-700 mt-1">
                  Total Lotes
                </div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600">
                  {estadisticas.totalVentas}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-purple-700 mt-1">
                  Total Ventas
                </div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-orange-600">
                  {estadisticas.totalUsos}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-orange-700 mt-1">
                  Total Usos
                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-600 break-words px-2">
              Última actualización:{" "}
              {new Date(estadisticas.ultimaActualizacion).toLocaleString(
                "es-MX"
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="operaciones" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="operaciones" className="text-[10px] sm:text-xs md:text-sm px-2 py-2">
            <span className="hidden sm:inline">Operaciones Masivas</span>
            <span className="sm:hidden">Operaciones</span>
          </TabsTrigger>
          <TabsTrigger value="mantenimiento" className="text-[10px] sm:text-xs md:text-sm px-2 py-2">
            Mantenimiento
          </TabsTrigger>
          <TabsTrigger value="exportacion" className="text-[10px] sm:text-xs md:text-sm px-2 py-2">
            Exportación
          </TabsTrigger>
          <TabsTrigger value="importacion" className="text-[10px] sm:text-xs md:text-sm px-2 py-2">
            Importación
          </TabsTrigger>
        </TabsList>

        {/* Operaciones Masivas */}
        <TabsContent value="operaciones" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Operaciones en Lote</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Realiza operaciones masivas sobre múltiples brazaletes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {operacionesMasivas.map((operacion) => (
                  <Card
                    key={operacion.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${operacion.color} flex-shrink-0`}>
                          {operacion.icono}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {operacion.nombre}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 break-words">
                            {operacion.descripcion}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handleOperacionMasiva(operacion)}
                            disabled={cargando}
                            className="w-full sm:w-auto h-8 sm:h-9 text-xs sm:text-sm"
                          >
                            Ejecutar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Herramientas de Mantenimiento */}
        <TabsContent value="mantenimiento" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Herramientas de Mantenimiento</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Herramientas para mantener y optimizar el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {herramientasMantenimiento.map((herramienta) => (
                  <Card
                    key={herramienta.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg ${herramienta.color} flex-shrink-0`}>
                          {herramienta.icono}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {herramienta.nombre}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 break-words">
                            {herramienta.descripcion}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handleHerramienta(herramienta)}
                            disabled={cargando}
                            className="w-full sm:w-auto h-8 sm:h-9 text-xs sm:text-sm"
                          >
                            {cargando ? (
                              <>
                                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin flex-shrink-0" />
                                <span className="truncate">Ejecutando...</span>
                              </>
                            ) : (
                              "Ejecutar"
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exportación de Datos */}
        <TabsContent value="exportacion" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Exportación de Datos</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Exporta datos del sistema en diferentes formatos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleExportarDatos("brazaletes")}
                  disabled={cargando}
                  className="h-16 sm:h-20 flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                >
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Exportar Brazaletes</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportarDatos("lotes")}
                  disabled={cargando}
                  className="h-16 sm:h-20 flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                >
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Exportar Lotes</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportarDatos("ventas")}
                  disabled={cargando}
                  className="h-16 sm:h-20 flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                >
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Exportar Ventas</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportarDatos("reporte-completo")}
                  disabled={cargando}
                  className="h-16 sm:h-20 flex flex-col items-center justify-center gap-1.5 sm:gap-2"
                >
                  <Download className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Reporte Completo</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Importación de Datos */}
        <TabsContent value="importacion" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Importación de Datos</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Importa datos desde archivos externos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    Importar Archivo
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 px-2">
                    Selecciona un archivo CSV o Excel para importar datos
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleImportarDatos}
                    disabled={cargando}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button asChild disabled={cargando} className="h-9 sm:h-10 text-xs sm:text-sm">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {cargando ? (
                        <>
                          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin flex-shrink-0" />
                          <span>Importando...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                          <span>Seleccionar Archivo</span>
                        </>
                      )}
                    </label>
                  </Button>
                </div>

                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-xs sm:text-sm text-blue-900 mb-2">
                    Formatos Soportados
                  </h4>
                  <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                    <li>• CSV (.csv)</li>
                    <li>• Excel (.xlsx, .xls)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de confirmación para operaciones masivas */}
      <Dialog
        open={mostrarDialogOperacion}
        onOpenChange={setMostrarDialogOperacion}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-md mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Confirmar Operación Masiva</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm break-words">
              ¿Estás seguro de que quieres ejecutar esta operación? Esta acción
              puede afectar múltiples registros.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setMostrarDialogOperacion(false)}
              disabled={cargando}
              className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarOperacion}
              disabled={cargando}
              className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm bg-red-600 hover:bg-red-700"
            >
              {cargando ? (
                <>
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin flex-shrink-0" />
                  <span>Ejecutando...</span>
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
