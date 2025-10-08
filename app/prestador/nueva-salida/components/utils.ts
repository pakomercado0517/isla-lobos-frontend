/**
 * Utilidades específicas para el módulo Nueva Salida
 */

import * as z from "zod";
import { DESTINOS } from "@/lib/types/salida";

// Tipo para bloques del backend
export type BloqueBackend = {
  id: string;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  capacidad_registrada: number;
  estado: string;
  fecha: string;
  embarcaciones_ocupadas: Array<{
    id: string;
    nombre: string;
    tipo: string;
    capacidad: number;
    estado: string;
    salida: {
      id: string;
      estado: string;
      numero_pasajeros: number;
      destino: string;
      observaciones?: string;
    };
  }>;
};

// Tipo para datos del formulario
export type SalidaFormData = {
  fecha: string;
  destino: string;
  bloque_id?: string;
  hora?: string;
  embarcacion_id: string;
  numero_pasajeros: number;
  numero_brazaletes: number;
  observaciones?: string;
};

/**
 * Crea el schema de validación Zod dinámicamente basado en brazaletes disponibles
 */
export const createSalidaSchema = (brazaletesDisponibles: number) =>
  z
    .object({
      fecha: z
        .string()
        .min(1, "La fecha es requerida")
        .refine(
          (fecha) => {
            if (!fecha) return false;
            const fechaSeleccionada = new Date(fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas

            return fechaSeleccionada >= hoy;
          },
          {
            message: "La fecha no puede ser en el pasado",
          }
        ),
      destino: z.string().min(1, "El destino es requerido"),
      bloque_id: z.string().optional(), // Solo para Isla Lobos
      hora: z.string().optional(), // Solo para otros destinos
      embarcacion_id: z.string().min(1, "Debe seleccionar una embarcación"),
      numero_pasajeros: z
        .number()
        .min(1, "Debe tener al menos 1 pasajero")
        .max(50, "Máximo 50 pasajeros"),
      numero_brazaletes: z.number().min(0, "No puede ser negativo"),
      observaciones: z.string().optional(),
    })
    .refine(
      (data) => {
        // Si es Isla Lobos, bloque_id es requerido
        if (data.destino === DESTINOS.ISLA_LOBOS) {
          return !!data.bloque_id;
        }
        // Si es otro destino, hora es requerida
        return !!data.hora;
      },
      {
        message:
          "Debe seleccionar un bloque horario o una hora según el destino",
        path: ["bloque_id"], // O "hora" dependiendo del destino
      }
    )
    .refine(
      (data) => {
        // Validar que no se soliciten más brazaletes de los disponibles
        return data.numero_brazaletes <= brazaletesDisponibles;
      },
      {
        message: `No puedes solicitar más de ${brazaletesDisponibles} brazaletes (disponibles)`,
        path: ["numero_brazaletes"],
      }
    );

/**
 * Verifica si un bloque está disponible para selección
 */
export const isBloqueDisponible = (bloque: BloqueBackend): boolean => {
  const capacidadDisponible =
    bloque.capacidad_total - bloque.capacidad_registrada;
  const estaLleno = capacidadDisponible <= 0;

  return !(
    bloque.estado === "lleno" ||
    bloque.estado === "suspendido_por_clima" ||
    bloque.estado === "cerrado_capitaria" ||
    estaLleno
  );
};

/**
 * Obtiene el estado visual de un bloque
 */
export const getBloqueEstado = (bloque: BloqueBackend) => {
  const capacidadDisponible =
    bloque.capacidad_total - bloque.capacidad_registrada;
  const estaLleno = capacidadDisponible <= 0;
  const estaCasiLleno = capacidadDisponible > 0 && capacidadDisponible <= 10;
  const deshabilitado = !isBloqueDisponible(bloque);

  return {
    capacidadDisponible,
    estaLleno,
    estaCasiLleno,
    deshabilitado,
  };
};

/**
 * Verifica si una embarcación tiene salida en un bloque específico
 */
export const tieneSalidaEnBloque = (
  embarcacionId: string,
  bloqueId: string,
  embarcacionesConSalidasPorBloque: Map<string, Set<string>>
): boolean => {
  const embarcacionesEnEsteBloque =
    embarcacionesConSalidasPorBloque.get(bloqueId);
  return embarcacionesEnEsteBloque?.has(embarcacionId) || false;
};

/**
 * Obtiene el texto descriptivo del estado de un bloque
 */
export const getEstadoBloqueTexto = (estado: string): string => {
  switch (estado) {
    case "lleno":
      return "Lleno";
    case "suspendido_por_clima":
      return "Suspendido por clima";
    case "cerrado_capitaria":
      return "Cerrado por capitanía";
    default:
      return estado;
  }
};

/**
 * Valida si una embarcación puede ser seleccionada
 */
export const puedeSeleccionarEmbarcacion = (
  embarcacionId: string,
  bloqueSeleccionado: string | undefined,
  embarcacionesConSalidasPorBloque: Map<string, Set<string>>
): boolean => {
  if (!bloqueSeleccionado) return true;
  return !tieneSalidaEnBloque(
    embarcacionId,
    bloqueSeleccionado,
    embarcacionesConSalidasPorBloque
  );
};
