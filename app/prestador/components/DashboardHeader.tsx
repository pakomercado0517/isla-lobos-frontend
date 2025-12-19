"use client";

import { Ship } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  nombreUsuario: string;
}

export function DashboardHeader({ nombreUsuario }: DashboardHeaderProps) {
  const fechaActual = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Banner superior minimalista */}
      <div className="bg-gradient-to-r from-[var(--isla-dark-teal)] to-[var(--isla-teal)] h-2 lg:h-3" />
      
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 lg:gap-8">
          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2 lg:mb-3 leading-tight">
              Bienvenido, {nombreUsuario}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 font-medium capitalize mb-3 lg:mb-4">
              {fechaActual}
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-gray-500 leading-relaxed max-w-2xl lg:max-w-3xl">
              Panel de control para gestionar tus embarcaciones y salidas de manera eficiente
            </p>
          </div>
          
          {/* Badge destacado para desktop */}
          <div className="flex items-center gap-3 lg:flex-col lg:items-end shrink-0">
            <Badge 
              variant="secondary" 
              className="bg-[var(--isla-teal)]/10 text-[var(--isla-teal)] border-[var(--isla-teal)]/20 hover:bg-[var(--isla-teal)]/20 transition-colors h-fit px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5"
            >
              <Ship className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2" />
              <span className="text-sm sm:text-base lg:text-lg font-semibold">Prestador</span>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}