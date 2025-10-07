"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { getPrestadorDashboardData } from "@/actions/prestador";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Ship,
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";

import type { Salida } from "@/lib/types/salida";
import type { Embarcacion } from "@/lib/types/embarcacion";
import { formatearFechaSalida } from "@/lib/utils";

export default function PrestadorPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const [salidas, setSalidas] = useState<Salida[]>([]);
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Solo cargar datos si el usuario está autorizado y no está cargando
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🚤 Prestador: Cargando datos del dashboard...");
      const result = await getPrestadorDashboardData();

      if (result.success) {
        console.log("🚤 Prestador: Datos recibidos:", result.data);

        // Procesar salidas
        const salidasData = result.data?.salidas?.salidas || [];
        console.log("🚤 Prestador: Salidas raw data:", salidasData);
        const salidasProcesadas = salidasData.map((salida: Salida) => ({
          id: salida.id,
          fecha: salida.fecha,
          hora_salida: "08:30", // Usar datos reales cuando estén disponibles
          hora_regreso: "10:30",
          numero_pasajeros: salida.numero_pasajeros || 0,
          observaciones: salida.observaciones || "",
          estado: salida.estado,
          destino: salida.destino || "Sin destino",
          bloque: {
            nombre: salida.bloque?.nombre || "Bloque",
            hora_inicio: salida.bloque?.hora_inicio || "08:00",
            hora_fin: salida.bloque?.hora_fin || "10:00",
          },
          embarcacion: {
            nombre: salida.embarcacion?.nombre || "Embarcación",
            capacidad: salida.embarcacion?.capacidad || 30,
          },
        }));

        // Procesar embarcaciones
        const embarcacionesData =
          result.data?.embarcaciones?.embarcaciones || [];
        const embarcacionesProcesadas = embarcacionesData.map(
          (embarcacion: Embarcacion) => ({
            id: embarcacion.id,
            nombre: embarcacion.nombre,
            matricula: embarcacion.matricula,
            capacidad: embarcacion.capacidad,
            tipo: embarcacion.tipo,
            estado: embarcacion.estado,
          })
        );

        setSalidas(salidasProcesadas);
        setEmbarcaciones(embarcacionesProcesadas);
      } else {
        console.error("🚤 Prestador: Error:", result.error);
        setError(result.error || "Error al cargar los datos");

        // Usar datos de ejemplo como fallback
        setSalidas([]);
        setEmbarcaciones([]);
      }
    } catch (error) {
      console.error("🚤 Prestador: Error cargando datos:", error);
      setError("Error al cargar los datos");

      // Usar datos de ejemplo como fallback
      setSalidas([]);
      setEmbarcaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "programada":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "en_curso":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completada":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "programada":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "en_curso":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "completada":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelada":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Función para obtener salidas de hoy para una embarcación específica
  const getSalidasHoyPorEmbarcacion = (embarcacionId: string) => {
    const hoy = new Date().toLocaleDateString("es-MX"); // Formato local mexicano
    return salidas.filter((salida) => {
      // Convertir la fecha de la salida a string para comparar
      const fechaSalida =
        salida.fecha instanceof Date
          ? salida.fecha.toLocaleDateString("es-MX")
          : salida.fecha;

      return (
        salida.embarcacion.nombre ===
          embarcaciones.find((e) => e.id === embarcacionId)?.nombre &&
        fechaSalida === hoy &&
        salida.estado !== "cancelada" &&
        salida.estado !== "completada" &&
        salida.estado !== "cancelada_por_clima" &&
        salida.estado !== "cancelada_capitaria"
      );
    });
  };

  // Función para obtener el color del badge basado en las salidas de hoy
  const getEmbarcacionBadgeColor = (embarcacionId: string) => {
    const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacionId);

    if (salidasHoy.length === 0) {
      return "bg-green-100 text-green-800 border-green-200";
    } else {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // Función para obtener el texto del badge basado en las salidas de hoy
  const getEmbarcacionBadgeText = (embarcacionId: string) => {
    const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacionId);

    if (salidasHoy.length === 0) {
      return "Sin salidas hoy";
    } else if (salidasHoy.length === 1) {
      return "1 salida hoy";
    } else {
      return `${salidasHoy.length} salidas hoy`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--isla-dark-teal)]">Cargando...</p>
        </div>
      </div>
    );
  }

  console.log("salidas", salidas);

  return (
    <div className="space-y-8">
      {/* Mensaje de Bienvenida */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-[var(--isla-teal)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Ship className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)] mb-2">
          ¡Bienvenido, {user?.nombre}!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gestiona tus embarcaciones, registra salidas y mantén un control
          completo de tus operaciones turísticas en Isla Lobos.
        </p>
      </div>
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Estado de Embarcaciones */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--isla-dark-teal)] mb-4">
          Mis Embarcaciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {embarcaciones.map((embarcacion) => (
            <Card key={embarcacion.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {embarcacion.nombre}
                    </CardTitle>
                    <CardDescription>{embarcacion.matricula}</CardDescription>
                  </div>
                  <Badge
                    className={`${getEmbarcacionBadgeColor(
                      embarcacion.id
                    )} text-xs`}
                  >
                    {getEmbarcacionBadgeText(embarcacion.id)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Capacidad:</span>
                    <span className="font-medium">
                      {embarcacion.capacidad} personas
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <span className="font-medium capitalize">
                      {embarcacion.tipo === "mayor"
                        ? "Embarcación Mayor"
                        : "Embarcación Menor"}
                    </span>
                  </div>

                  {/* Información de salidas de hoy */}
                  {(() => {
                    const salidasHoy = getSalidasHoyPorEmbarcacion(
                      embarcacion.id
                    );
                    if (salidasHoy.length > 0) {
                      return (
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <div className="text-xs text-gray-600 mb-1">
                            Salidas programadas hoy:
                          </div>
                          {salidasHoy.map((salida) => (
                            <div
                              key={salida.id}
                              className="text-xs text-gray-700 bg-blue-50 p-2 rounded mb-1"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {salida.destino}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getEstadoColor(
                                    salida.estado
                                  )}`}
                                >
                                  {salida.estado.replace("_", " ")}
                                </Badge>
                              </div>
                              <div className="text-gray-600 mt-1">
                                {salida.bloque?.hora_inicio} -{" "}
                                {salida.bloque?.hora_fin} •{" "}
                                {salida.numero_pasajeros} pasajeros
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Salidas Recientes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--isla-dark-teal)]">
            Mis Salidas
          </h2>
          <Button
            size="sm"
            className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
            asChild
          >
            <Link href="/prestador/nueva-salida">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Salida
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {salidas.map((salida) => (
            <Card key={salida.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-5 h-5 text-[var(--isla-teal)]" />
                      <div>
                        <p className="font-medium">
                          {formatearFechaSalida(salida.fecha)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {salida.bloque?.hora_inicio} -{" "}
                          {salida.bloque?.hora_fin}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Embarcación:</span>
                        <p className="font-medium">
                          {salida.embarcacion.nombre}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Pasajeros:</span>
                        <p className="font-medium">
                          {salida.numero_pasajeros}/
                          {salida.embarcacion.capacidad}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Destino:</span>
                        <p className="font-medium">{salida.destino}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Bloque:</span>
                        <p className="font-medium">
                          {salida.bloque?.nombre || "Sin bloque"}
                        </p>
                      </div>
                    </div>
                    {salida.observaciones && (
                      <div className="mt-2">
                        <span className="text-gray-600 text-sm">
                          Observaciones:
                        </span>
                        <p className="text-sm">{salida.observaciones}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
                    >
                      <Link href={`/prestador/salidas/${salida.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Link>
                    </Button>
                    <div className="flex items-center space-x-2">
                      {getEstadoIcon(salida.estado)}
                      <Badge
                        className={`${getEstadoColor(
                          salida.estado
                        )} text-xs px-3 py-1 h-8 flex items-center`}
                      >
                        {salida.estado.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {salidas.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes salidas registradas
              </h3>
              <p className="text-gray-500 mb-4">
                Registra tu primera salida para comenzar
              </p>
              <Button
                asChild
                className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
              >
                <Link href="/prestador/nueva-salida">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Primera Salida
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
