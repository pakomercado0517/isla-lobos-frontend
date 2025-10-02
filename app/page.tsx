import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Anchor,
  Calendar,
  Users,
  Ship,
  BarChart3,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
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
                <h1 className="text-2xl font-bold">Isla Lobos</h1>
                <p className="text-[var(--isla-teal-light)] text-sm">
                  Sistema de Gestión
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

        {/* Status Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--isla-green)] to-[var(--isla-green)]/80">
            <CardContent className="p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Puerto</p>
                  <p className="text-2xl font-bold">Abierto</p>
                </div>
                <Shield className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--isla-teal)] to-[var(--isla-teal-dark)]">
            <CardContent className="p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Embarcaciones</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Ship className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--isla-orange)] to-[var(--isla-orange)]/80">
            <CardContent className="p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Salidas Hoy</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Anchor className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--isla-blue)] to-[var(--isla-blue)]/80">
            <CardContent className="p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pasajeros</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Users className="w-8 h-8" />
              </div>
            </CardContent>
          </Card>
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
                <div className="text-center">
                  <p className="font-semibold">Registrar Salida</p>
                  <p className="text-sm opacity-90">Nuevo viaje</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-16 border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
              >
                <div className="text-center">
                  <p className="font-semibold">Ver Disponibilidad</p>
                  <p className="text-sm opacity-90">Bloques horarios</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-16 border-[var(--isla-orange)] text-[var(--isla-orange)] hover:bg-[var(--isla-orange)] hover:text-white"
              >
                <div className="text-center">
                  <p className="font-semibold">Mis Embarcaciones</p>
                  <p className="text-sm opacity-90">Gestionar flota</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--isla-dark-teal)] text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[var(--isla-teal-light)]">
            © 2024 Isla Lobos - Sistema de Gestión. Desarrollado para CONANP.
          </p>
        </div>
      </footer>
    </div>
  );
}
