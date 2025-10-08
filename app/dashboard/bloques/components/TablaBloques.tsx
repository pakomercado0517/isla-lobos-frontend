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
import { Clock, Edit, Trash2 } from "lucide-react";
import { getEstadoIcon, getEstadoColor, getOcupacionColor } from "./utils";

interface Bloque {
  id: string;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  capacidad_registrada: number;
  fecha: string;
  estado: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
  createdAt: string;
  updatedAt: string;
}

interface TablaBloquesProps {
  bloques: Bloque[];
  fechaSeleccionada: string;
  onEdit: (bloque: Bloque) => void;
  onDelete: (bloqueId: string) => void;
}

export function TablaBloques({
  bloques,
  fechaSeleccionada,
  onEdit,
  onDelete,
}: TablaBloquesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Bloques para {new Date(fechaSeleccionada).toLocaleDateString()}
        </CardTitle>
        <CardDescription>
          {bloques.length} bloque{bloques.length !== 1 ? "s" : ""} encontrado
          {bloques.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Horario</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Ocupación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bloques.map((bloque) => (
              <TableRow key={bloque.id}>
                <TableCell className="font-medium">{bloque.nombre}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {bloque.hora_inicio} - {bloque.hora_fin}
                  </div>
                </TableCell>
                <TableCell>{bloque.capacidad_total} personas</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span
                        className={getOcupacionColor(
                          bloque.capacidad_registrada,
                          bloque.capacidad_total
                        )}
                      >
                        {bloque.capacidad_registrada} / {bloque.capacidad_total}
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round(
                          (bloque.capacidad_registrada /
                            bloque.capacidad_total) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (bloque.capacidad_registrada /
                            bloque.capacidad_total) *
                            100 >=
                          100
                            ? "bg-red-500"
                            : (bloque.capacidad_registrada /
                                bloque.capacidad_total) *
                                100 >=
                              80
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            (bloque.capacidad_registrada /
                              bloque.capacidad_total) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getEstadoIcon(bloque.estado)}
                    <Badge className={getEstadoColor(bloque.estado)}>
                      {bloque.estado.replace("_", " ")}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(bloque)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(bloque.id)}
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
