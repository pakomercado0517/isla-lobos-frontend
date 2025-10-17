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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Bloques{" "}
          {destinoSeleccionado !== "todos" ? `- ${destinoSeleccionado}` : ""}
        </CardTitle>
        <CardDescription>
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
      <CardContent>
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
                      <Badge variant="outline" className="text-xs bg-blue-50">
                        Plantilla
                      </Badge>
                    )}
                  </div>
                </TableCell>
                {/* Columna de Destino - Solo mostrar si se están viendo todos los destinos */}
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
      </CardContent>
    </Card>
  );
}
