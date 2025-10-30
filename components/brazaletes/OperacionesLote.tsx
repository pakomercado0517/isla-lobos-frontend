"use client";

import { useState } from "react";
import { clientLogger } from "@/lib/logger-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RefreshCw,
  Shield,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const operacionSchema = z.object({
  tipo: z.enum([
    "actualizar-estados",
    "asignar-prestador",
    "cancelar-lotes",
    "marcar-perdidos",
  ]),
  criterios: z.object({
    codigos: z.string().optional(),
    lote_id: z.string().optional(),
    prestador_id: z.string().optional(),
    estado_actual: z.string().optional(),
    fecha_desde: z.string().optional(),
    fecha_hasta: z.string().optional(),
  }),
  parametros: z.object({
    nuevo_estado: z.string().optional(),
    prestador_id: z.string().optional(),
    motivo: z.string().optional(),
  }),
});

type OperacionFormData = z.infer<typeof operacionSchema>;

interface OperacionLoteProps {
  onEjecutarOperacion?: (
    operacion: OperacionFormData
  ) => Promise<{ success: boolean; message: string; afectados: number }>;
  prestadores?: Array<{ id: string; nombre: string }>;
  lotes?: Array<{ id: string; numero_lote: string }>;
}

export function OperacionesLote({
  onEjecutarOperacion,
  prestadores = [],
  lotes = [],
}: OperacionLoteProps) {
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState<{
    success: boolean;
    message: string;
    afectados: number;
  } | null>(null);
  const [error, setError] = useState("");

  const form = useForm<OperacionFormData>({
    resolver: zodResolver(operacionSchema),
    defaultValues: {
      tipo: "actualizar-estados",
      criterios: {
        codigos: "",
        lote_id: "",
        prestador_id: "",
        estado_actual: "",
        fecha_desde: "",
        fecha_hasta: "",
      },
      parametros: {
        nuevo_estado: "",
        prestador_id: "",
        motivo: "",
      },
    },
  });

  const watchedTipo = form.watch("tipo");

  const handleSubmit = async (data: OperacionFormData) => {
    if (!onEjecutarOperacion) return;

    try {
      setCargando(true);
      setError("");
      setResultado(null);

      const resultado = await onEjecutarOperacion(data);
      setResultado(resultado);

      if (resultado.success) {
        form.reset();
        setMostrarDialog(false);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al ejecutar operación en lote", error, {
        tipo: data.tipo,
      });
      setError(errorMsg);
    } finally {
      setCargando(false);
    }
  };

  const getOperacionConfig = (tipo: string) => {
    switch (tipo) {
      case "actualizar-estados":
        return {
          titulo: "Actualizar Estados",
          descripcion: "Cambiar el estado de múltiples brazaletes",
          icono: <RefreshCw className="w-5 h-5" />,
          color: "text-blue-600",
          parametros: (
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="nuevo_estado" className="text-xs sm:text-sm font-medium">
                  Nuevo Estado *
                </Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("parametros.nuevo_estado", value)
                  }
                >
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Seleccionar nuevo estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible" className="text-xs sm:text-sm">
                      Disponible
                    </SelectItem>
                    <SelectItem value="asignado" className="text-xs sm:text-sm">
                      Asignado
                    </SelectItem>
                    <SelectItem value="utilizado" className="text-xs sm:text-sm">
                      Utilizado
                    </SelectItem>
                    <SelectItem value="perdido" className="text-xs sm:text-sm">
                      Perdido
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="motivo" className="text-xs sm:text-sm font-medium">
                  Motivo del Cambio
                </Label>
                <Textarea
                  id="motivo"
                  placeholder="Describe el motivo del cambio de estado..."
                  className="min-h-[80px] text-xs sm:text-sm"
                  {...form.register("parametros.motivo")}
                />
              </div>
            </div>
          ),
        };
      case "asignar-prestador":
        return {
          titulo: "Asignar a Prestador",
          descripcion: "Asignar múltiples brazaletes a un prestador",
          icono: <Shield className="w-5 h-5" />,
          color: "text-green-600",
          parametros: (
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="prestador_id" className="text-xs sm:text-sm font-medium">
                  Prestador Destino *
                </Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("parametros.prestador_id", value)
                  }
                >
                  <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                    <SelectValue placeholder="Seleccionar prestador" />
                  </SelectTrigger>
                  <SelectContent>
                    {prestadores.map((prestador) => (
                      <SelectItem key={prestador.id} value={prestador.id} className="text-xs sm:text-sm">
                        {prestador.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="motivo" className="text-xs sm:text-sm font-medium">
                  Motivo de la Asignación
                </Label>
                <Textarea
                  id="motivo"
                  placeholder="Describe el motivo de la asignación..."
                  className="min-h-[80px] text-xs sm:text-sm"
                  {...form.register("parametros.motivo")}
                />
              </div>
            </div>
          ),
        };
      case "cancelar-lotes":
        return {
          titulo: "Cancelar Lotes",
          descripcion: "Cancelar múltiples lotes de brazaletes",
          icono: <Trash2 className="w-5 h-5" />,
          color: "text-red-600",
          parametros: (
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="motivo" className="text-xs sm:text-sm font-medium">
                  Motivo de Cancelación *
                </Label>
                <Textarea
                  id="motivo"
                  placeholder="Describe el motivo de la cancelación..."
                  className="min-h-[80px] text-xs sm:text-sm"
                  {...form.register("parametros.motivo")}
                  required
                />
              </div>
            </div>
          ),
        };
      case "marcar-perdidos":
        return {
          titulo: "Marcar como Perdidos",
          descripcion: "Marcar múltiples brazaletes como perdidos",
          icono: <AlertTriangle className="w-5 h-5" />,
          color: "text-orange-600",
          parametros: (
            <div className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="motivo" className="text-xs sm:text-sm font-medium">
                  Motivo de Pérdida *
                </Label>
                <Textarea
                  id="motivo"
                  placeholder="Describe el motivo de la pérdida..."
                  className="min-h-[80px] text-xs sm:text-sm"
                  {...form.register("parametros.motivo")}
                  required
                />
              </div>
            </div>
          ),
        };
      default:
        return {
          titulo: "Operación",
          descripcion: "Descripción de la operación",
          icono: <RefreshCw className="w-5 h-5" />,
          color: "text-gray-600",
          parametros: <div></div>,
        };
    }
  };

  const operacionConfig = getOperacionConfig(watchedTipo);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Error */}
      {error && (
        <Alert variant="destructive" className="mx-2 sm:mx-0">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <AlertDescription className="text-xs sm:text-sm break-words">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Resultado de la operación */}
      {resultado && (
        <Alert variant={resultado.success ? "default" : "destructive"} className="mx-2 sm:mx-0">
          {resultado.success ? (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          )}
          <AlertDescription className="text-xs sm:text-sm">
            <strong>
              {resultado.success
                ? "Operación exitosa"
                : "Error en la operación"}
              :
            </strong>{" "}
            <span className="break-words">{resultado.message}</span>
            {resultado.afectados > 0 && (
              <span className="block mt-1">
                <Badge variant="secondary" className="text-xs">
                  {resultado.afectados} registros afectados
                </Badge>
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
            {operacionConfig.icono}
            <span className="truncate">{operacionConfig.titulo}</span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {operacionConfig.descripcion}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {/* Tipo de operación */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm font-medium">Tipo de Operación</Label>
              <Select
                onValueChange={(value) =>
                  form.setValue(
                    "tipo",
                    value as
                      | "actualizar-estados"
                      | "asignar-prestador"
                      | "cancelar-lotes"
                      | "marcar-perdidos"
                  )
                }
              >
                <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Seleccionar tipo de operación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actualizar-estados" className="text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Actualizar Estados</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="asignar-prestador" className="text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Asignar a Prestador</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelar-lotes" className="text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Cancelar Lotes</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="marcar-perdidos" className="text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Marcar como Perdidos</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Criterios de selección */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Criterios de Selección</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="codigos" className="text-xs sm:text-sm font-medium">
                    Códigos de Brazaletes
                  </Label>
                  <Textarea
                    id="codigos"
                    placeholder="Ingresa los códigos separados por comas o líneas"
                    className="min-h-[80px] text-xs sm:text-sm"
                    {...form.register("criterios.codigos")}
                  />
                  <p className="text-[10px] sm:text-xs text-gray-600">
                    Ej: BRZ-2024-000001, BRZ-2024-000002
                  </p>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="lote_id" className="text-xs sm:text-sm font-medium">
                    Lote
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("criterios.lote_id", value)
                    }
                  >
                    <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Seleccionar lote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos" className="text-xs sm:text-sm">
                        Todos los lotes
                      </SelectItem>
                      {lotes.map((lote) => (
                        <SelectItem key={lote.id} value={lote.id} className="text-xs sm:text-sm">
                          {lote.numero_lote}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="prestador_id" className="text-xs sm:text-sm font-medium">
                    Prestador
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("criterios.prestador_id", value)
                    }
                  >
                    <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Seleccionar prestador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos" className="text-xs sm:text-sm">
                        Todos los prestadores
                      </SelectItem>
                      {prestadores.map((prestador) => (
                        <SelectItem key={prestador.id} value={prestador.id} className="text-xs sm:text-sm">
                          {prestador.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="estado_actual" className="text-xs sm:text-sm font-medium">
                    Estado Actual
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue("criterios.estado_actual", value)
                    }
                  >
                    <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos" className="text-xs sm:text-sm">
                        Todos los estados
                      </SelectItem>
                      <SelectItem value="disponible" className="text-xs sm:text-sm">
                        Disponible
                      </SelectItem>
                      <SelectItem value="asignado" className="text-xs sm:text-sm">
                        Asignado
                      </SelectItem>
                      <SelectItem value="utilizado" className="text-xs sm:text-sm">
                        Utilizado
                      </SelectItem>
                      <SelectItem value="perdido" className="text-xs sm:text-sm">
                        Perdido
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="fecha_desde" className="text-xs sm:text-sm font-medium">
                    Fecha Desde
                  </Label>
                  <Input
                    id="fecha_desde"
                    type="date"
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                    {...form.register("criterios.fecha_desde")}
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="fecha_hasta" className="text-xs sm:text-sm font-medium">
                    Fecha Hasta
                  </Label>
                  <Input
                    id="fecha_hasta"
                    type="date"
                    className="h-9 sm:h-10 text-xs sm:text-sm"
                    {...form.register("criterios.fecha_hasta")}
                  />
                </div>
              </div>
            </div>

            {/* Parámetros específicos */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">
                Parámetros de la Operación
              </h3>
              {operacionConfig.parametros}
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={cargando}
                className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
              >
                Limpiar
              </Button>
              <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    disabled={cargando}
                    className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
                  >
                    Ejecutar Operación
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-md mx-2 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">
                      Confirmar Operación en Lote
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm break-words">
                      ¿Estás seguro de que quieres ejecutar esta operación? Esta
                      acción puede afectar múltiples registros y no se puede
                      deshacer.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0" />
                        <span className="font-medium text-xs sm:text-sm text-yellow-900">
                          Advertencia
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-yellow-800 break-words">
                        Esta operación será aplicada a todos los brazaletes que
                        cumplan con los criterios especificados. Asegúrate de
                        revisar los criterios antes de confirmar.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setMostrarDialog(false)}
                        disabled={cargando}
                        className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={cargando}
                        className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm bg-red-600 hover:bg-red-700"
                      >
                        {cargando ? (
                          <>
                            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 animate-spin flex-shrink-0" />
                            <span>Ejecutando...</span>
                          </>
                        ) : (
                          "Confirmar Operación"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
