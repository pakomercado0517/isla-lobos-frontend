import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Trash2, CheckCircle, XCircle, Clock, Mail } from "lucide-react";
import { Invitacion } from "@/lib/types/invitaciones";
import {
  getEstadoBadgeClass,
  getEstadoTexto,
  formatearFechaExpiracion,
  estaExpirada,
  generarUrlRegistro,
  copiarAlPortapapeles,
} from "./utils";

interface TablaInvitacionesProps {
  invitaciones: Invitacion[];
  onDelete: (id: string) => void;
  onCopyUrl: (codigo: string) => void;
}

export function TablaInvitaciones({
  invitaciones,
  onDelete,
  onCopyUrl,
}: TablaInvitacionesProps) {
  const handleCopyUrl = async (codigo: string) => {
    const url = generarUrlRegistro(codigo);
    const exito = await copiarAlPortapapeles(url);
    if (exito) {
      onCopyUrl(codigo);
    }
  };

  if (invitaciones.length === 0) {
    return (
      <div className="text-center py-10 md:py-12 bg-white rounded-lg shadow">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
          <Mail className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
          No hay invitaciones
        </h3>
        <p className="text-xs md:text-sm text-gray-500">
          Crea tu primera invitación para empezar
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vista de Cards para Móvil */}
      <div className="md:hidden space-y-3">
        {invitaciones.map((invitacion) => {
          const expirada = estaExpirada(invitacion.expira_en);
          const estadoClass = getEstadoBadgeClass(invitacion.usada, expirada);
          const estadoTexto = getEstadoTexto(invitacion.usada, expirada);

          return (
            <Card key={invitacion.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-mono text-[var(--isla-teal)] break-all">
                      {invitacion.codigo}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1 break-all">
                      {invitacion.email || (
                        <span className="text-gray-400 italic">Sin email</span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      invitacion.rol === "conanp"
                        ? "border-purple-300 text-purple-700"
                        : "border-blue-300 text-blue-700"
                    } text-[10px] flex-shrink-0`}
                  >
                    {invitacion.rol === "conanp" ? "CONANP" : "Prestador"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Estado y Expiración */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500">Estado</p>
                    <Badge
                      variant="outline"
                      className={`${estadoClass} text-[10px] w-fit`}
                    >
                      {invitacion.usada && (
                        <CheckCircle className="w-2 h-2 mr-1" />
                      )}
                      {expirada && !invitacion.usada && (
                        <XCircle className="w-2 h-2 mr-1" />
                      )}
                      {!invitacion.usada && !expirada && (
                        <Clock className="w-2 h-2 mr-1" />
                      )}
                      {estadoTexto}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500">Expira</p>
                    <p className="text-xs font-medium">
                      {formatearFechaExpiracion(invitacion.expira_en)}
                    </p>
                  </div>
                </div>

                {/* Creador */}
                <div className="space-y-1 pt-2 border-t">
                  <p className="text-[10px] text-slate-500">Creada por</p>
                  <p className="text-xs font-medium truncate">
                    {invitacion.creador?.nombre || "Desconocido"}
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    onClick={() => handleCopyUrl(invitacion.codigo)}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs text-[var(--isla-teal)] hover:bg-[var(--isla-teal)]/10"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar URL
                  </Button>
                  {!invitacion.usada && (
                    <Button
                      onClick={() => onDelete(invitacion.id)}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs text-red-600 hover:bg-red-50"
                      title="Eliminar invitación"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Vista de Tabla para Desktop */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Expira</TableHead>
              <TableHead>Creada por</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitaciones.map((invitacion) => {
              const expirada = estaExpirada(invitacion.expira_en);
              const estadoClass = getEstadoBadgeClass(
                invitacion.usada,
                expirada
              );
              const estadoTexto = getEstadoTexto(invitacion.usada, expirada);

              return (
                <TableRow key={invitacion.id}>
                  <TableCell className="font-mono font-semibold text-[var(--isla-teal)]">
                    {invitacion.codigo}
                  </TableCell>
                  <TableCell>
                    {invitacion.email || (
                      <span className="text-gray-400 italic">Sin email</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        invitacion.rol === "conanp"
                          ? "border-purple-300 text-purple-700"
                          : "border-blue-300 text-blue-700"
                      }
                    >
                      {invitacion.rol === "conanp" ? "CONANP" : "Prestador"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={estadoClass}>
                      {invitacion.usada && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {expirada && !invitacion.usada && (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {!invitacion.usada && !expirada && (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {estadoTexto}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatearFechaExpiracion(invitacion.expira_en)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {invitacion.creador?.nombre || "Desconocido"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleCopyUrl(invitacion.codigo)}
                        variant="outline"
                        size="sm"
                        className="text-[var(--isla-teal)] hover:bg-[var(--isla-teal)]/10"
                        title="Copiar URL de registro"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      {!invitacion.usada && (
                        <Button
                          onClick={() => onDelete(invitacion.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          title="Eliminar invitación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
