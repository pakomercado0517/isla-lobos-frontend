/**
 * Exportaciones centralizadas del módulo de notificaciones
 */

// Componentes principales
export { NotificacionesHeader } from "./NotificacionesHeader";
export { EstadoServicioCard } from "./EstadoServicioCard";

// Formularios
export { FormularioIndividual } from "./FormularioIndividual";
export { FormularioMasivo } from "./FormularioMasivo";
export { FormularioAlertaClima } from "./FormularioAlertaClima";
export { FormularioAlertaPermisos } from "./FormularioAlertaPermisos";

// Información
export { PlantillasCard } from "./PlantillasCard";

// Estados
export { LoadingState } from "./LoadingState";
export { ErrorAlert } from "./ErrorAlert";
export { EmptyState } from "./EmptyState";

// Funciones utilitarias
export {
  validarTelefono,
  formatearTelefono,
  contarCaracteres,
  validarMensajeLength,
  getIconoTipoNotificacion,
  getColorPrioridad,
  getEstadoColor,
  getEstadoLabel,
  formatearResultadoEnvio,
  generarPreviewMensaje,
  getTituloTipoNotificacion,
  getDescripcionTipoNotificacion,
} from "./utils";
