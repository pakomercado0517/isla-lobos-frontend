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
    <Card>
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
  );
}

