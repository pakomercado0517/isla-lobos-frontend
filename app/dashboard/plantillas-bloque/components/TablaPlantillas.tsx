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
import { Edit, Trash2, Clock, MapPin, FileText } from "lucide-react";
import { type PlantillaBloque } from "@/lib/types/bloques";
import { formatearFechaRegional } from "@/lib/utils";

interface TablaPlantillasProps {
  plantillas: PlantillaBloque[];
  destinoSeleccionado: string | "todos";
  onEdit: (plantilla: PlantillaBloque) => void;
  onDelete: (plantillaId: number) => void;
  onViewStats: (plantillaId: number) => void;
  loading: boolean;
}

export function TablaPlantillas({
  plantillas,
  destinoSeleccionado,
  onEdit,
  onDelete,
  loading,
}: TablaPlantillasProps) {
  return (
    <Card>
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <FileText className="w-4 h-4 md:w-5 md:h-5" />
          Plantillas{" "}
          {destinoSeleccionado !== "todos" ? `- ${destinoSeleccionado}` : ""}
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {plantillas.length === 0
            ? "No hay plantillas disponibles"
            : `${plantillas.length} plantilla${
                plantillas.length !== 1 ? "s" : ""
              } total${plantillas.length !== 1 ? "es" : ""}${
                destinoSeleccionado !== "todos"
                  ? ` para ${destinoSeleccionado}`
                  : ""
              }`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 md:p-6">
        {plantillas.length === 0 ? (
          <div className="p-8 md:p-12 text-center">
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
              No hay plantillas disponibles
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Crea tu primera plantilla para comenzar a gestionar bloques de
              manera eficiente.
            </p>
          </div>
        ) : (
          <>
            {/* Vista móvil: Cards */}
            <div className="md:hidden space-y-3 px-4 pb-4">
              {plantillas.map((plantilla) => (
                <Card key={plantilla.id} className="shadow-sm">
                  <CardContent className="p-3">
                    {/* Header del card */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                          <h3 className="font-medium text-sm">
                            {plantilla.nombre}
                          </h3>
                        </div>
                      </div>
                      <Badge
                        variant={plantilla.activa ? "default" : "secondary"}
                        className={`${
                          plantilla.activa
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        } text-[10px] h-5`}
                      >
                        {plantilla.activa ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>

                    {/* Destino */}
                    <div className="flex items-center gap-1 mb-2 text-xs text-slate-600">
                      <MapPin className="w-3 h-3" />
                      <span>{plantilla.destino}</span>
                    </div>

                    {/* Horario */}
                    <div className="flex items-center gap-1.5 mb-2 text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-medium">
                        {plantilla.hora_inicio} - {plantilla.hora_fin}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-600">
                        {plantilla.capacidad_total} personas
                      </span>
                    </div>

                    {/* Info adicional */}
                    {/* <div className="mb-3 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>
                          {plantilla.bloques_asociados || 0} bloques asociados
                        </span>
                        <span>
                          {plantilla.updated_at
                            ? formatearFechaRegional(
                                typeof plantilla.updated_at === "string"
                                  ? plantilla.updated_at.split("T")[0]
                                  : plantilla.updated_at
                                      .toISOString()
                                      .split("T")[0]
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </div> */}

                    {/* Acciones */}
                    <div className="flex gap-2">
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewStats(plantilla.id)}
                        className="flex-1 h-8 text-xs"
                      >
                        <BarChart3 className="w-3.5 h-3.5 mr-1" />
                        Stats
                      </Button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(plantilla)}
                        className="flex-1 h-8 text-xs"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(plantilla.id)}
                        className="flex-1 h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={loading}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Eliminar
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
                    <TableHead>Plantilla</TableHead>
                    {destinoSeleccionado === "todos" && (
                      <TableHead>Destino</TableHead>
                    )}
                    <TableHead>Horario</TableHead>
                    <TableHead>Capacidad</TableHead>
                    {/* <TableHead>Bloques Asociados</TableHead> */}
                    <TableHead>Estado</TableHead>
                    <TableHead>Última Actualización</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plantillas.map((plantilla) => (
                    <TableRow key={plantilla.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-500" />
                          <span>{plantilla.nombre}</span>
                        </div>
                      </TableCell>
                      {destinoSeleccionado === "todos" && (
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span className="text-sm">{plantilla.destino}</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {plantilla.hora_inicio} - {plantilla.hora_fin}
                        </div>
                      </TableCell>
                      <TableCell>
                        {plantilla.capacidad_total} personas
                      </TableCell>
                      {/* <TableCell>
                        <span className="text-sm">
                          {plantilla.bloques_asociados || 0} bloques
                        </span>
                      </TableCell> */}
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
                        <span className="text-sm text-slate-600">
                          {plantilla.updated_at
                            ? formatearFechaRegional(
                                typeof plantilla.updated_at === "string"
                                  ? plantilla.updated_at.split("T")[0]
                                  : plantilla.updated_at
                                      .toISOString()
                                      .split("T")[0]
                              )
                            : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewStats(plantilla.id)}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button> */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(plantilla)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(plantilla.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
