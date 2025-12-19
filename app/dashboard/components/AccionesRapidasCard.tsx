"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Ship, Users, BarChart3, ArrowRight } from "lucide-react";

export function AccionesRapidasCard() {
  const acciones = [
    {
      href: "/dashboard/bloques",
      icon: Calendar,
      label: "Gestionar Bloques",
    },
    {
      href: "/dashboard/embarcaciones",
      icon: Ship,
      label: "Administrar Flota",
    },
    {
      href: "/dashboard/usuarios",
      icon: Users,
      label: "Gestionar Usuarios",
    },
    {
      href: "/dashboard/reportes",
      icon: BarChart3,
      label: "Ver Reportes",
    },
  ];

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
          Acciones Rápidas
        </CardTitle>
        <CardDescription className="text-sm lg:text-base text-gray-600">
          Acceso directo a funciones principales
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
          {acciones.map((accion) => {
            const Icon = accion.icon;
            return (
              <Button
                key={accion.href}
                asChild
                className="w-full justify-between h-auto p-4 lg:p-5 border-[var(--isla-teal)]/30 text-gray-700 hover:bg-[var(--isla-teal)]/5 hover:border-[var(--isla-teal)] transition-all"
                variant="outline"
              >
                <Link href={accion.href} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="p-2 lg:p-2.5 rounded-lg lg:rounded-xl bg-[var(--isla-teal)]/10">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[var(--isla-teal)]" />
                    </div>
                    <span className="text-sm lg:text-base font-medium">{accion.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                </Link>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

