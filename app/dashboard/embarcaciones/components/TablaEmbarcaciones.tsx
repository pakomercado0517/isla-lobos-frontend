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
import { Edit, Trash2 } from "lucide-react";
import { getEstadoIcon, getEstadoColor, getTipoColor } from "./utils";

interface Embarcacion {
  id: string;
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador_id: string;
  prestador?: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TablaEmbarcacionesProps {
  embarcaciones: Embarcacion[];
  onEdit: (embarcacion: Embarcacion) => void;
  onDelete: (embarcacionId: string) => void;
}

export function TablaEmbarcaciones({
  embarcaciones,
  onEdit,
  onDelete,
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
                    {embarcacion.estado.replace("_", " ")}
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

              {/* Prestador */}
              <div className="space-y-1 pt-2 border-t">
                <p className="text-[10px] text-slate-500">Prestador</p>
                <p className="text-xs font-medium truncate">
                  {embarcacion.prestador?.nombre || "No asignado"}
                </p>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(embarcacion)}
                  className="flex-1 h-8 text-xs"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(embarcacion.id)}
                  className="flex-1 h-8 text-xs text-red-600"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Eliminar
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
                <TableHead>Prestador</TableHead>
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
                    {embarcacion.prestador?.nombre || "No asignado"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getEstadoIcon(embarcacion.estado)}
                      <Badge className={getEstadoColor(embarcacion.estado)}>
                        {embarcacion.estado.replace("_", " ")}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(embarcacion)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(embarcacion.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
