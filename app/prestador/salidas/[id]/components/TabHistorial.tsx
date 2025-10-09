import { Clock, Calendar, Edit } from "lucide-react";
import type { Salida } from "@/lib/types/salida";

interface TabHistorialProps {
  salida: Salida;
}

export function TabHistorial({ salida }: TabHistorialProps) {
  // Construir eventos del historial basado en los datos disponibles
  const eventos = [
    {
      id: "created",
      tipo: "Creada",
      fecha: salida.createdAt || salida.fecha,
      descripcion: "Salida registrada en el sistema",
      icono: Calendar,
      color: "text-blue-600",
    },
  ];

  // Agregar evento de actualización si existe
  if (salida.updatedAt && salida.updatedAt !== salida.createdAt) {
    eventos.push({
      id: "updated",
      tipo: "Actualizada",
      fecha: salida.updatedAt,
      descripcion: "Información de la salida modificada",
      icono: Edit,
      color: "text-yellow-600",
    });
  }

  // Agregar evento de estado si está completada o cancelada
  if (salida.estado === "completada") {
    eventos.push({
      id: "completed",
      tipo: "Completada",
      fecha: salida.updatedAt || salida.fecha,
      descripcion: "Salida marcada como completada",
      icono: Clock,
      color: "text-green-600",
    });
  }

  if (
    salida.estado === "cancelada" ||
    salida.estado === "cancelada_por_clima" ||
    salida.estado === "cancelada_capitaria"
  ) {
    eventos.push({
      id: "cancelled",
      tipo: "Cancelada",
      fecha: salida.updatedAt || salida.fecha,
      descripcion: salida.motivo_cancelacion || "Salida cancelada",
      icono: Clock,
      color: "text-red-600",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historial de Cambios</h3>
        <div className="text-sm text-gray-600">{eventos.length} eventos</div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {eventos.map((evento, index) => {
          const Icono = evento.icono;
          return (
            <div key={evento.id} className="flex gap-4">
              {/* Línea vertical */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 border-2 ${evento.color} border-current`}
                >
                  <Icono className="w-5 h-5" />
                </div>
                {index < eventos.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mt-2" />
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 pb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {evento.tipo}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {typeof evento.fecha === "string"
                        ? new Date(evento.fecha).toLocaleString("es-MX", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : evento.fecha.toLocaleString("es-MX", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{evento.descripcion}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <strong>Nota:</strong> El historial detallado de cambios estará
        disponible próximamente con información completa de auditoría.
      </div>
    </div>
  );
}
