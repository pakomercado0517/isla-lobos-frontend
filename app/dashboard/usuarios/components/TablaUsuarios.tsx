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
import { Badge } from "@/components/ui/badge";
import { Edit, UserCheck, UserX, Users, Trash2 } from "lucide-react";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: "conanp" | "prestador";
  activo: boolean;
  fechaVencimientoPermiso: string | null;
  estadoPermiso: "vigente" | "por_vencer" | "vencido" | "suspendido";
  createdAt: string;
  updatedAt: string;
}

interface TablaUsuariosProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuarioId: string) => void;
  onActivate: (usuarioId: string) => void;
  onDeletePermanent?: (usuario: Usuario) => void;
  currentUserRol?: "conanp" | "prestador";
}

export function TablaUsuarios({
  usuarios,
  onEdit,
  onDelete,
  onActivate,
  onDeletePermanent,
  currentUserRol,
}: TablaUsuariosProps) {
  const getRolBadgeColor = (rol: string) => {
    return rol === "conanp"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getEstadoBadgeColor = (activo: boolean) => {
    return activo
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Usuarios</CardTitle>
        <CardDescription>
          {usuarios.length} usuarios registrados en el sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">
                    {usuario.nombre}
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.telefono || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${getRolBadgeColor(usuario.rol)} text-xs`}
                    >
                      {usuario.rol.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getEstadoBadgeColor(
                        usuario.activo
                      )} text-xs`}
                    >
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(usuario.createdAt).toLocaleDateString("es-MX")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(usuario)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {usuario.activo ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(usuario.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <UserX className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onActivate(usuario.id)}
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                      )}
                      {/* Botón de eliminar permanente - solo para CONANP y usuarios inactivos */}
                      {currentUserRol === "conanp" &&
                        !usuario.activo &&
                        onDeletePermanent && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeletePermanent(usuario)}
                            className="border-red-500 text-red-700 hover:bg-red-100"
                            title="Eliminar permanentemente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {usuarios.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay usuarios registrados
              </h3>
              <p className="text-gray-500 mb-4">
                Crea el primer usuario para comenzar
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
