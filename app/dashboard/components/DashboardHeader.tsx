"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Bienvenido, {userName}
        </h2>
        <p className="text-slate-600">
          Última actualización: {lastUpdate.toLocaleString()}
        </p>
      </div>
      <Button onClick={onRefresh} variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Actualizar
      </Button>
    </div>
  );
}

