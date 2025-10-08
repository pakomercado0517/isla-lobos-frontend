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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
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
  const stockInsuficiente = watchedValues.cantidad > stockDisponible;

  // Buscar prestador seleccionado
  useEffect(() => {
    const prestador = prestadores.find(
      (p) => p.id === watchedValues.prestador_id
    );
    setPrestadorSeleccionado(prestador || null);
  }, [watchedValues.prestador_id, prestadores]);

  const handleFormSubmit = async (data: VentaBrazaletesFormData) => {
    if (stockInsuficiente) {
      return;
    }

    setIsSubmitting(true);

    // 📋 Log para verificar data enviada
    console.log("=== DATOS DE VENTA ENVIADOS ===");
    console.log("Prestador ID:", data.prestador_id);
    console.log("Cantidad:", data.cantidad);
    console.log("Tipo:", data.tipo);
    console.log("Método de pago:", data.metodo_pago);
    console.log("Estado de pago:", data.estado_pago);
    console.log("Observaciones:", data.observaciones || "(ninguna)");
    console.log("Objeto completo:", JSON.stringify(data, null, 2));
    console.log("================================");

    try {
      await onSubmit(data);
      reset();
      setPrestadorSeleccionado(null);
    } catch (error) {
      console.error("Error al realizar venta:", error);
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
                  ℹ️ Los números de brazaletes se asignarán automáticamente por
                  la API
                </p>
              </div>
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
          {prestadorSeleccionado && watchedValues.cantidad > 0 && (
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
                  <span>Tipo de brazalete:</span>
                  <span className="font-semibold">🎫 Universal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cantidad:</span>
                  <span className="font-semibold">
                    {watchedValues.cantidad} brazaletes
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
                      stockDisponible - watchedValues.cantidad < 10
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {stockDisponible - watchedValues.cantidad} brazaletes
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
