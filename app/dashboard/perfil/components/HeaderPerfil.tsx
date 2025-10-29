"use client";

import { Shield, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HeaderPerfil() {
  return (
    <div className="bg-gradient-to-r from-[var(--isla-teal)] to-blue-600 text-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 truncate">
              Perfil CONANP
            </h1>
            <p className="text-blue-100 text-xs md:text-base">
              Panel de administración y configuración
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 text-[10px] md:text-sm"
            >
              <Shield className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Admin
            </Badge>
            <Settings className="w-5 h-5 md:w-7 md:h-7 text-blue-100 flex-shrink-0" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
          <div className="bg-white/10 rounded-lg p-2 md:p-3 backdrop-blur-sm">
            <div className="text-base md:text-xl font-bold truncate">
              Sistema
            </div>
            <div className="text-blue-100 text-[10px] md:text-sm truncate">
              Gestión completa
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 md:p-3 backdrop-blur-sm">
            <div className="text-base md:text-xl font-bold truncate">
              Usuarios
            </div>
            <div className="text-blue-100 text-[10px] md:text-sm truncate">
              Control total
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 md:p-3 backdrop-blur-sm">
            <div className="text-base md:text-xl font-bold truncate">
              Reportes
            </div>
            <div className="text-blue-100 text-[10px] md:text-sm truncate">
              Analytics
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
