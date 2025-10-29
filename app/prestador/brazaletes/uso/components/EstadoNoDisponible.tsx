import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import type { BrazaletesPrestador } from "@/lib/types/brazaletes";
import { getMensajeEstadoRegistro } from "./utils";

interface EstadoNoDisponibleProps {
  brazaletesDisponibles: BrazaletesPrestador["detalle"];
  onVerificarEstado: () => void;
}

export function EstadoNoDisponible({
  brazaletesDisponibles,
  onVerificarEstado,
}: EstadoNoDisponibleProps) {
  const mensaje = getMensajeEstadoRegistro(brazaletesDisponibles);

  return (
    <div className="text-center py-6 md:py-12 px-4">
      <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-yellow-400 mx-auto mb-3 md:mb-4" />
      <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
        No puedes registrar brazaletes en este momento
      </h3>
      <p className="text-xs md:text-sm text-gray-600 mb-4 max-w-sm mx-auto">
        {mensaje}
      </p>
      <Button onClick={onVerificarEstado} className="text-xs md:text-sm">
        <RefreshCw className="w-4 h-4 mr-2" />
        Verificar Estado
      </Button>
    </div>
  );
}
