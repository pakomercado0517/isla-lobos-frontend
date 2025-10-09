import type { BrazaletesPrestador } from "@/lib/types/brazaletes";
import type { Salida } from "@/lib/types/salida";

export function filtrarBrazaletesDisponibles(data: BrazaletesPrestador | null) {
  // Los brazaletes "asignados" son los que el prestador compró y aún no ha usado
  return data?.detalle.filter((b) => b.estado === "asignado") || [];
}

export function filtrarSalidasConBrazaletes(salidas: Salida[]) {
  // Se pueden registrar brazaletes en salidas programadas, en curso o completadas
  return salidas.filter(
    (salida) =>
      salida.numero_pasajeros > 0 &&
      (salida.estado === "programada" ||
        salida.estado === "en_curso" ||
        salida.estado === "completada")
  );
}

export function getFechaActualFormato(): string {
  // Extraer fecha actual sin conversión de timezone
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function puedeRegistrarBrazaletes(
  brazaletesDisponibles: BrazaletesPrestador["detalle"],
  salidasDisponibles: Salida[]
): boolean {
  return brazaletesDisponibles.length > 0 && salidasDisponibles.length > 0;
}

export function getMensajeEstadoRegistro(
  brazaletesDisponibles: BrazaletesPrestador["detalle"]
): string {
  if (brazaletesDisponibles.length === 0) {
    return "No tienes brazaletes disponibles para registrar. Debes comprar brazaletes primero.";
  }
  return "No tienes salidas programadas, en curso o completadas disponibles. Registra una salida primero.";
}
