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
import { Edit, Trash2, BarChart3 } from "lucide-react";
import { type PlantillaBloque } from "@/lib/types/bloques";
import { formatearFechaRegional } from "@/lib/utils";

interface TablaPlantillasProps {
  plantillas: PlantillaBloque[];
  onEdit: (plantilla: PlantillaBloque) => void;
  onDelete: (plantillaId: number) => void;
  onViewStats: (plantillaId: number) => void;
  loading: boolean;
}

export function TablaPlantillas({
  plantillas,
  onEdit,
  onDelete,
  onViewStats,
  loading,
}: TablaPlantillasProps) {
  if (plantillas.length === 0) {
    return (
      <div className="bg-white rounded-lg border">
        <div className="p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay plantillas disponibles
          </h3>
          <p className="text-gray-600">
            Crea tu primera plantilla para comenzar a gestionar bloques de manera eficiente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Horario</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Bloques Asociados</TableHead>
            <TableHead>Última Actualización</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plantillas.map((plantilla) => (
            <TableRow key={plantilla.id}>
              <TableCell className="font-medium">
                {plantilla.nombre}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {plantilla.destino}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {plantilla.hora_inicio} - {plantilla.hora_fin}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-medium">
                  {plantilla.capacidad_total} personas
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={plantilla.activa ? "default" : "secondary"}
                  className={
                    plantilla.activa
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {plantilla.activa ? "✅ Activa" : "❌ Inactiva"}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {plantilla.bloques_asociados || 0} bloques
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {plantilla.updated_at
                    ? formatearFechaRegional(
                        typeof plantilla.updated_at === "string"
                          ? plantilla.updated_at.split("T")[0]
                          : plantilla.updated_at.toISOString().split("T")[0]
                      )
                    : "N/A"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewStats(plantilla.id)}
                    className="h-8 w-8 p-0"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(plantilla)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(plantilla.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}