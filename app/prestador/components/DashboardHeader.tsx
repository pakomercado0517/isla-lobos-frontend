"use client";

import { Ship, Calendar, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  nombreUsuario: string;
}

export function DashboardHeader({ nombreUsuario }: DashboardHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-[var(--isla-teal)] text-white rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 leading-tight">
              ¡Bienvenido, {nombreUsuario}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm md:text-base lg:text-lg">
              Panel de control para prestadores de servicios
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-1"
            >
              <Ship className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Prestador
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 md:mt-8">
          <div className="bg-white/10 rounded-lg p-2.5 sm:p-3 md:p-4 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Ship className="w-4 h-4 sm:w-5 sm:h-5 text-blue-100 flex-shrink-0" />
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">Embarcaciones</div>
            </div>
            <div className="text-blue-100 text-xs sm:text-sm">Control de flota</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 sm:p-3 md:p-4 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-100 flex-shrink-0" />
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">Salidas</div>
            </div>
            <div className="text-blue-100 text-xs sm:text-sm">Programación</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 sm:p-3 md:p-4 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-100 flex-shrink-0" />
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">Turistas</div>
            </div>
            <div className="text-blue-100 text-xs sm:text-sm">Experiencias</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 sm:p-3 md:p-4 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-100 flex-shrink-0" />
              <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold leading-tight">Progreso</div>
            </div>
            <div className="text-blue-100 text-xs sm:text-sm">Estadísticas</div>
          </div>
        </div>
      </div>
    </div>
  );
}