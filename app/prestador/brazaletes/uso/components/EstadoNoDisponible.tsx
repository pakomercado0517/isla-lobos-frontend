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
    <div className="text-center py-12">
      <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No puedes registrar brazaletes en este momento
      </h3>
      <p className="text-gray-600 mb-4">{mensaje}</p>
      <Button onClick={onVerificarEstado}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Verificar Estado
      </Button>
    </div>
  );
}
