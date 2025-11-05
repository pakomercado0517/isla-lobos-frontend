import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";
import { Embarcacion } from "@/lib/types/embarcacion";
import {
  getEstadoIcon,
  getEstadoColor,
  getTipoColor,
  formatearEstado,
} from "./utils";

interface TablaEmbarcacionesProps {
  embarcaciones: Embarcacion[];
  onEditEmbarcacion: (embarcacion: Embarcacion) => void;
}

export function TablaEmbarcaciones({
  embarcaciones,
  onEditEmbarcacion,
}: TablaEmbarcacionesProps) {
  return (
    <>
      {/* Vista de Cards para Móvil */}
      <div className="md:hidden space-y-3">
        {embarcaciones.map((embarcacion) => (
          <Card key={embarcacion.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">
                    {embarcacion.nombre}
                  </CardTitle>
                  <CardDescription className="text-xs font-mono mt-1">
                    {embarcacion.matricula}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {getEstadoIcon(embarcacion.estado)}
                  <Badge
                    className={
                      getEstadoColor(embarcacion.estado) + " text-[10px]"
                    }
                  >
                    {formatearEstado(embarcacion.estado)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500">Tipo</p>
                  <Badge
                    className={getTipoColor(embarcacion.tipo) + " text-[10px]"}
                  >
                    {embarcacion.tipo === "mayor" ? "Mayor" : "Menor"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500">Capacidad</p>
                  <p className="text-xs font-semibold">
                    {embarcacion.capacidad} personas
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditEmbarcacion(embarcacion)}
                  className="flex-1 h-8 text-xs"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vista de Tabla para Desktop */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Embarcaciones</CardTitle>
          <CardDescription>
            {embarcaciones.length} embarcación
            {embarcaciones.length !== 1 ? "es" : ""} encontrada
            {embarcaciones.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {embarcaciones.map((embarcacion) => (
                <TableRow key={embarcacion.id}>
                  <TableCell className="font-medium">
                    {embarcacion.nombre}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {embarcacion.matricula}
                  </TableCell>
                  <TableCell>
                    <Badge className={getTipoColor(embarcacion.tipo)}>
                      {embarcacion.tipo === "mayor"
                        ? "Embarcación Mayor"
                        : "Embarcación Menor"}
                    </Badge>
                  </TableCell>
                  <TableCell>{embarcacion.capacidad} personas</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getEstadoIcon(embarcacion.estado)}
                      <Badge className={getEstadoColor(embarcacion.estado)}>
                        {formatearEstado(embarcacion.estado)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditEmbarcacion(embarcacion)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
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
