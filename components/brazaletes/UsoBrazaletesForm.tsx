"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  Package,
  Users,
  MapPin,
  Calendar,
  AlertTriangle,
  Plus,
  Trash2,
} from "lucide-react";
import { UsoBrazaleteFormData, Brazalete } from "@/lib/types/brazaletes";

const usoBrazaleteSchema = z.object({
  salida_id: z.string().min(1, "Debe seleccionar una salida"),
  brazaletes: z
    .array(
      z.object({
        codigo: z.string().min(1, "El código del brazalete es requerido"),
        turista_nacionalidad: z
          .enum(["local", "nacional", "internacional"])
          .optional(),
        turista_edad: z.number().min(0).max(120).optional(),
      })
    )
    .min(1, "Debe registrar al menos un brazalete"),
});

interface UsoBrazaletesFormProps {
  onSubmit: (data: UsoBrazaleteFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  salidasDisponibles?: Array<{
    id: string;
    fecha: string;
    numero_pasajeros: number;
    embarcacion_nombre?: string;
    destino?: string;
  }>;
  brazaletesDisponibles?: Brazalete[];
}

export function UsoBrazaletesForm({
  onSubmit,
  loading = false,
  error,
  salidasDisponibles = [],
  brazaletesDisponibles = [],
}: UsoBrazaletesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salidaSeleccionada, setSalidaSeleccionada] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UsoBrazaleteFormData>({
    resolver: zodResolver(usoBrazaleteSchema),
    defaultValues: {
      brazaletes: [{ codigo: "", turista_nacionalidad: "nacional" }],
    },
  });

  const watchedValues = watch();
  const brazaletesForm = watchedValues.brazaletes || [];

  // Buscar salida seleccionada
  useEffect(() => {
    const salida = salidasDisponibles.find(
      (s) => s.id === watchedValues.salida_id
    );
    setSalidaSeleccionada(salida || null);
  }, [watchedValues.salida_id, salidasDisponibles]);

  // Verificar si un código de brazalete es válido
  const validarBrazalete = (codigo: string) => {
    return brazaletesDisponibles.find(
      (b) => b.codigo === codigo && b.estado === "disponible"
    );
  };

  const handleFormSubmit = async (data: UsoBrazaleteFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      setSalidaSeleccionada(null);
    } catch (error) {
      console.error("Error al registrar uso de brazaletes:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const agregarBrazalete = () => {
    const nuevosBrazaletes = [
      ...brazaletesForm,
      { codigo: "", turista_nacionalidad: "nacional" },
    ];
    setValue("brazaletes", nuevosBrazaletes);
  };

  const eliminarBrazalete = (index: number) => {
    if (brazaletesForm.length > 1) {
      const nuevosBrazaletes = brazaletesForm.filter((_, i) => i !== index);
      setValue("brazaletes", nuevosBrazaletes);
    }
  };

  const actualizarBrazalete = (index: number, campo: string, valor: any) => {
    const nuevosBrazaletes = [...brazaletesForm];
    nuevosBrazaletes[index] = { ...nuevosBrazaletes[index], [campo]: valor };
    setValue("brazaletes", nuevosBrazaletes);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Registro de Uso de Brazaletes
        </CardTitle>
        <CardDescription>
          Registra los brazaletes utilizados en una salida turística
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Selección de salida */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Selección de Salida
            </h3>

            <div className="space-y-2">
              <Label htmlFor="salida_id">Salida *</Label>
              <Select onValueChange={(value) => setValue("salida_id", value)}>
                <SelectTrigger
                  className={errors.salida_id ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccionar salida" />
                </SelectTrigger>
                <SelectContent>
                  {salidasDisponibles.map((salida) => (
                    <SelectItem key={salida.id} value={salida.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>
                          {new Date(salida.fecha).toLocaleDateString("es-MX")} -{" "}
                          {salida.numero_pasajeros} pasajeros
                        </span>
                        {salida.embarcacion_nombre && (
                          <Badge variant="outline" className="ml-2">
                            {salida.embarcacion_nombre}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.salida_id && (
                <p className="text-sm text-red-500">
                  {errors.salida_id.message}
                </p>
              )}
            </div>

            {/* Información de la salida seleccionada */}
            {salidaSeleccionada && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Salida Seleccionada
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    <strong>Fecha:</strong>{" "}
                    {new Date(salidaSeleccionada.fecha).toLocaleDateString(
                      "es-MX"
                    )}
                  </div>
                  <div>
                    <strong>Pasajeros:</strong>{" "}
                    {salidaSeleccionada.numero_pasajeros}
                  </div>
                  {salidaSeleccionada.embarcacion_nombre && (
                    <div>
                      <strong>Embarcación:</strong>{" "}
                      {salidaSeleccionada.embarcacion_nombre}
                    </div>
                  )}
                  {salidaSeleccionada.destino && (
                    <div>
                      <strong>Destino:</strong> {salidaSeleccionada.destino}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Registro de brazaletes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Brazaletes Utilizados
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarBrazalete}
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Brazalete
              </Button>
            </div>

            {brazaletesForm.map((brazalete, index) => {
              const brazaleteValido = validarBrazalete(brazalete.codigo);

              return (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Brazalete #{index + 1}</h4>
                    {brazaletesForm.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarBrazalete(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Código del brazalete */}
                    <div className="space-y-2">
                      <Label htmlFor={`brazalete-${index}-codigo`}>
                        Código del Brazalete *
                      </Label>
                      <Input
                        id={`brazalete-${index}-codigo`}
                        value={brazalete.codigo}
                        onChange={(e) =>
                          actualizarBrazalete(index, "codigo", e.target.value)
                        }
                        placeholder="Ej: BRZ-001-2024"
                        className={
                          errors.brazaletes?.[index]?.codigo
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors.brazaletes?.[index]?.codigo && (
                        <p className="text-sm text-red-500">
                          {errors.brazaletes[index]?.codigo?.message}
                        </p>
                      )}

                      {/* Validación del brazalete */}
                      {brazalete.codigo && (
                        <div className="text-sm">
                          {brazaleteValido ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>
                                🎫 Universal - $
                                {brazaleteValido.precio.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="w-4 h-4" />
                              <span>
                                Brazalete no encontrado o no disponible
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Nacionalidad del turista */}
                    <div className="space-y-2">
                      <Label htmlFor={`brazalete-${index}-nacionalidad`}>
                        Nacionalidad del Turista
                      </Label>
                      <Select
                        value={brazalete.turista_nacionalidad || "nacional"}
                        onValueChange={(value) =>
                          actualizarBrazalete(
                            index,
                            "turista_nacionalidad",
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar nacionalidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">🏠 Local</SelectItem>
                          <SelectItem value="nacional">🇲🇽 Nacional</SelectItem>
                          <SelectItem value="internacional">
                            🌍 Internacional
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Edad del turista */}
                    <div className="space-y-2">
                      <Label htmlFor={`brazalete-${index}-edad`}>
                        Edad del Turista (Opcional)
                      </Label>
                      <Input
                        id={`brazalete-${index}-edad`}
                        type="number"
                        min="0"
                        max="120"
                        value={brazalete.turista_edad || ""}
                        onChange={(e) =>
                          actualizarBrazalete(
                            index,
                            "turista_edad",
                            parseInt(e.target.value) || undefined
                          )
                        }
                        placeholder="25"
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {errors.brazaletes && (
              <p className="text-sm text-red-500">
                {errors.brazaletes.message}
              </p>
            )}
          </div>

          {/* Resumen */}
          {salidaSeleccionada && brazaletesForm.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resumen del Registro</h3>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Salida:</span>
                  <span className="font-semibold">
                    {new Date(salidaSeleccionada.fecha).toLocaleDateString(
                      "es-MX"
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total de brazaletes:</span>
                  <span className="font-semibold">{brazaletesForm.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Brazaletes válidos:</span>
                  <span className="font-semibold">
                    {
                      brazaletesForm.filter((b) => validarBrazalete(b.codigo))
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Por tipo:</span>
                  <span className="font-semibold">
                    Universal: {brazaletesForm.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setSalidaSeleccionada(null);
              }}
              disabled={isSubmitting}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                loading ||
                !salidaSeleccionada ||
                brazaletesForm.length === 0 ||
                brazaletesForm.some((b) => !validarBrazalete(b.codigo))
              }
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registrando Uso...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Registrar Uso de Brazaletes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
