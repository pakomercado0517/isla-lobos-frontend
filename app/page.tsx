"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Ship, Package, Shield, BarChart3, Eye, Clock } from "lucide-react";
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

  // Servicios principales adaptados al proyecto
  const servicios = [
    {
      icon: Ship,
      title: "Registrar Salida",
      description: "Planifica y registra tus salidas",
      href: "/prestador/nueva-salida",
      color: "from-[var(--isla-teal)] to-cyan-600",
    },
    {
      icon: Package,
      title: "Brazaletes",
      description: "Identificación oficial",
      href: "/prestador/brazaletes",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: BarChart3,
      title: "Dashboard en Tiempo Real",
      description: "Métricas y reportes automáticos",
      href: "/dashboard",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header - Solo visible en mobile */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 lg:hidden">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-end">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
                >
                  Ingresar
                </Button>
              </Link>
              <Link href="/registro" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]">
                  Aceptar Invitación
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 min-h-[500px] md:min-h-[700px] lg:min-h-[800px]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/hero%20page.png')",
            }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--isla-dark-teal)]/30 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 md:pt-16 md:pb-32 lg:pt-24 lg:pb-40 min-h-[500px] md:min-h-[700px] lg:min-h-[800px] flex flex-col justify-center">
          {/* Header with logo and buttons - Solo visible en desktop */}
          <div className="hidden lg:flex items-center justify-between mb-12">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--isla-teal)] to-cyan-600 flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Ship className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">APFF</h1>
                <p className="text-sm text-white/70">
                  Sistema Arrecifal Lobos-Tuxpan
                </p>
              </div>
            </div>
            {/* Buttons - Alineados a la derecha */}
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Ingresar
                </Button>
              </Link>
              <Link href="/registro">
                <Button className="bg-white text-[var(--isla-dark-teal)] hover:bg-gray-100 transition-all duration-300 shadow-lg">
                  Aceptar Invitación
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="mb-6 text-white drop-shadow-lg text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Gestión Inteligente de
              <span className="block bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent mt-2">
                Isla de Lobos
              </span>
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md text-base md:text-xl lg:text-2xl">
              Digitaliza el control de embarcaciones y pasajeros hacia Isla de
              Lobos. Sistema profesional para CONANP y prestadores de servicios
              autorizados.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 pb-12 md:pt-16 md:pb-16 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {servicios.map((servicio, index) => {
              const IconComponent = servicio.icon;
              return (
                <Link key={index} href={servicio.href}>
                  <Card className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${servicio.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
                      >
                        <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="mb-2 text-slate-800 text-xl md:text-2xl">
                          {servicio.title}
                        </CardTitle>
                        <CardDescription className="text-slate-600 text-base md:text-lg">
                          {servicio.description}
                        </CardDescription>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorAlert error={error} onRetry={refresh} className="mb-6" />
        </div>
      )}

      {/* Status Card */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6 pb-8 md:pt-8 md:pb-12 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <EstadoPuerto puerto={stats?.puerto || null} loading={loading} />
        </div>
      </section>

      {/* Resource Cards (Stats) */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6 pb-8 md:pt-8 md:pb-12 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl p-5 md:p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl text-white mb-1 font-bold">
                  {loading
                    ? "..."
                    : stats?.embarcaciones?.total_registradas || "0"}
                </div>
                <h4 className="text-white mb-0.5 font-semibold text-sm md:text-base">
                  Gestión de Bloques
                </h4>
                <p className="text-white/80 text-xs md:text-sm">
                  Control de horarios
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-12 md:pb-20 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 md:mb-12 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500 mb-2">
              <Clock className="w-5 h-5 md:w-6 md:h-6" />
              <span className="font-medium text-lg md:text-xl">
                Acciones Rápidas
              </span>
            </div>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
              Acceso directo a las funciones más utilizadas del sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <Link href="/prestador/nueva-salida">
              <Button className="w-full bg-gradient-to-r from-[var(--isla-teal)] to-cyan-600 text-white rounded-2xl py-6 md:py-8 px-6 flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300 h-auto group">
                <span className="font-semibold text-base md:text-lg">
                  Registrar Salida
                </span>
                <Ship className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/dashboard/bloques">
              <Button
                variant="outline"
                className="w-full bg-white text-slate-700 border-2 border-slate-200 rounded-2xl py-6 md:py-8 px-6 flex items-center justify-between hover:bg-slate-50 hover:border-[var(--isla-teal)] transition-all duration-300 shadow-sm h-auto group"
              >
                <span className="font-semibold text-base md:text-lg">
                  Ver Disponibilidad
                </span>
                <Eye className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
              </Button>
            </Link>

            <Link href="/prestador/embarcaciones">
              <Button
                variant="outline"
                className="w-full bg-white text-[var(--isla-orange)] border-2 border-orange-200 rounded-2xl py-6 md:py-8 px-6 flex items-center justify-between hover:bg-orange-50 hover:border-[var(--isla-orange)] transition-all duration-300 shadow-sm h-auto group"
              >
                <span className="font-semibold text-base md:text-lg">
                  Mis Embarcaciones
                </span>
                <Ship className="w-5 h-5 md:w-6 md:h-6 text-[var(--isla-orange)] group-hover:scale-110 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-16 md:mt-20 pt-8 md:pt-12 border-t border-slate-200 text-center">
            <p className="text-slate-500 mb-1 text-base md:text-lg">
              © {year} APFF Sistema Arrecifal Lobos-Tuxpan
            </p>
            <p className="text-slate-400 text-sm md:text-base">
              Sistema de Gestión
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
