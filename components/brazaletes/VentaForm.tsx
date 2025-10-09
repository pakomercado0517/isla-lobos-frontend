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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Package,
  DollarSign,
  User,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";
import { VentaBrazaletesFormData, METODOS_PAGO } from "@/lib/types/brazaletes";
import { User as UserType } from "@/lib/types/auth";

const ventaSchema = z.object({
  prestador_id: z.string().min(1, "Debe seleccionar un prestador"),
  cantidad: z.number().min(1, "La cantidad debe ser mayor a 0"),
  tipo: z.literal("universal"),
  metodo_pago: z
    .enum(["efectivo", "transferencia", "credito", "debito"])
    .optional(),
  estado_pago: z.enum(["pendiente", "pagado", "cancelado"]).optional(),
  observaciones: z.string().optional(),
  // ⭐ Campos para modo de rango específico
  primer_numero: z.number().min(1).optional(),
  ultimo_numero: z.number().min(1).optional(),
  año: z.number().min(2000).max(2100).optional(),
  lote_id: z.string().optional(),
});

interface VentaFormProps {
  onSubmit: (data: VentaBrazaletesFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  prestadores?: UserType[];
  inventarioDisponible?: {
    universal: number;
  };
}

export function VentaForm({
  onSubmit,
  loading = false,
  error,
  prestadores = [],
  inventarioDisponible = { universal: 0 },
}: VentaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prestadorSeleccionado, setPrestadorSeleccionado] =
    useState<UserType | null>(null);
  // ⭐ Estado para modo de venta
  const [modoVenta, setModoVenta] = useState<"automatico" | "rango">(
    "automatico"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    setError,
  } = useForm<VentaBrazaletesFormData>({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      tipo: "universal",
      cantidad: 1,
      metodo_pago: "efectivo",
      estado_pago: "pagado", // Ventas en ventanilla siempre están pagadas
    },
  });

  const watchedValues = watch();
  const stockDisponible = inventarioDisponible.universal || 0;

  // ⭐ Calcular cantidad según el modo
  const getCantidadCalculada = (): number => {
    if (modoVenta === "rango") {
      const primerNum = watchedValues.primer_numero;
      const ultimoNum = watchedValues.ultimo_numero;

      if (primerNum && ultimoNum && ultimoNum >= primerNum) {
        return ultimoNum - primerNum + 1;
      }
      return 0;
    }
    return watchedValues.cantidad || 0;
  };

  const cantidadCalculada = getCantidadCalculada();
  const stockInsuficiente = cantidadCalculada > stockDisponible;

  // Buscar prestador seleccionado
  useEffect(() => {
    const prestador = prestadores.find(
      (p) => p.id === watchedValues.prestador_id
    );
    setPrestadorSeleccionado(prestador || null);
  }, [watchedValues.prestador_id, prestadores]);

  // Resetear campos solo cuando se CAMBIA el modo de venta
  useEffect(() => {
    if (modoVenta === "automatico") {
      setValue("primer_numero", undefined);
      setValue("ultimo_numero", undefined);
      setValue("año", undefined);
      setValue("cantidad", 1);
    } else {
      // En modo rango, limpiar los campos
      setValue("primer_numero", undefined);
      setValue("ultimo_numero", undefined);
      setValue("año", undefined);
      setValue("cantidad", 0);
    }
    // ⚠️ Solo ejecutar cuando cambia el modo, NO incluir watchedValues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modoVenta]);

  const handleFormSubmit = async (data: VentaBrazaletesFormData) => {
    if (stockInsuficiente) {
      return;
    }

    // ⭐ Validaciones adicionales para modo rango
    if (modoVenta === "rango") {
      // Validar que los campos de rango estén presentes
      if (!data.primer_numero) {
        setError("primer_numero", {
          type: "manual",
          message: "El primer número es requerido",
        });
        return;
      }

      if (!data.ultimo_numero) {
        setError("ultimo_numero", {
          type: "manual",
          message: "El último número es requerido",
        });
        return;
      }

      // Validar que último sea mayor que primero
      if (data.ultimo_numero <= data.primer_numero) {
        setError("ultimo_numero", {
          type: "manual",
          message: "El último número debe ser mayor al primer número",
        });
        return;
      }
    }

    // ⭐ Preparar datos según modo de venta
    const dataToSend = { ...data };

    if (modoVenta === "automatico") {
      // Modo automático: eliminar campos de rango
      delete dataToSend.primer_numero;
      delete dataToSend.ultimo_numero;
      delete dataToSend.año;
      // La cantidad viene del input
    } else {
      // Modo rango: asegurar que la cantidad coincida con el rango calculado
      dataToSend.cantidad =
        dataToSend.ultimo_numero! - dataToSend.primer_numero! + 1;

      // Si no hay año, el backend usará el actual (según API)
      if (!dataToSend.año) {
        delete dataToSend.año;
      }
    }

    setIsSubmitting(true);

    try {
      await onSubmit(dataToSend);
      reset();
      setPrestadorSeleccionado(null);
      setModoVenta("automatico"); // Resetear a automático
    } catch {
      // Error handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Venta de Brazaletes a Prestador
        </CardTitle>
        <CardDescription>
          Complete la información para realizar una venta de brazaletes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Alerta de stock insuficiente */}
          {stockInsuficiente && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Stock Insuficiente:</strong> Solo hay {stockDisponible}{" "}
                brazaletes de tipo &quot;{watchedValues.tipo}&quot; disponibles.
              </AlertDescription>
            </Alert>
          )}

          {/* Información del prestador */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Selección de Prestador
            </h3>

            <div className="space-y-2">
              <Label htmlFor="prestador_id">Prestador *</Label>
              <Select
                onValueChange={(value) => setValue("prestador_id", value)}
              >
                <SelectTrigger
                  className={errors.prestador_id ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Seleccionar prestador" />
                </SelectTrigger>
                <SelectContent>
                  {prestadores.length > 0 ? (
                    prestadores.map((prestador) => (
                      <SelectItem key={prestador.id} value={prestador.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{prestador.nombre}</span>
                          <Badge variant="outline" className="ml-2">
                            {prestador.email}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-prestadores" disabled>
                      No hay prestadores disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.prestador_id && (
                <p className="text-sm text-red-500">
                  {errors.prestador_id.message}
                </p>
              )}
              {prestadores.length === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No hay prestadores disponibles. Asegúrate de que existan
                    usuarios con rol &quot;prestador&quot; y que estén activos.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Información del prestador seleccionado */}
            {prestadorSeleccionado && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Prestador Seleccionado
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    <strong>Nombre:</strong> {prestadorSeleccionado.nombre}
                  </div>
                  <div>
                    <strong>Email:</strong> {prestadorSeleccionado.email}
                  </div>
                  <div>
                    <strong>Teléfono:</strong>{" "}
                    {prestadorSeleccionado.telefono || "No especificado"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Información de la venta */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Detalles de la Venta
            </h3>

            <div className="space-y-4">
              {/* ⭐ Selector de Modo de Venta */}
              <div className="space-y-2">
                <Label htmlFor="modo_venta">Modo de Venta *</Label>
                <Select
                  value={modoVenta}
                  onValueChange={(value) =>
                    setModoVenta(value as "automatico" | "rango")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar modo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatico">
                      🤖 Automático - Sistema asigna números
                    </SelectItem>
                    <SelectItem value="rango">
                      🎯 Rango Específico - Especificar números exactos
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  {modoVenta === "automatico"
                    ? "ℹ️ El sistema asignará automáticamente los brazaletes disponibles"
                    : "ℹ️ Especifica el rango exacto de números de brazaletes a vender"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Brazalete *</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    🎫 Universal
                  </span>
                  <span className="text-xs text-gray-500">
                    (Válido para isla y arrecife)
                  </span>
                  <Badge variant="outline" className="ml-2">
                    {inventarioDisponible.universal} disponibles
                  </Badge>
                </div>
                <input type="hidden" {...register("tipo")} value="universal" />
              </div>

              {/* ⭐ Campo de Cantidad - Solo en modo AUTOMÁTICO */}
              {modoVenta === "automatico" && (
                <div className="space-y-2">
                  <Label htmlFor="cantidad">Cantidad *</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    {...register("cantidad", { valueAsNumber: true })}
                    placeholder="1"
                    min="1"
                    max={stockDisponible}
                    className={errors.cantidad ? "border-red-500" : ""}
                  />
                  {errors.cantidad && (
                    <p className="text-sm text-red-500">
                      {errors.cantidad.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-600">
                    Stock disponible: {stockDisponible} brazaletes
                  </p>
                  <p className="text-xs text-blue-600">
                    ℹ️ Los números de brazaletes se asignarán automáticamente
                  </p>
                </div>
              )}

              {/* ⭐ Campos para modo RANGO ESPECÍFICO */}
              {modoVenta === "rango" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primer_numero">Primer Número *</Label>
                      <Input
                        id="primer_numero"
                        type="number"
                        placeholder="1"
                        min="1"
                        value={watchedValues.primer_numero || ""}
                        className={errors.primer_numero ? "border-red-500" : ""}
                        onChange={(e) => {
                          const primerNum = Number(e.target.value);
                          setValue("primer_numero", primerNum, {
                            shouldValidate: true,
                          });

                          // Calcular cantidad automáticamente
                          const ultimoNum = watchedValues.ultimo_numero;
                          if (ultimoNum && ultimoNum >= primerNum) {
                            const cantidad = ultimoNum - primerNum + 1;
                            setValue("cantidad", cantidad);
                          }
                        }}
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
                        placeholder="20"
                        min="1"
                        value={watchedValues.ultimo_numero || ""}
                        className={errors.ultimo_numero ? "border-red-500" : ""}
                        onChange={(e) => {
                          const ultimoNum = Number(e.target.value);
                          setValue("ultimo_numero", ultimoNum, {
                            shouldValidate: true,
                          });

                          // Calcular cantidad automáticamente
                          const primerNum = watchedValues.primer_numero;
                          if (primerNum && ultimoNum >= primerNum) {
                            const cantidad = ultimoNum - primerNum + 1;
                            setValue("cantidad", cantidad);
                          }
                        }}
                      />
                      {errors.ultimo_numero && (
                        <p className="text-sm text-red-500">
                          {errors.ultimo_numero.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Display de Cantidad Calculada */}
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">
                        Cantidad de brazaletes:
                      </span>
                      <span className="text-2xl font-bold text-blue-700">
                        {cantidadCalculada}
                      </span>
                    </div>
                    {watchedValues.primer_numero &&
                      watchedValues.ultimo_numero &&
                      watchedValues.ultimo_numero <
                        watchedValues.primer_numero && (
                        <p className="text-xs text-red-600 mt-2">
                          ⚠️ El último número debe ser mayor al primer número
                        </p>
                      )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="año">Año (Opcional)</Label>
                    <Input
                      id="año"
                      type="number"
                      {...register("año", { valueAsNumber: true })}
                      placeholder={new Date().getFullYear().toString()}
                      min="2000"
                      max="2100"
                      className={errors.año ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-gray-600">
                      ℹ️ Si no especificas, se usará el año actual (
                      {new Date().getFullYear()})
                    </p>
                  </div>

                  <p className="text-xs text-amber-600">
                    ⚠️ Asegúrate que los brazaletes del rango especificado estén
                    disponibles en el sistema
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodo_pago">Método de Pago</Label>
              <Select
                onValueChange={(value) =>
                  setValue(
                    "metodo_pago",
                    value as "efectivo" | "transferencia" | "credito" | "debito"
                  )
                }
                defaultValue="efectivo"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método de pago" />
                </SelectTrigger>
                <SelectContent>
                  {METODOS_PAGO.map((metodo) => (
                    <SelectItem key={metodo} value={metodo}>
                      {metodo === "efectivo"
                        ? "💵 Efectivo"
                        : metodo === "transferencia"
                        ? "🏦 Transferencia"
                        : metodo === "credito"
                        ? "💳 Crédito"
                        : "💳 Débito"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                ℹ️ El pago se realiza en ventanilla antes de entregar los
                brazaletes
              </p>
            </div>

            {/* Campo oculto - siempre pagado */}
            <input type="hidden" {...register("estado_pago")} value="pagado" />

            {/* Indicador visual de pago en ventanilla */}
            <div className="w-full rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <div className="flex items-start gap-3 w-full">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0" />
                <div className="text-green-800 text-sm flex-1">
                  <strong>Venta en Ventanilla:</strong> Esta venta se registra
                  como pagada. El prestador debe presentar el comprobante de
                  pago antes de recibir los brazaletes.
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
              <Textarea
                id="observaciones"
                {...register("observaciones")}
                placeholder="Información adicional sobre la venta..."
                rows={3}
              />
            </div>
          </div>

          {/* Resumen de la venta */}
          {prestadorSeleccionado && cantidadCalculada > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Resumen de la Venta
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Prestador:</span>
                  <span className="font-semibold">
                    {prestadorSeleccionado.nombre}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Modo de venta:</span>
                  <span className="font-semibold">
                    {modoVenta === "automatico"
                      ? "🤖 Automático"
                      : "🎯 Rango Específico"}
                  </span>
                </div>
                {modoVenta === "rango" &&
                  watchedValues.primer_numero &&
                  watchedValues.ultimo_numero && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Rango de números:</span>
                        <span className="font-semibold font-mono">
                          {watchedValues.primer_numero} -{" "}
                          {watchedValues.ultimo_numero}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Año:</span>
                        <span className="font-semibold">
                          {watchedValues.año || new Date().getFullYear()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Códigos:</span>
                        <span className="font-semibold font-mono text-xs">
                          BRZ-{watchedValues.año || new Date().getFullYear()}-
                          {String(watchedValues.primer_numero).padStart(6, "0")}{" "}
                          <br />
                          hasta BRZ-
                          {watchedValues.año || new Date().getFullYear()}-
                          {String(watchedValues.ultimo_numero).padStart(6, "0")}
                        </span>
                      </div>
                    </>
                  )}
                <div className="flex justify-between text-sm">
                  <span>Tipo de brazalete:</span>
                  <span className="font-semibold">🎫 Universal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cantidad:</span>
                  <span className="font-semibold">
                    {cantidadCalculada} brazaletes
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Método de pago:</span>
                  <span className="font-semibold">
                    {watchedValues.metodo_pago === "efectivo"
                      ? "💵 Efectivo"
                      : watchedValues.metodo_pago === "transferencia"
                      ? "🏦 Transferencia"
                      : watchedValues.metodo_pago === "credito"
                      ? "💳 Crédito"
                      : "💳 Débito"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Estado de pago:</span>
                  <span className="font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Pagado en Ventanilla
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t pt-2">
                  <span>Stock restante:</span>
                  <span
                    className={
                      stockDisponible - cantidadCalculada < 10
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {stockDisponible - cantidadCalculada} brazaletes
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
                setPrestadorSeleccionado(null);
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
                stockInsuficiente ||
                !prestadorSeleccionado
              }
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando Venta...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Realizar Venta
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
