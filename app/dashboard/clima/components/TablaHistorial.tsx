import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { CondicionMeteorologica } from "@/lib/types/clima";
import {
  formatearFechaHora,
  getEstadoPuertoColor,
  getVisibilidadColor,
} from "./utils";

interface TablaHistorialProps {
  condiciones: CondicionMeteorologica[];
  onEditar?: (condicion: CondicionMeteorologica) => void;
  onEliminar?: (id: string) => void;
  esConanp: boolean;
}

export function TablaHistorial({
  condiciones,
  onEditar,
  onEliminar,
  esConanp,
}: TablaHistorialProps) {
  if (condiciones.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No hay condiciones meteorológicas registradas
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha y Hora</TableHead>
            <TableHead className="text-center">Oleaje</TableHead>
            <TableHead className="text-center">Viento</TableHead>
            <TableHead className="text-center">Visibilidad</TableHead>
            <TableHead className="text-center">Estado Puerto</TableHead>
            <TableHead className="text-center">Fuente</TableHead>
            {esConanp && <TableHead className="text-right">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {condiciones.map((condicion) => (
            <TableRow key={condicion.id}>
              <TableCell className="font-medium">
                {formatearFechaHora(condicion.fecha_hora)}
              </TableCell>
              <TableCell className="text-center">
                <span className="font-semibold text-blue-600">
                  {condicion.oleaje}m
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col items-center">
                  <span className="font-semibold text-green-600">
                    {condicion.viento_velocidad} km/h
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {condicion.viento_direccion}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge className={getVisibilidadColor(condicion.visibilidad)}>
                  {condicion.visibilidad}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  className={getEstadoPuertoColor(condicion.estado_puerto)}
                >
                  {condicion.estado_puerto}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-sm">{condicion.fuente}</span>
              </TableCell>
              {esConanp && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditar?.(condicion)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEliminar?.(condicion.id)}
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
