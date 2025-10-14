"use client";

import { useState } from "react";
import { clientLogger } from "@/lib/logger-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Package, DollarSign } from "lucide-react";
import { CreateLoteFormData } from "@/lib/types/brazaletes";

const loteSchema = z
  .object({
    numero_lote: z.string().min(1, "El número de lote es requerido"),
    tipo: z.literal("universal"),
    fecha_compra: z.string().min(1, "La fecha de compra es requerida"),
    fecha_vencimiento: z.string().optional(),
    costo_unitario: z
      .number()
      .min(0, "El costo unitario debe ser mayor o igual a 0"),
    precio_venta: z
      .number()
      .min(0, "El precio de venta debe ser mayor o igual a 0"),
    proveedor: z.string().optional(),
    observaciones: z.string().optional(),
    // Opción 1: Generación automática
    cantidad_total: z
      .number()
      .min(1, "La cantidad debe ser mayor a 0")
      .optional(),
    // Opción 2: Rango personalizado
    primer_numero: z
      .number()
      .min(1, "El primer número debe ser mayor a 0")
      .optional(),
    ultimo_numero: z
      .number()
      .min(1, "El último número debe ser mayor a 0")
      .optional(),
  })
  .refine(
    (data) => {
      // Validar que se proporcione al menos una opción de cantidad
      return data.cantidad_total || (data.primer_numero && data.ultimo_numero);
    },
    {
      message: "Debe proporcionar cantidad total o rango de numeración",
      path: ["cantidad_total"],
    }
  )
  .refine(
    (data) => {
      // Si se proporciona rango, validar que el último número sea mayor al primero
      if (data.primer_numero && data.ultimo_numero) {
        return data.ultimo_numero > data.primer_numero;
      }
      return true;
    },
    {
      message: "El último número debe ser mayor al primer número",
      path: ["ultimo_numero"],
    }
  );

interface LoteFormProps {
  onSubmit: (data: CreateLoteFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
}

export function LoteForm({ onSubmit, loading = false, error }: LoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modoCreacion, setModoCreacion] = useState<"automatico" | "rango">(
    "automatico"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateLoteFormData>({
    resolver: zodResolver(loteSchema),
    defaultValues: {
      tipo: "universal",
      fecha_compra: new Date().toISOString().split("T")[0],
      costo_unitario: 0,
      precio_venta: 0,
    },
  });

  const watchedValues = watch();
  const margen = watchedValues.precio_venta - watchedValues.costo_unitario;

  // Calcular cantidad basada en el modo de creación
  const cantidadCalculada =
    modoCreacion === "automatico"
      ? watchedValues.cantidad_total || 0
      : watchedValues.primer_numero && watchedValues.ultimo_numero
      ? watchedValues.ultimo_numero - watchedValues.primer_numero + 1
      : 0;

  const totalCosto = cantidadCalculada * watchedValues.costo_unitario;
  const totalVenta = cantidadCalculada * watchedValues.precio_venta;

  const handleFormSubmit = async (data: CreateLoteFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      clientLogger.error("Error al enviar formulario de lote", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Crear Nuevo Lote de Brazaletes
        </CardTitle>
        <CardDescription>
          Complete la información para crear un nuevo lote de brazaletes
          universales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_lote">Número de Lote *</Label>
              <Input
                id="numero_lote"
                {...register("numero_lote")}
                placeholder="Ej: LOTE-2024-001"
                className={errors.numero_lote ? "border-red-500" : ""}
              />
              {errors.numero_lote && (
                <p className="text-sm text-red-500">
                  {errors.numero_lote.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_compra">Fecha de Compra *</Label>
              <Input
                id="fecha_compra"
                type="date"
                {...register("fecha_compra")}
                className={errors.fecha_compra ? "border-red-500" : ""}
              />
              {errors.fecha_compra && (
                <p className="text-sm text-red-500">
                  {errors.fecha_compra.message}
                </p>
              )}
            </div>
          </div>

          {/* Modo de creación de brazaletes */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Modo de Creación</Label>
            <RadioGroup
              value={modoCreacion}
              onValueChange={(value) => {
                setModoCreacion(value as "automatico" | "rango");
                // Limpiar campos cuando cambie el modo
                if (value === "automatico") {
                  setValue("primer_numero", undefined);
                  setValue("ultimo_numero", undefined);
                } else {
                  setValue("cantidad_total", undefined);
                }
              }}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="automatico" id="automatico" />
                <Label htmlFor="automatico" className="font-normal">
                  Generación automática (especificar cantidad)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rango" id="rango" />
                <Label htmlFor="rango" className="font-normal">
                  Rango personalizado (especificar numeración)
                </Label>
              </div>
            </RadioGroup>

            {modoCreacion === "automatico" && (
              <div className="space-y-2">
                <Label htmlFor="cantidad_total">Cantidad Total *</Label>
                <Input
                  id="cantidad_total"
                  type="number"
                  {...register("cantidad_total", { valueAsNumber: true })}
                  placeholder="100"
                  className={errors.cantidad_total ? "border-red-500" : ""}
                />
                {errors.cantidad_total && (
                  <p className="text-sm text-red-500">
                    {errors.cantidad_total.message}
                  </p>
                )}
              </div>
            )}

            {modoCreacion === "rango" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primer_numero">Primer Número *</Label>
                  <Input
                    id="primer_numero"
                    type="number"
                    {...register("primer_numero", { valueAsNumber: true })}
                    placeholder="1000"
                    className={errors.primer_numero ? "border-red-500" : ""}
                  />
                  {errors.primer_numero && (
                    <p className="text-sm text-red-500">
                      {errors.primer_numero.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ultimo_numero">Último Número *</Label>
                  <Input
                    id="ultimo_numero"
                    type="number"
                    {...register("ultimo_numero", { valueAsNumber: true })}
                    placeholder="1099"
                    className={errors.ultimo_numero ? "border-red-500" : ""}
                  />
                  {errors.ultimo_numero && (
                    <p className="text-sm text-red-500">
                      {errors.ultimo_numero.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Mostrar cantidad calculada */}
            {cantidadCalculada > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Cantidad de brazaletes:</strong> {cantidadCalculada}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_vencimiento">
              Fecha de Vencimiento (Opcional)
            </Label>
            <Input
              id="fecha_vencimiento"
              type="date"
              {...register("fecha_vencimiento")}
            />
          </div>

          {/* Costos y precios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Información Financiera
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costo_unitario">Costo Unitario (MXN) *</Label>
                <Input
                  id="costo_unitario"
                  type="number"
                  step="0.01"
                  {...register("costo_unitario", { valueAsNumber: true })}
                  placeholder="5.00"
                  className={errors.costo_unitario ? "border-red-500" : ""}
                />
                {errors.costo_unitario && (
                  <p className="text-sm text-red-500">
                    {errors.costo_unitario.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="precio_venta">Precio de Venta (MXN) *</Label>
                <Input
                  id="precio_venta"
                  type="number"
                  step="0.01"
                  {...register("precio_venta", { valueAsNumber: true })}
                  placeholder="15.00"
                  className={errors.precio_venta ? "border-red-500" : ""}
                />
                {errors.precio_venta && (
                  <p className="text-sm text-red-500">
                    {errors.precio_venta.message}
                  </p>
                )}
              </div>
            </div>

            {/* Resumen financiero */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Margen por unidad:</span>
                <span
                  className={`font-semibold ${
                    margen >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${margen.toFixed(2)} MXN
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Costo total del lote:</span>
                <span className="font-semibold">
                  ${totalCosto.toFixed(2)} MXN
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Valor total de venta:</span>
                <span className="font-semibold text-green-600">
                  ${totalVenta.toFixed(2)} MXN
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-2">
                <span>Ganancia estimada:</span>
                <span
                  className={margen >= 0 ? "text-green-600" : "text-red-600"}
                >
                  ${(totalVenta - totalCosto).toFixed(2)} MXN
                </span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proveedor">Proveedor (Opcional)</Label>
              <Input
                id="proveedor"
                {...register("proveedor")}
                placeholder="Nombre del proveedor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
              <Textarea
                id="observaciones"
                {...register("observaciones")}
                placeholder="Información adicional sobre el lote..."
                rows={3}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              Limpiar
            </Button>
            <Button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando Lote...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 mr-2" />
                  Crear Lote
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
