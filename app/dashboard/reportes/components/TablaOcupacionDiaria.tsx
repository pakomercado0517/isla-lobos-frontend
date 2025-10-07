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
import { formatCurrency } from "./utils";

interface OcupacionPorDia {
  fecha: string;
  total_salidas: number;
  total_pasajeros: number;
  ocupacion_porcentaje: number;
  ingresos_estimados: number;
}

interface TablaOcupacionDiariaProps {
  ocupacion: OcupacionPorDia[];
}

export function TablaOcupacionDiaria({ ocupacion }: TablaOcupacionDiariaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ocupación Diaria</CardTitle>
        <CardDescription>
          Análisis de salidas y pasajeros por día (últimos 7 días)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Salidas</TableHead>
              <TableHead>Pasajeros</TableHead>
              <TableHead>Ocupación</TableHead>
              <TableHead>Ingresos Est.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ocupacion.map((dia) => (
              <TableRow key={dia.fecha}>
                <TableCell className="font-medium">
                  {new Date(dia.fecha).toLocaleDateString("es-MX", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>{dia.total_salidas}</TableCell>
                <TableCell>{dia.total_pasajeros}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                      <div
                        className={`h-2 rounded-full ${
                          dia.ocupacion_porcentaje >= 90
                            ? "bg-red-500"
                            : dia.ocupacion_porcentaje >= 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${dia.ocupacion_porcentaje}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {dia.ocupacion_porcentaje}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(dia.ingresos_estimados)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

