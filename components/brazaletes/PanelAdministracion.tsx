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
    <div className="space-y-6">
      {/* Error general */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Estadísticas del sistema */}
      {estadisticas && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Estadísticas del Sistema
            </CardTitle>
            <CardDescription>
              Información general del sistema de brazaletes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {estadisticas.totalBrazaletes.toLocaleString()}
                </div>
                <div className="text-sm text-blue-700">Total Brazaletes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {estadisticas.totalLotes}
                </div>
                <div className="text-sm text-green-700">Total Lotes</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {estadisticas.totalVentas}
                </div>
                <div className="text-sm text-purple-700">Total Ventas</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {estadisticas.totalUsos}
                </div>
                <div className="text-sm text-orange-700">Total Usos</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              Última actualización:{" "}
              {new Date(estadisticas.ultimaActualizacion).toLocaleString(
                "es-MX"
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="operaciones" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="operaciones">Operaciones Masivas</TabsTrigger>
          <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
          <TabsTrigger value="exportacion">Exportación</TabsTrigger>
          <TabsTrigger value="importacion">Importación</TabsTrigger>
        </TabsList>

        {/* Operaciones Masivas */}
        <TabsContent value="operaciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Operaciones en Lote</CardTitle>
              <CardDescription>
                Realiza operaciones masivas sobre múltiples brazaletes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {operacionesMasivas.map((operacion) => (
                  <Card
                    key={operacion.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${operacion.color}`}>
                          {operacion.icono}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{operacion.nombre}</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {operacion.descripcion}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handleOperacionMasiva(operacion)}
                            disabled={cargando}
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
        <TabsContent value="mantenimiento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Herramientas de Mantenimiento</CardTitle>
              <CardDescription>
                Herramientas para mantener y optimizar el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {herramientasMantenimiento.map((herramienta) => (
                  <Card
                    key={herramienta.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${herramienta.color}`}>
                          {herramienta.icono}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {herramienta.nombre}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {herramienta.descripcion}
                          </p>
                          <Button
                            size="sm"
                            onClick={() => handleHerramienta(herramienta)}
                            disabled={cargando}
                          >
                            {cargando ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Ejecutando...
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
        <TabsContent value="exportacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exportación de Datos</CardTitle>
              <CardDescription>
                Exporta datos del sistema en diferentes formatos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleExportarDatos("brazaletes")}
                  disabled={cargando}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Download className="w-6 h-6" />
                  <span>Exportar Brazaletes</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportarDatos("lotes")}
                  disabled={cargando}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Download className="w-6 h-6" />
                  <span>Exportar Lotes</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportarDatos("ventas")}
                  disabled={cargando}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Download className="w-6 h-6" />
                  <span>Exportar Ventas</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExportarDatos("reporte-completo")}
                  disabled={cargando}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <Download className="w-6 h-6" />
                  <span>Reporte Completo</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Importación de Datos */}
        <TabsContent value="importacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Importación de Datos</CardTitle>
              <CardDescription>
                Importa datos desde archivos externos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Importar Archivo
                  </h3>
                  <p className="text-gray-600 mb-4">
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
                  <Button asChild disabled={cargando}>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {cargando ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Importando...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Seleccionar Archivo
                        </>
                      )}
                    </label>
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Formatos Soportados
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Operación Masiva</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres ejecutar esta operación? Esta acción
              puede afectar múltiples registros.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setMostrarDialogOperacion(false)}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmarOperacion}
              disabled={cargando}
              className="bg-red-600 hover:bg-red-700"
            >
              {cargando ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Ejecutando...
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
