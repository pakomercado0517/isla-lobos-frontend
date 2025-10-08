"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: "conanp" | "prestador";
  activo: boolean;
  avatar?: string;
  fechaVencimientoPermiso?: string;
  estadoPermiso?: string;
  diasNotificacion?: number;
  createdAt: string;
  updatedAt: string;
}

interface InformacionSistemaProps {
  profile: UserProfile | null;
}

export function InformacionSistema({ profile }: InformacionSistemaProps) {
  if (!profile) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Información del Sistema</CardTitle>
        <CardDescription>Detalles adicionales de tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Rol:</span>
            <p className="font-medium capitalize">{profile.rol}</p>
          </div>
          <div>
            <span className="text-gray-600">Estado:</span>
            <p className="font-medium">
              {profile.activo ? "Activo" : "Inactivo"}
            </p>
          </div>
          {profile.fechaVencimientoPermiso && (
            <div>
              <span className="text-gray-600">Permiso vence:</span>
              <p className="font-medium">
                {new Date(profile.fechaVencimientoPermiso).toLocaleDateString()}
              </p>
            </div>
          )}
          {profile.estadoPermiso && (
            <div>
              <span className="text-gray-600">Estado del permiso:</span>
              <p className="font-medium capitalize">
                {profile.estadoPermiso.replace("_", " ")}
              </p>
            </div>
          )}
          <div>
            <span className="text-gray-600">Miembro desde:</span>
            <p className="font-medium">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Última actualización:</span>
            <p className="font-medium">
              {new Date(profile.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
