"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import Link from "next/link";

interface UsoBrazaletesHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function UsoBrazaletesHeader({
  loading,
  onRefresh,
}: UsoBrazaletesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
      <div className="text-center md:text-left">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--isla-dark-teal)]">
          Historial de Uso de Brazaletes
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-2">
          Consulta el historial de brazaletes utilizados en tus salidas
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center md:justify-end gap-2 sm:gap-3">
        <Button
          variant="default"
          size="sm"
          asChild
          className="bg-[var(--isla-teal)] hover:bg-[var(--isla-dark-teal)] text-white whitespace-nowrap text-xs sm:text-sm"
        >
          <Link href="/prestador/salidas">
            <Plus className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Registrar en Salidas</span>
            <span className="sm:hidden">Registrar</span>
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white whitespace-nowrap text-xs sm:text-sm"
        >
          <RefreshCw
            className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Actualizar</span>
          <span className="sm:hidden">Refrescar</span>
        </Button>
      </div>
    </div>
  );
}
