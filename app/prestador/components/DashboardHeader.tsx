"use client";

import { Ship, Calendar, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  nombreUsuario: string;
}

export function DashboardHeader({ nombreUsuario }: DashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-[var(--isla-teal)] text-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              ¡Bienvenido, {nombreUsuario}!
            </h1>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">
              Panel de control para prestadores de servicios
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30 text-xs sm:text-sm"
            >
              <Ship className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Prestador
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Ship className="w-5 h-5 text-blue-100" />
              <div className="text-lg sm:text-xl font-bold">Mis Embarcaciones</div>
            </div>
            <div className="text-blue-100 text-sm sm:text-base">Control de flota</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-100" />
              <div className="text-lg sm:text-xl font-bold">Salidas</div>
            </div>
            <div className="text-blue-100 text-sm sm:text-base">Programación</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-100" />
              <div className="text-lg sm:text-xl font-bold">Turistas</div>
            </div>
            <div className="text-blue-100 text-sm sm:text-base">Experiencias</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-100" />
              <div className="text-lg sm:text-xl font-bold">Progreso</div>
            </div>
            <div className="text-blue-100 text-sm sm:text-base">Estadísticas</div>
          </div>
        </div>
      </div>
    </div>
  );
}