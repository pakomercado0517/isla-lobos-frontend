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
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-base sm:text-lg font-semibold">Historial de Cambios</h3>
        <div className="text-xs sm:text-sm text-gray-600">{eventos.length} eventos</div>
      </div>

      {/* Timeline */}
      <div className="space-y-3 sm:space-y-4">
        {eventos.map((evento, index) => {
          const Icono = evento.icono;
          return (
            <div key={evento.id} className="flex gap-3 sm:gap-4">
              {/* Línea vertical */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 border-2 ${evento.color} border-current`}
                >
                  <Icono className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                {index < eventos.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-200 mt-2" />
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 pb-6 sm:pb-8 min-w-0">
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                    <h4 className="font-semibold text-sm sm:text-base text-gray-900">
                      {evento.tipo}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
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
                  <p className="text-xs sm:text-sm text-gray-600 break-words">{evento.descripcion}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-blue-900">
        <strong>Nota:</strong> El historial detallado de cambios estará
        disponible próximamente con información completa de auditoría.
      </div>
    </div>
  );
}
