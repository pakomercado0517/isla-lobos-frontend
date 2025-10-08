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
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
        <CardDescription>
          Acceso directo a funciones principales
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {acciones.map((accion) => {
          const Icon = accion.icon;
          return (
            <Button
              key={accion.href}
              asChild
              className="w-full justify-between"
              variant="outline"
            >
              <Link href={accion.href}>
                <div className="flex items-center">
                  <Icon className="w-4 h-4 mr-2" />
                  {accion.label}
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

