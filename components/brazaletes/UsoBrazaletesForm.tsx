"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { clientLogger } from "@/lib/logger-client";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Package, Users, Calendar, Plus, Trash2 } from "lucide-react";
import { UsoBrazaleteFormData, Brazalete } from "@/lib/types/brazaletes";
import { formatearFechaSinTimezone } from "@/lib/utils";

interface UsoBrazaletesFormProps {
  onSubmit: (data: UsoBrazaleteFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  salidaId: string; // ID de la salida actual (automático)
  salidaFecha: string; // Fecha de la salida para mostrar
  brazaletesDisponibles?: Brazalete[];
}

export function UsoBrazaletesForm({
  onSubmit,
  loading = false,
  error,
  salidaId,
  salidaFecha,
  brazaletesDisponibles = [],
}: UsoBrazaletesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UsoBrazaleteFormData>({
    defaultValues: {
      salida_id: salidaId,
      cantidad: 0,
      brazaletes: [{ cantidad: 1, turista_nacionalidad: "nacional" as const }],
    },
  });

  const watchedValues = watch();
  const brazaletesForm = watchedValues.brazaletes || [];

  const handleFormSubmit = async (data: UsoBrazaleteFormData) => {
    // Validación manual
    if (!data.salida_id) {
      return;
    }

    if (!data.brazaletes || data.brazaletes.length === 0) {
      return;
    }

    // Calcular cantidad total siempre
    const cantidadTotal =
      data.brazaletes?.reduce((sum, b) => sum + (b.cantidad || 0), 0) || 0;
    data.cantidad = cantidadTotal;

    if (cantidadTotal <= 0) {
      return;
    }

    if (cantidadTotal > brazaletesDisponibles.length) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      clientLogger.error(
        "Error al enviar formulario de uso de brazaletes",
        error,
        { salidaId: data.salida_id }
      );
      // Error handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const agregarBrazalete = () => {
    const nuevosBrazaletes = [
      ...brazaletesForm,
      { cantidad: 1, turista_nacionalidad: "nacional" as const },
    ];
    setValue("brazaletes", nuevosBrazaletes);
  };

  const eliminarBrazalete = (index: number) => {
    if (brazaletesForm.length > 1) {
      const nuevosBrazaletes = brazaletesForm.filter((_, i) => i !== index);
      setValue("brazaletes", nuevosBrazaletes);
    }
  };

  const actualizarBrazalete = (
    index: number,
    campo: string,
    valor: string | number
  ) => {
    const nuevosBrazaletes = [...brazaletesForm];
    nuevosBrazaletes[index] = { ...nuevosBrazaletes[index], [campo]: valor };
    setValue("brazaletes", nuevosBrazaletes);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Asignación de Brazaletes a Salida
        </CardTitle>
        <CardDescription>
          Asigna brazaletes disponibles a una salida turística
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleFormSubmit, (_errors) => {})}
          className="space-y-6"
        >
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Información de la salida */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Información de la Salida
            </h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium text-blue-900">
                    Fecha de la Salida
                  </span>
                  <span className="text-blue-700">
                    {formatearFechaSinTimezone(salidaFecha)}
                  </span>
                </div>
                <div className="text-blue-600">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Brazaletes a asignar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Brazaletes a Asignar
            </h3>

            {/* Información de brazaletes disponibles */}
            <div className="text-sm text-gray-600">
              Brazaletes disponibles:{" "}
              <span className="font-semibold">
                {brazaletesDisponibles.length}
              </span>
            </div>

            {/* Mensaje informativo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-blue-600 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">
                    ¿Necesitas especificar diferentes edades o nacionalidades?
                  </h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Si requieres registrar brazaletes con diferentes
                    características de turistas, puedes agregar grupos
                    específicos haciendo clic en &quot;Agregar Grupo&quot;.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={agregarBrazalete}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Grupo
                  </Button>
                </div>
              </div>
            </div>

            {/* Grupos específicos (opcional) */}
            {brazaletesForm.map((grupo, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-4 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Grupo #{index + 1}</h4>
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
                  {/* Cantidad para este grupo */}
                  <div className="space-y-2">
                    <Label htmlFor={`grupo-${index}-cantidad`}>
                      Cantidad *
                    </Label>
                    <Input
                      id={`grupo-${index}-cantidad`}
                      type="number"
                      min="1"
                      value={grupo.cantidad || 1}
                      onChange={(e) =>
                        actualizarBrazalete(
                          index,
                          "cantidad",
                          parseInt(e.target.value) || 1
                        )
                      }
                      className={
                        errors.brazaletes?.[index]?.cantidad
                          ? "border-red-500"
                          : ""
                      }
                    />
                    {errors.brazaletes?.[index]?.cantidad && (
                      <p className="text-sm text-red-500">
                        {errors.brazaletes[index]?.cantidad?.message}
                      </p>
                    )}
                  </div>

                  {/* Nacionalidad del turista */}
                  <div className="space-y-2">
                    <Label htmlFor={`grupo-${index}-nacionalidad`}>
                      Nacionalidad del Turista
                    </Label>
                    <Select
                      value={grupo.turista_nacionalidad || "nacional"}
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
                    <Label htmlFor={`grupo-${index}-edad`}>
                      Edad del Turista (Opcional)
                    </Label>
                    <Input
                      id={`grupo-${index}-edad`}
                      type="number"
                      min="0"
                      max="120"
                      value={grupo.turista_edad || ""}
                      onChange={(e) =>
                        actualizarBrazalete(
                          index,
                          "turista_edad",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="25"
                    />
                  </div>
                </div>
              </div>
            ))}

            {errors.brazaletes && (
              <p className="text-sm text-red-500">
                {errors.brazaletes.message}
              </p>
            )}
          </div>

          {/* Resumen */}
          {brazaletesForm.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Resumen de la Asignación
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Salida:</span>
                  <span className="font-semibold">
                    {formatearFechaSinTimezone(salidaFecha)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total de brazaletes:</span>
                  <span className="font-semibold">
                    {brazaletesForm.reduce(
                      (sum, b) => sum + (b.cantidad || 0),
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Brazaletes disponibles:</span>
                  <span className="font-semibold">
                    {brazaletesDisponibles.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Por tipo:</span>
                  <span className="font-semibold">
                    Universal:{" "}
                    {brazaletesForm.reduce(
                      (sum, b) => sum + (b.cantidad || 0),
                      0
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Grupos específicos:</span>
                  <span className="font-semibold">{brazaletesForm.length}</span>
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
                brazaletesForm.length === 0 ||
                brazaletesForm.reduce((sum, b) => sum + (b.cantidad || 0), 0) <=
                  0 ||
                brazaletesForm.reduce((sum, b) => sum + (b.cantidad || 0), 0) >
                  brazaletesDisponibles.length
              }
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Asignando Brazaletes...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Asignar Brazaletes a Salida
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
