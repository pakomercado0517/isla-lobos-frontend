"use client";

import { RefreshCw } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-4" />
        <p className="text-slate-600">Cargando información de la embarcación...</p>
      </div>
    </div>
  );
}

