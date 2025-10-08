"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{valor}</div>
        <p className="text-xs text-muted-foreground">{descripcion}</p>
      </CardContent>
    </Card>
  );
}

