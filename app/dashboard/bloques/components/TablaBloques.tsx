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
import { Clock, Edit, Trash2, MapPin, FileText } from "lucide-react";
import { getEstadoIcon, getEstadoColor, getOcupacionColor } from "./utils";
import { type Bloque } from "@/lib/types/bloques";
import { type DestinoType } from "@/lib/types/salida";
import { formatearFechaCompacta } from "@/lib/utils";
import DialogConfirmarBorrarBloque from "./DialogConfirmarBorrarBloque";

interface TablaBloquesProps {
  bloques: Bloque[];
  fechaSeleccionada: string;
  destinoSeleccionado: DestinoType | "todos";
  onEdit: (bloque: Bloque) => void;
  onDelete: (bloqueId: string) => void;
  activeAlert: boolean;
  setActiveAlert: (active: boolean) => void;
}

export function TablaBloques({
  bloques,
  fechaSeleccionada,
  destinoSeleccionado,
  onEdit,
  onDelete,
  activeAlert,
  setActiveAlert,
}: TablaBloquesProps) {
  return (
    <Card>
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Clock className="w-4 h-4 md:w-5 md:h-5" />
          Bloques{" "}
          {destinoSeleccionado !== "todos" ? `- ${destinoSeleccionado}` : ""}
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {destinoSeleccionado === "todos"
            ? `${bloques.length} bloque${
                bloques.length !== 1 ? "s" : ""
              } total${
                bloques.length !== 1 ? "es" : ""
              } para ${formatearFechaCompacta(fechaSeleccionada)}`
            : `${bloques.length} bloque${
                bloques.length !== 1 ? "s" : ""
              } para ${destinoSeleccionado} el ${formatearFechaCompacta(
                fechaSeleccionada
              )}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 md:p-6">
        {/* Vista móvil: Cards */}
        <div className="md:hidden space-y-3 px-4 pb-4">
          {bloques.map((bloque) => (
            <Card key={bloque.id} className="shadow-sm">
              <CardContent className="p-3">
                {/* Header del card */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      {bloque.es_plantilla && (
                        <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      )}
                      <h3 className="font-medium text-sm">{bloque.nombre}</h3>
                    </div>
                    {bloque.es_plantilla && (
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 bg-blue-50 border-blue-200 text-blue-700"
                      >
                        📋 Plantilla
                      </Badge>
                    )}
                  </div>
                  <Badge
                    className={`${getEstadoColor(
                      bloque.estado
                    )} text-[10px] h-5`}
                  >
                    {bloque.estado.replace("_", " ")}
                  </Badge>
                </div>

                {/* Destino */}
                {destinoSeleccionado === "todos" && (
                  <div className="flex items-center gap-1 mb-2 text-xs text-slate-600">
                    <MapPin className="w-3 h-3" />
                    <span>{bloque.destino}</span>
                  </div>
                )}

                {/* Horario */}
                <div className="flex items-center gap-1.5 mb-2 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-medium">
                    {bloque.hora_inicio} - {bloque.hora_fin}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-600">
                    {bloque.capacidad_total || 0} personas
                  </span>
                </div>

                {/* Ocupación */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span
                      className={getOcupacionColor(
                        bloque.capacidad_registrada,
                        bloque.capacidad_total || 0
                      )}
                    >
                      {bloque.capacidad_registrada} /{" "}
                      {bloque.capacidad_total || 0}
                    </span>
                    <span className="text-muted-foreground">
                      {Math.round(
                        (bloque.capacidad_registrada /
                          (bloque.capacidad_total || 1)) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        (bloque.capacidad_registrada /
                          (bloque.capacidad_total || 1)) *
                          100 >=
                        100
                          ? "bg-red-500"
                          : (bloque.capacidad_registrada /
                              (bloque.capacidad_total || 1)) *
                              100 >=
                            80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (bloque.capacidad_registrada /
                            (bloque.capacidad_total || 1)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(bloque)}
                    className="flex-1 h-8 text-xs"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveAlert(true)}
                    className="flex-1 h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Eliminar
                  </Button>
                  <DialogConfirmarBorrarBloque
                    activeAlert={activeAlert}
                    setActiveAlert={setActiveAlert}
                    onDelete={() => onDelete(bloque.id)}
                  />
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
                <TableHead>Bloque</TableHead>
                {destinoSeleccionado === "todos" && (
                  <TableHead>Destino</TableHead>
                )}
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
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {bloque.es_plantilla && (
                        <FileText className="w-4 h-4 text-blue-500" />
                      )}
                      <span>{bloque.nombre}</span>
                      {bloque.es_plantilla && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 border-blue-200 text-blue-700"
                        >
                          📋 Plantilla
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  {destinoSeleccionado === "todos" && (
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span className="text-sm">{bloque.destino}</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {bloque.hora_inicio} - {bloque.hora_fin}
                    </div>
                  </TableCell>
                  <TableCell>{bloque.capacidad_total || 0} personas</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span
                          className={getOcupacionColor(
                            bloque.capacidad_registrada,
                            bloque.capacidad_total || 0
                          )}
                        >
                          {bloque.capacidad_registrada} /{" "}
                          {bloque.capacidad_total || 0}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(
                            (bloque.capacidad_registrada /
                              (bloque.capacidad_total || 1)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (bloque.capacidad_registrada /
                              (bloque.capacidad_total || 1)) *
                              100 >=
                            100
                              ? "bg-red-500"
                              : (bloque.capacidad_registrada /
                                  (bloque.capacidad_total || 1)) *
                                  100 >=
                                80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              (bloque.capacidad_registrada /
                                (bloque.capacidad_total || 1)) *
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
                        onClick={() => setActiveAlert(true)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <DialogConfirmarBorrarBloque
                        activeAlert={activeAlert}
                        setActiveAlert={setActiveAlert}
                        onDelete={() => onDelete(bloque.id)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
