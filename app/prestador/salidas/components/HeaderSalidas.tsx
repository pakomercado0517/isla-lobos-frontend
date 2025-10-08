"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus } from "lucide-react";
import Link from "next/link";

interface HeaderSalidasProps {
  totalSalidas: number;
  loading: boolean;
  onActualizar: () => void;
}

export function HeaderSalidas({
  totalSalidas,
  loading,
  onActualizar,
}: HeaderSalidasProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)]">
          Mis Salidas
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus salidas turísticas y registra el uso de brazaletes
        </p>
      </div>
      <div className="flex items-center gap-3">
        {totalSalidas > 0 && (
          <Badge variant="secondary" className="text-sm">
            {totalSalidas} salidas
          </Badge>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onActualizar}
          disabled={loading}
          className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
        <Button
          className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
          asChild
        >
          <Link href="/prestador/nueva-salida">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Salida
          </Link>
        </Button>
      </div>
    </div>
  );
}
