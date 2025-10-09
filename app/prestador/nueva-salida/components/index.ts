/**
 * Exportaciones centralizadas para el módulo Nueva Salida
 */

export { FormularioNuevaSalida } from "./FormularioNuevaSalida";
export { SelectorDestino } from "./SelectorDestino";
export { SelectorBloque } from "./SelectorBloque";
export { SelectorEmbarcacion } from "./SelectorEmbarcacion";
export { CamposPasajerosYBrazaletes } from "./CamposPasajerosYBrazaletes";
export { MensajeEstado } from "./MensajeEstado";
export { DialogExito } from "./DialogExito";
export { DialogConfirmacion } from "./DialogConfirmacion";

// Utilidades y tipos
export {
  type BloqueBackend,
  type SalidaFormData,
  createSalidaSchema,
  isBloqueDisponible,
  getBloqueEstado,
  tieneSalidaEnBloque,
  getEstadoBloqueTexto,
  puedeSeleccionarEmbarcacion,
} from "./utils";
