import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { Salida } from "@/lib/types/salida";

interface InformacionHoraProps {
  salida: Salida;
}

export function InformacionHora({ salida }: InformacionHoraProps) {
  // Solo mostrar si tiene hora (destinos sin bloque)
  if (!salida.hora || salida.bloque) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          Hora de Salida
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-2">
          <div className="text-2xl sm:text-3xl font-bold text-[var(--isla-teal)]">
            {salida.hora}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Horario programado</div>
        </div>
      </CardContent>
    </Card>
  );
}
