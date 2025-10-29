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
    <>
      {/* Vista de Cards para Móvil */}
      <div className="md:hidden space-y-3">
        {ocupacion.map((dia) => (
          <Card key={dia.fecha}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {new Date(dia.fecha).toLocaleDateString("es-MX", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </CardTitle>
              <CardDescription className="text-xs">
                Ocupación {dia.ocupacion_porcentaje}%
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500">Salidas</p>
                  <p className="text-sm font-medium">{dia.total_salidas}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500">Pasajeros</p>
                  <p className="text-sm font-medium">{dia.total_pasajeros}</p>
                </div>
              </div>

              {/* Barra de ocupación */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Ocupación</span>
                  <span className="font-medium">
                    {dia.ocupacion_porcentaje}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
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
              </div>

              <div className="pt-2 border-t space-y-1">
                <p className="text-[10px] text-slate-500">Ingresos Estimados</p>
                <p className="text-sm font-medium">
                  {formatCurrency(dia.ingresos_estimados)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vista de Tabla para Desktop */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Ocupación Diaria
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
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
                  <TableCell>
                    {formatCurrency(dia.ingresos_estimados)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
