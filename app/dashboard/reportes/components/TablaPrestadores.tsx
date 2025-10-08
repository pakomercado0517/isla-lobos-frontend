import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ship } from "lucide-react";
import { formatCurrency } from "./utils";

interface ReportePorPrestador {
  prestador_id: string;
  prestador_nombre: string;
  total_salidas: number;
  total_pasajeros: number;
  embarcaciones_count: number;
  ultima_salida: string;
  ingresos_estimados: number;
}

interface TablaPrestadoresProps {
  prestadores: ReportePorPrestador[];
}

export function TablaPrestadores({ prestadores }: TablaPrestadoresProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento por Prestador</CardTitle>
        <CardDescription>
          Estadísticas de actividad por prestador de servicios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prestador</TableHead>
              <TableHead>Embarcaciones</TableHead>
              <TableHead>Salidas</TableHead>
              <TableHead>Pasajeros</TableHead>
              <TableHead>Última Salida</TableHead>
              <TableHead>Ingresos Est.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prestadores.map((prestador) => (
              <TableRow key={prestador.prestador_id}>
                <TableCell className="font-medium">
                  {prestador.prestador_nombre}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Ship className="w-4 h-4 mr-1" />
                    {prestador.embarcaciones_count}
                  </div>
                </TableCell>
                <TableCell>{prestador.total_salidas}</TableCell>
                <TableCell>{prestador.total_pasajeros}</TableCell>
                <TableCell>
                  {new Date(prestador.ultima_salida).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {formatCurrency(prestador.ingresos_estimados)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

