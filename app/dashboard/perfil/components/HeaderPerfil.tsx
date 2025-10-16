"use client";

import { Shield, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HeaderPerfil() {
  return (
    <div className="bg-gradient-to-r from-[var(--isla-teal)] to-blue-600 text-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Perfil CONANP</h1>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">
              Panel de administración y configuración personal
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge 
              variant="secondary" 
              className="bg-white/20 text-white border-white/30 text-xs sm:text-sm"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Administrador
            </Badge>
            <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-blue-100" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">Sistema</div>
            <div className="text-blue-100 text-sm sm:text-base">Gestión completa</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">Usuarios</div>
            <div className="text-blue-100 text-sm sm:text-base">Control total</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold">Reportes</div>
            <div className="text-blue-100 text-sm sm:text-base">Analytics avanzado</div>
          </div>
        </div>
      </div>
    </div>
  );
}