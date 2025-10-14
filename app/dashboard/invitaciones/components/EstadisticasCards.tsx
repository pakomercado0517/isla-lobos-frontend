import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle, Clock, XCircle } from "lucide-react";
import { EstadisticasInvitaciones } from "@/lib/types/invitaciones";

interface EstadisticasCardsProps {
  estadisticas: EstadisticasInvitaciones | null;
}

export function EstadisticasCards({ estadisticas }: EstadisticasCardsProps) {
  if (!estadisticas) return null;

  const { generales, este_mes } = estadisticas;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Invitaciones
          </CardTitle>
          <Mail className="h-4 w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[var(--isla-dark-teal)]">
            {generales.total}
          </div>
          <p className="text-xs text-gray-500 mt-1">Creadas en total</p>
        </CardContent>
      </Card>

      {/* Disponibles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Disponibles
          </CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {generales.disponibles}
          </div>
          <p className="text-xs text-gray-500 mt-1">Listas para usar</p>
        </CardContent>
      </Card>

      {/* Usadas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Utilizadas
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {generales.usadas}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {generales.porcentaje_usadas.toFixed(0)}% del total
          </p>
        </CardContent>
      </Card>

      {/* Expiradas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Expiradas
          </CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {generales.expiradas}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Este mes: {este_mes.creadas} creadas
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
