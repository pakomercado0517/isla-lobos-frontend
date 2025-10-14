import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay invitaciones
        </h3>
        <p className="text-gray-500">Crea tu primera invitación para empezar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
            const estadoClass = getEstadoBadgeClass(invitacion.usada, expirada);
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
  );
}
