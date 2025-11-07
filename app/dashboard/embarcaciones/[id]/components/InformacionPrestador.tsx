"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Phone } from "lucide-react";

interface Prestador {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
}

interface InformacionPrestadorProps {
  prestador: Prestador | null;
}

export function InformacionPrestador({
  prestador,
}: InformacionPrestadorProps) {
  if (!prestador) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <User className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-teal-600" />
            Prestador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-slate-500 text-sm sm:text-base">
            No hay información del prestador disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <User className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-teal-600" />
          Prestador de Servicios
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Información del propietario de la embarcación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nombre */}
        <div>
          <div className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">
            Nombre
          </div>
          <div className="text-base sm:text-lg font-semibold text-slate-900">
            {prestador.nombre}
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mb-1 font-medium">
            <Mail className="w-4 h-4 flex-shrink-0" />
            Email
          </div>
          <div className="text-sm sm:text-base text-slate-700 break-all">
            {prestador.email}
          </div>
        </div>

        {/* Teléfono */}
        {prestador.telefono && (
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mb-1 font-medium">
              <Phone className="w-4 h-4 flex-shrink-0" />
              Teléfono
            </div>
            <div className="text-sm sm:text-base text-slate-700">
              {prestador.telefono}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

