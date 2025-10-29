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
  if (!prestadores || prestadores.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <Ship className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground/50" />
            <span className="text-sm md:text-base font-medium">
              No hay datos de prestadores disponibles
            </span>
            <span className="text-xs md:text-sm text-muted-foreground">
              Verifique que existan salidas registradas en el período
              seleccionado
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Vista de Cards para Móvil */}
      <div className="md:hidden space-y-3">
        {prestadores.map((prestador) => (
          <Card key={prestador.prestador_id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base truncate">
                {prestador.prestador_nombre}
              </CardTitle>
              <CardDescription className="text-xs flex items-center gap-1">
                <Ship className="w-3 h-3" />
                {prestador.embarcaciones_count} embarcación(es)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500">Salidas</p>
                  <p className="text-sm font-medium">
                    {prestador.total_salidas}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500">Pasajeros</p>
                  <p className="text-sm font-medium">
                    {prestador.total_pasajeros}
                  </p>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t">
                <p className="text-[10px] text-slate-500">Última Salida</p>
                <p className="text-xs font-medium">
                  {prestador.ultima_salida
                    ? new Date(prestador.ultima_salida).toLocaleDateString(
                        "es-MX"
                      )
                    : "No disponible"}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t">
                <p className="text-[10px] text-slate-500">Ingresos Estimados</p>
                <p className="text-sm font-medium">
                  {formatCurrency(prestador.ingresos_estimados)}
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
            Rendimiento por Prestador
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
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
                    {prestador.ultima_salida
                      ? new Date(prestador.ultima_salida).toLocaleDateString()
                      : "No disponible"}
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
    </>
  );
}
