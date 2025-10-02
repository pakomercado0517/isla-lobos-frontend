export interface Salida {
  id: string;
  prestador_id: string;
  embarcacion_id: string;
  bloque_id?: string; // Opcional ahora, solo requerido para Isla Lobos
  fecha: Date;
  numero_pasajeros: number;
  destino: string; // Nuevo campo para el destino
  observaciones?: string;
  estado: EstadoSalida;
  motivo_cancelacion?: string;
  bloque?: {
    nombre: string;
    hora_inicio: string;
    hora_fin: string;
  };
  embarcacion: {
    nombre: string;
    capacidad: number;
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

// Bloques horarios predefinidos para Isla Lobos (según backend)
// Estos bloques siempre están disponibles, solo cambia su estado y capacidad
export const BLOQUES_PREDEFINIDOS = [
  {
    id: "11111111-1111-1111-1111-111111111111", // UUID del backend
    nombre: "Bloque Matutino",
    hora_inicio: "08:00",
    hora_fin: "10:00",
    capacidad_total: 65,
  },
  {
    id: "22222222-2222-2222-2222-222222222222", // UUID del backend
    nombre: "Bloque Mediodía",
    hora_inicio: "11:00",
    hora_fin: "13:00",
    capacidad_total: 65,
  },
  {
    id: "33333333-3333-3333-3333-333333333333", // UUID del backend
    nombre: "Bloque Vespertino",
    hora_inicio: "14:00",
    hora_fin: "16:00",
    capacidad_total: 65,
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
