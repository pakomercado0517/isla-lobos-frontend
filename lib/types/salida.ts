export interface Salida {
  id: string;
  prestador_id: string;
  embarcacion_id: string;
  bloque_id?: string; // Opcional ahora, solo requerido para Isla Lobos
  hora?: string; // Hora para destinos sin bloques (formato HH:MM)
  fecha: Date | string;
  numero_pasajeros: number;
  destino: string; // Nuevo campo para el destino
  observaciones?: string;
  estado: EstadoSalida;
  motivo_cancelacion?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  bloque?: {
    id: string;
    nombre: string;
    hora_inicio: string;
    hora_fin: string;
    capacidad_total?: number;
    capacidad_registrada?: number;
    capacidad_disponible?: number;
  };
  embarcacion?: {
    id: string;
    nombre: string;
    capacidad: number;
    matricula?: string;
    tipo?: "menor" | "mayor";
    estado?: "disponible" | "en_uso" | "mantenimiento";
  };
}

// Destinos disponibles
export const DESTINOS = {
  ISLA_LOBOS: "Isla de Lobos",
  ARRECIFE_TUXPAN: "Arrecife Tuxpan",
  ARRECIFE_EN_MEDIO: "Arrecife de en Medio",
  ARRECIFE_TANHUIJO: "Arrecife Tanhuijo",
} as const;

export type DestinoType = (typeof DESTINOS)[keyof typeof DESTINOS];

// Bloques horarios predefinidos - DEPRECADO
// Ahora cada destino puede tener sus propios bloques configurados dinámicamente
// Esta constante se mantiene solo para compatibilidad temporal
export const BLOQUES_PREDEFINIDOS = [
  {
    id: "11111111-1111-1111-1111-111111111111", // UUID del backend
    nombre: "Bloque Matutino",
    hora_inicio: "08:00",
    hora_fin: "10:00",
    capacidad_total: 65,
    destino: "Isla de Lobos" as const,
  },
  {
    id: "22222222-2222-2222-2222-222222222222", // UUID del backend
    nombre: "Bloque Mediodía",
    hora_inicio: "11:00",
    hora_fin: "13:00",
    capacidad_total: 65,
    destino: "Isla de Lobos" as const,
  },
  {
    id: "33333333-3333-3333-3333-333333333333", // UUID del backend
    nombre: "Bloque Vespertino",
    hora_inicio: "14:00",
    hora_fin: "16:00",
    capacidad_total: 65,
    destino: "Isla de Lobos" as const,
  },
] as const;

export enum EstadoSalida {
  PROGRAMADA = "programada",
  EN_CURSO = "en_curso",
  COMPLETADA = "completada",
  CANCELADA = "cancelada",
  CANCELADA_POR_CLIMA = "cancelada_por_clima",
  CANCELADA_CAPITARIA = "cancelada_capitaria",
}
