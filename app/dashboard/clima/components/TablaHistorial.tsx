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
    <>
      {/* Vista de Cards para Móvil */}
      <div className="md:hidden space-y-3">
        {condiciones.map((condicion) => (
          <div
            key={condicion.id}
            className="rounded-lg border bg-card p-3 space-y-3"
          >
            {/* Fecha y Estado */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {formatearFechaHora(condicion.fecha_hora)}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Fuente: {condicion.fuente}
                </p>
              </div>
              <Badge
                className={
                  getEstadoPuertoColor(condicion.estado_puerto) +
                  " text-[10px] flex-shrink-0"
                }
              >
                {condicion.estado_puerto}
              </Badge>
            </div>

            {/* Métricas Principales */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-md bg-blue-50 p-2">
                <div className="flex-shrink-0 rounded bg-blue-100 p-1.5">
                  <div className="text-xs font-bold text-blue-600">
                    {condicion.oleaje}m
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Oleaje</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md bg-green-50 p-2">
                <div className="flex-shrink-0 rounded bg-green-100 p-1.5">
                  <div className="text-xs font-bold text-green-600">
                    {condicion.viento_velocidad}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">km/h</p>
                  <p className="text-[9px] text-slate-400">
                    {condicion.viento_direccion}
                  </p>
                </div>
              </div>
            </div>

            {/* Visibilidad */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-[10px] text-slate-500">Visibilidad:</span>
              <Badge
                className={
                  getVisibilidadColor(condicion.visibilidad) + " text-[10px]"
                }
              >
                {condicion.visibilidad}
              </Badge>
            </div>

            {/* Acciones (solo CONANP) */}
            {esConanp && (
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditar?.(condicion)}
                  className="flex-1 h-8 text-xs"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEliminar?.(condicion.id)}
                  className="flex-1 h-8 text-xs text-red-600"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Vista de Tabla para Desktop */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha y Hora</TableHead>
              <TableHead className="text-center">Oleaje</TableHead>
              <TableHead className="text-center">Viento</TableHead>
              <TableHead className="text-center">Visibilidad</TableHead>
              <TableHead className="text-center">Estado Puerto</TableHead>
              <TableHead className="text-center">Fuente</TableHead>
              {esConanp && (
                <TableHead className="text-right">Acciones</TableHead>
              )}
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
    </>
  );
}
