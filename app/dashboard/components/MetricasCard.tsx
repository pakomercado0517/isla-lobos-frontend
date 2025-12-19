"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricaCardProps {
  titulo: string;
  valor: string | number;
  descripcion: string;
  Icon: LucideIcon;
}

export function MetricaCard({
  titulo,
  valor,
  descripcion,
  Icon,
}: MetricaCardProps) {
  return (
    <Card className="border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-4 sm:p-5 lg:p-6 xl:p-7">
        <div className="flex items-start justify-between mb-3 lg:mb-4">
          <div className="p-2.5 lg:p-3 xl:p-3.5 rounded-lg lg:rounded-xl bg-[var(--isla-teal)]/10 group-hover:bg-[var(--isla-teal)]/20 transition-colors">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-[var(--isla-teal)]" />
          </div>
        </div>
        <div className="space-y-1 lg:space-y-2">
          <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">{valor}</p>
          <p className="text-sm lg:text-base xl:text-lg font-semibold text-gray-700">{titulo}</p>
          <p className="text-xs lg:text-sm text-gray-500">{descripcion}</p>
        </div>
      </CardContent>
    </Card>
  );
}

