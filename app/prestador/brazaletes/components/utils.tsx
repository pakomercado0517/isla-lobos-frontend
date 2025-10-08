import type { BrazaletesPrestador } from "@/lib/types/brazaletes";

export interface ConteosBrazaletes {
  todos: number;
  disponible: number;
  asignado: number;
  utilizado: number;
  perdido: number;
}

export function calcularConteos(
  data: BrazaletesPrestador | null
): ConteosBrazaletes {
  if (!data) {
    return {
      todos: 0,
      disponible: 0,
      asignado: 0,
      utilizado: 0,
      perdido: 0,
    };
  }

  const todos = data.detalle;

  return {
    todos: todos.length,
    disponible: todos.filter((b) => b.estado === "disponible").length,
    asignado: todos.filter((b) => b.estado === "asignado").length,
    utilizado: todos.filter((b) => b.estado === "utilizado").length,
    perdido: todos.filter((b) => b.estado === "perdido").length,
  };
}

export function filtrarBrazaletes(
  data: BrazaletesPrestador | null,
  filtroEstado: "todos" | "disponible" | "asignado" | "utilizado" | "perdido"
) {
  if (!data) return [];

  const todos = data.detalle;
  return filtroEstado === "todos"
    ? todos
    : todos.filter((b) => b.estado === filtroEstado);
}

export function getEstadoBadgeClass(estado: string): string {
  switch (estado) {
    case "disponible":
      return "bg-green-100 text-green-800";
    case "asignado":
      return "bg-yellow-100 text-yellow-800";
    case "utilizado":
      return "bg-purple-100 text-purple-800";
    case "perdido":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
