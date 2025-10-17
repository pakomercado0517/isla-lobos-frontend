"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, BarChart3, Clock, Ship, Users } from "lucide-react";
import Link from "next/link";
import { useHomepageStats } from "@/lib/hooks/useHomepageStats";
import { getHomepageConfig } from "@/lib/config/homepage";
import {
  EstadoPuerto,
  EmbarcacionesCard,
  ActividadHoyCard,
  PasajerosCard,
  ErrorAlert,
} from "./components";

export default function Home() {
  // Obtener configuración centralizada
  const config = getHomepageConfig();
  const [year, setYear] = useState<number>();

  useEffect(() => {
    const getYear = new Date().getFullYear();
    setYear(getYear);
  }, []);

  // Hook para obtener estadísticas públicas
  const { stats, loading, error, refresh } = useHomepageStats({
    updateInterval: config.intervals.homepage_stats,
    autoRefresh: true,
    maxRetries: config.retries.max_attempts,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)]">
      {/* Header */}
      <header className="bg-[var(--isla-dark-teal)] text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[var(--isla-teal)] rounded-lg flex items-center justify-center">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">APFF</h1>
                <p className="text-[var(--isla-teal-light)] text-sm">
                  Sistema Arrecifal Lobos-Tuxpan
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
                >
                  Ingresar
                </Button>
              </Link>
              <Link href="/registro">
                <Button className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]">
                  Aceptar Invitación
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-[var(--isla-dark-teal)] mb-6">
            Gestión Inteligente de
            <span className="text-[var(--isla-teal)]"> Embarcaciones</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Digitaliza el control de embarcaciones y pasajeros hacia Isla de
            Lobos. Sistema profesional para CONANP y prestadores de servicios
            autorizados.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-[var(--isla-teal)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-[var(--isla-dark-teal)]">
                Gestión de Bloques
              </CardTitle>
              <CardDescription>
                Control inteligente de horarios y capacidad con límites
                automáticos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-[var(--isla-orange)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-[var(--isla-dark-teal)]">
                Registro de Pasajeros
              </CardTitle>
              <CardDescription>
                Formulario rápido para registro de salidas y control de
                pasajeros
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-[var(--isla-blue)] rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-[var(--isla-dark-teal)]">
                Dashboard en Tiempo Real
              </CardTitle>
              <CardDescription>
                Métricas y reportes automáticos para CONANP
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert error={error} onRetry={refresh} className="mb-6" />
        )}

        {/* Status Cards con datos reales */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <EstadoPuerto puerto={stats?.puerto || null} loading={loading} />
          <EmbarcacionesCard
            embarcaciones={stats?.embarcaciones || null}
            loading={loading}
          />
          <ActividadHoyCard
            actividad={stats?.actividad_hoy || null}
            loading={loading}
          />
          <PasajerosCard
            actividad={stats?.actividad_hoy || null}
            loading={loading}
          />
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[var(--isla-dark-teal)] flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Acceso directo a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-16 bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white">
                <Link href="/prestador/nueva-salida">
                  <div className="text-center">
                    <p className="font-semibold">Registrar Salida</p>
                    <p className="text-sm opacity-90">Nuevo viaje</p>
                  </div>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-16 border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
              >
                <Link href="/dashboard/bloques">
                  <div className="text-center">
                    <p className="font-semibold">Ver Disponibilidad</p>
                    <p className="text-sm opacity-90">
                      Bloques horarios solo para CONANP
                    </p>
                  </div>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-16 border-[var(--isla-orange)] text-[var(--isla-orange)] hover:bg-[var(--isla-orange)] hover:text-white"
              >
                <Link href="/prestador/embarcaciones">
                  <div className="text-center">
                    <p className="font-semibold">Mis Embarcaciones</p>
                    <p className="text-sm opacity-90">Gestionar flota</p>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--isla-dark-teal)] text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[var(--isla-teal-light)]">
            © {year} APFF Sistema Arrecifal Lobos-Tuxpan - Sistema de Gestión.
          </p>
        </div>
      </footer>
    </div>
  );
}
