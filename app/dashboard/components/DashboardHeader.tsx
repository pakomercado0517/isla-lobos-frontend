"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Shield } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  lastUpdate: Date;
  onRefresh: () => void;
}

export function DashboardHeader({
  userName,
  lastUpdate,
  onRefresh,
}: DashboardHeaderProps) {
  const fechaActual = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatearUltimaActualizacion = (fecha: Date): string => {
    const ahora = new Date();
    const diff = ahora.getTime() - fecha.getTime();
    const minutos = Math.floor(diff / 60000);

    if (minutos < 1) return "Hace un momento";
    if (minutos === 1) return "Hace 1 minuto";
    if (minutos < 60) return `Hace ${minutos} minutos`;
    
    const horas = Math.floor(minutos / 60);
    if (horas === 1) return "Hace 1 hora";
    if (horas < 24) return `Hace ${horas} horas`;
    
    return fecha.toLocaleString("es-MX", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Banner superior minimalista */}
      <div className="bg-gradient-to-r from-[var(--isla-dark-teal)] to-[var(--isla-teal)] h-2 lg:h-3" />
      
      <div className="p-4 sm:p-6 lg:p-10 xl:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-8">
          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2 lg:mb-3 leading-tight">
              Bienvenido, {userName}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 font-medium capitalize mb-3 lg:mb-4">
              {fechaActual}
            </p>
          </div>
          
          {/* Badge destacado para desktop */}
          <div className="flex items-center gap-3 lg:flex-col lg:items-end shrink-0">
            <Badge 
              variant="secondary" 
              className="bg-[var(--isla-dark-teal)]/10 text-[var(--isla-dark-teal)] border-[var(--isla-dark-teal)]/20 hover:bg-[var(--isla-dark-teal)]/20 transition-colors h-fit px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
              <span className="text-sm sm:text-base lg:text-lg font-semibold">CONANP</span>
            </Badge>
          </div>
        </div>

        {/* Información adicional */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 lg:pt-6 border-t border-gray-100 mt-4 lg:mt-6">
          <p className="text-xs sm:text-sm lg:text-base text-gray-500">
            Última actualización:{" "}
            <span className="font-medium text-gray-700">
              {formatearUltimaActualizacion(lastUpdate)}
            </span>
          </p>
          <Button 
            onClick={onRefresh} 
            variant="outline"
            size="sm"
            className="w-full sm:w-auto border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-sm lg:text-base px-4 lg:px-6 h-9 lg:h-10"
          >
            <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>
    </div>
  );
}

