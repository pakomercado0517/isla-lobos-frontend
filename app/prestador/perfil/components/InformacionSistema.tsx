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
    <Card className="mt-4 md:mt-6">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base md:text-lg">
          Información del Sistema
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Detalles adicionales de tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
          <div>
            <span className="text-gray-600 text-[10px] md:text-xs">Rol:</span>
            <p className="font-medium capitalize text-xs md:text-sm">
              {profile.rol}
            </p>
          </div>
          <div>
            <span className="text-gray-600 text-[10px] md:text-xs">
              Estado:
            </span>
            <p className="font-medium text-xs md:text-sm">
              {profile.activo ? "Activo" : "Inactivo"}
            </p>
          </div>
          {profile.fechaVencimientoPermiso && (
            <div>
              <span className="text-gray-600 text-[10px] md:text-xs">
                Permiso vence:
              </span>
              <p className="font-medium text-xs md:text-sm">
                {new Date(profile.fechaVencimientoPermiso).toLocaleDateString()}
              </p>
            </div>
          )}
          {profile.estadoPermiso && (
            <div>
              <span className="text-gray-600 text-[10px] md:text-xs">
                Estado del permiso:
              </span>
              <p className="font-medium capitalize text-xs md:text-sm">
                {profile.estadoPermiso.replace("_", " ")}
              </p>
            </div>
          )}
          <div>
            <span className="text-gray-600 text-[10px] md:text-xs">
              Miembro desde:
            </span>
            <p className="font-medium text-xs md:text-sm">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-gray-600 text-[10px] md:text-xs">
              Última actualización:
            </span>
            <p className="font-medium text-xs md:text-sm">
              {new Date(profile.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
