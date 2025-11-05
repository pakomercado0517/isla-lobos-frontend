export interface Embarcacion {
  id: string;
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento" | "pendiente_autorizacion";
}

export type EmbarcacionFormData = Omit<Embarcacion, "id">;
