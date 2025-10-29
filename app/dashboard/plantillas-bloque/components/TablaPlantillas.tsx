import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, BarChart3, Clock, MapPin } from "lucide-react";
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
        <div className="p-8 md:p-12 text-center">
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            No hay plantillas disponibles
          </h3>
          <p className="text-xs md:text-sm text-gray-600">
            Crea tu primera plantilla para comenzar a gestionar bloques de
            manera eficiente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      {/* Vista móvil: Cards */}
      <div className="md:hidden space-y-3 p-3">
        {plantillas.map((plantilla) => (
          <Card key={plantilla.id} className="shadow-sm">
            <CardContent className="p-3">
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">
                    {plantilla.nombre}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <Badge variant="secondary" className="text-[10px] h-5">
                      {plantilla.destino}
                    </Badge>
                  </div>
                </div>
                <Badge
                  variant={plantilla.activa ? "default" : "secondary"}
                  className={`${
                    plantilla.activa
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  } text-[10px] h-5 flex-shrink-0 ml-2`}
                >
                  {plantilla.activa ? "✅ Activa" : "❌ Inactiva"}
                </Badge>
              </div>

              {/* Info */}
              <div className="space-y-1.5 mb-3 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    {plantilla.hora_inicio} - {plantilla.hora_fin}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span>{plantilla.capacidad_total} personas</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    {plantilla.bloques_asociados || 0} bloques asociados
                  </span>
                  <span className="text-slate-500">
                    {plantilla.updated_at
                      ? formatearFechaRegional(
                          typeof plantilla.updated_at === "string"
                            ? plantilla.updated_at.split("T")[0]
                            : plantilla.updated_at.toISOString().split("T")[0]
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Acciones */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewStats(plantilla.id)}
                  className="h-8 text-xs"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1" />
                  Stats
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(plantilla)}
                  className="h-8 text-xs"
                >
                  <Edit className="h-3.5 w-3.5 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(plantilla.id)}
                  className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={loading}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Borrar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vista desktop: Tabla */}
      <div className="hidden md:block overflow-x-auto">
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
                  <Badge variant="secondary">{plantilla.destino}</Badge>
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
    </div>
  );
}
