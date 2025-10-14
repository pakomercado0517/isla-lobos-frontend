import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  Send,
  X,
  UserPlus,
  CloudRain,
  RotateCcw,
  Info,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  enviarNotificacionMasiva,
  getPrestadores,
} from "@/actions/notificaciones";
import { getCondicionActual } from "@/actions/clima";
import { PrestadorSelector } from "@/lib/types/notificaciones";
import { CondicionMeteorologica } from "@/lib/types/clima";
import {
  validarMensajeLength,
  formatearTelefono,
  generarPreviewMensaje,
} from "./utils";
import { clientLogger } from "@/lib/logger-client";

type TipoPlantillaMasiva = "alerta_clima" | "recordatorio_generico";

export function FormularioMasivo() {
  const [prestadores, setPrestadores] = useState<PrestadorSelector[]>([]);
  const [prestadoresSeleccionados, setPrestadoresSeleccionados] = useState<
    PrestadorSelector[]
  >([]);
  const [prestadorParaAgregar, setPrestadorParaAgregar] = useState<string>("");
  const [cargandoPrestadores, setCargandoPrestadores] = useState(true);
  const [tipoPlantilla, setTipoPlantilla] = useState<TipoPlantillaMasiva>(
    "recordatorio_generico"
  );
  const [condicionMeteorologica, setCondicionMeteorologica] =
    useState<CondicionMeteorologica | null>(null);
  const [cargandoClima, setCargandoClima] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [plantillaOriginal, setPlantillaOriginal] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState("");

  const validacionMensaje = validarMensajeLength(mensaje);

  // Verificar si el mensaje fue editado por el usuario
  const mensajeEditado =
    mensaje !== plantillaOriginal && plantillaOriginal !== "";

  // Prestadores disponibles (no seleccionados aún)
  const prestadoresDisponibles = prestadores.filter(
    (p) => !prestadoresSeleccionados.find((ps) => ps.id === p.id)
  );

  // Cargar prestadores al montar el componente
  useEffect(() => {
    const cargarPrestadores = async () => {
      try {
        clientLogger.info("Cargando lista de prestadores para envío masivo");
        const result = await getPrestadores();

        if (result.success && result.data) {
          setPrestadores(result.data.prestadores);
          clientLogger.info("Prestadores cargados", {
            total: result.data.prestadores.length,
          });
        } else {
          clientLogger.error("Error al cargar prestadores", result.error);
          setResultado(
            `⚠️ Error al cargar prestadores: ${
              result.error || "Error desconocido"
            }`
          );
        }
      } catch (error) {
        clientLogger.error("Error crítico al cargar prestadores", error);
        setResultado("⚠️ Error al cargar la lista de prestadores");
      } finally {
        setCargandoPrestadores(false);
      }
    };

    cargarPrestadores();
  }, []);

  // Cargar condiciones meteorológicas al montar
  useEffect(() => {
    const cargarClima = async () => {
      try {
        setCargandoClima(true);
        clientLogger.info("Cargando condiciones meteorológicas");

        const result = await getCondicionActual();

        if (result.success && result.data) {
          setCondicionMeteorologica(result.data.condicion);
          clientLogger.info("Condiciones meteorológicas cargadas", {
            oleaje: result.data.condicion.oleaje,
            viento: result.data.condicion.viento_velocidad,
            estadoPuerto: result.data.condicion.estado_puerto,
          });
        } else {
          clientLogger.warn(
            "No se pudieron cargar condiciones meteorológicas",
            {
              error: result.error,
            }
          );
        }
      } catch (error) {
        clientLogger.error("Error al cargar condiciones meteorológicas", error);
      } finally {
        setCargandoClima(false);
      }
    };

    cargarClima();
  }, []);

  // Auto-completar mensaje con plantilla cuando cambia el tipo
  useEffect(() => {
    if (tipoPlantilla === "recordatorio_generico") {
      // Para recordatorios genéricos, dejar vacío
      setMensaje("");
      setPlantillaOriginal("");
      return;
    }

    // Preparar datos para la plantilla de clima
    let datosPlantilla: Record<string, string | number> = {};

    if (tipoPlantilla === "alerta_clima" && condicionMeteorologica) {
      datosPlantilla = {
        estado_puerto: condicionMeteorologica.estado_puerto.toUpperCase(),
        oleaje: condicionMeteorologica.oleaje,
        viento: condicionMeteorologica.viento_velocidad,
        viento_direccion: condicionMeteorologica.viento_direccion,
      };

      clientLogger.info("Usando datos meteorológicos para envío masivo", {
        oleaje: condicionMeteorologica.oleaje,
        viento: condicionMeteorologica.viento_velocidad,
        estadoPuerto: condicionMeteorologica.estado_puerto,
      });
    }

    // Generar plantilla con datos reales
    const plantilla = generarPreviewMensaje(tipoPlantilla, datosPlantilla);
    setMensaje(plantilla);
    setPlantillaOriginal(plantilla);

    clientLogger.info("Plantilla auto-cargada para envío masivo", {
      tipo: tipoPlantilla,
      conDatosReales:
        tipoPlantilla === "alerta_clima" && !!condicionMeteorologica,
      longitudPlantilla: plantilla.length,
    });
  }, [tipoPlantilla, condicionMeteorologica]);

  // Función para restaurar la plantilla original
  const restaurarPlantilla = () => {
    setMensaje(plantillaOriginal);
    clientLogger.info("Plantilla restaurada", { tipo: tipoPlantilla });
  };

  // Función para refrescar datos meteorológicos
  const refrescarClima = async () => {
    try {
      setCargandoClima(true);
      clientLogger.info("Refrescando condiciones meteorológicas");

      const result = await getCondicionActual();

      if (result.success && result.data) {
        setCondicionMeteorologica(result.data.condicion);

        // Si está en modo alerta clima, actualizar plantilla automáticamente
        if (tipoPlantilla === "alerta_clima") {
          const datosPlantilla = {
            estado_puerto: result.data.condicion.estado_puerto.toUpperCase(),
            oleaje: result.data.condicion.oleaje,
            viento: result.data.condicion.viento_velocidad,
            viento_direccion: result.data.condicion.viento_direccion,
          };

          const plantilla = generarPreviewMensaje(
            tipoPlantilla,
            datosPlantilla
          );
          setMensaje(plantilla);
          setPlantillaOriginal(plantilla);
        }

        setResultado("✅ Datos meteorológicos actualizados");
        setTimeout(() => setResultado(""), 3000);
      } else {
        setResultado("⚠️ No se pudieron actualizar los datos meteorológicos");
      }
    } catch (error) {
      clientLogger.error("Error al refrescar clima", error);
      setResultado("❌ Error al actualizar datos meteorológicos");
    } finally {
      setCargandoClima(false);
    }
  };

  // Agregar prestador a la lista de seleccionados
  const agregarPrestador = () => {
    if (!prestadorParaAgregar) return;

    const prestador = prestadores.find((p) => p.id === prestadorParaAgregar);
    if (!prestador) return;

    // Verificar que no esté ya agregado
    if (prestadoresSeleccionados.find((p) => p.id === prestador.id)) {
      setResultado("⚠️ Este prestador ya está en la lista");
      return;
    }

    setPrestadoresSeleccionados([...prestadoresSeleccionados, prestador]);
    setPrestadorParaAgregar(""); // Limpiar selector
    setResultado(""); // Limpiar mensaje de error

    clientLogger.info("Prestador agregado a la lista", {
      nombre: prestador.nombre,
      totalSeleccionados: prestadoresSeleccionados.length + 1,
    });
  };

  // Eliminar prestador de la lista
  const eliminarPrestador = (prestadorId: string) => {
    const prestador = prestadoresSeleccionados.find(
      (p) => p.id === prestadorId
    );
    setPrestadoresSeleccionados(
      prestadoresSeleccionados.filter((p) => p.id !== prestadorId)
    );

    clientLogger.info("Prestador eliminado de la lista", {
      nombre: prestador?.nombre,
      totalSeleccionados: prestadoresSeleccionados.length - 1,
    });
  };

  // Limpiar todos los prestadores seleccionados
  const limpiarTodos = () => {
    setPrestadoresSeleccionados([]);
    clientLogger.info("Lista de prestadores limpiada");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (prestadoresSeleccionados.length === 0) {
      setResultado("❌ Seleccione al menos un prestador");
      return;
    }

    if (!validacionMensaje.valid) {
      setResultado(`❌ ${validacionMensaje.message}`);
      return;
    }

    try {
      setEnviando(true);
      setResultado("");

      const idsArray = prestadoresSeleccionados.map((p) => p.id);

      clientLogger.info("Enviando notificación masiva", {
        totalPrestadores: idsArray.length,
        prestadores: prestadoresSeleccionados.map((p) => p.nombre),
      });

      const result = await enviarNotificacionMasiva({
        usuarios_ids: idsArray,
        mensaje,
        tipo: tipoPlantilla,
      });

      if (result.success && result.data) {
        const { enviados, fallidos, total } = result.data.resumen;
        setResultado(
          `✅ ${enviados}/${total} mensajes enviados exitosamente${
            fallidos > 0 ? `, ${fallidos} fallidos` : ""
          }`
        );
        clientLogger.info("Notificación masiva completada", {
          total,
          enviados,
          fallidos,
        });

        // Limpiar formulario después de envío exitoso
        setMensaje("");
        setPrestadoresSeleccionados([]);
      } else {
        setResultado(`❌ Error: ${result.error}`);
        clientLogger.error("Error al enviar notificación masiva", result.error);
      }
    } catch (error) {
      setResultado("❌ Error al enviar notificaciones");
      clientLogger.error("Error crítico al enviar notificación masiva", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Envío Masivo
        </CardTitle>
        <CardDescription>
          Enviar el mismo mensaje a múltiples prestadores
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de prestadores */}
          <div className="space-y-2">
            <Label htmlFor="prestador">Agregar Prestadores *</Label>
            <div className="flex gap-2">
              <Select
                value={prestadorParaAgregar}
                onValueChange={setPrestadorParaAgregar}
                disabled={
                  cargandoPrestadores || prestadoresDisponibles.length === 0
                }
              >
                <SelectTrigger id="prestador" className="flex-1">
                  <SelectValue
                    placeholder={
                      cargandoPrestadores
                        ? "Cargando prestadores..."
                        : prestadoresDisponibles.length === 0
                        ? "Todos los prestadores ya están seleccionados"
                        : "Selecciona un prestador"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {prestadoresDisponibles.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre} - {formatearTelefono(p.telefono)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={agregarPrestador}
                disabled={!prestadorParaAgregar || cargandoPrestadores}
                variant="outline"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Lista de prestadores seleccionados */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                Prestadores Seleccionados ({prestadoresSeleccionados.length})
              </Label>
              {prestadoresSeleccionados.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={limpiarTodos}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Limpiar todos
                </Button>
              )}
            </div>

            {prestadoresSeleccionados.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  No hay prestadores seleccionados
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Selecciona prestadores del menú de arriba
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50 min-h-[120px] max-h-[300px] overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {prestadoresSeleccionados.map((prestador) => (
                    <Badge
                      key={prestador.id}
                      variant="secondary"
                      className="text-sm py-2 px-3 bg-blue-100 text-blue-800 hover:bg-blue-200 flex items-center gap-2"
                    >
                      <span className="font-medium">{prestador.nombre}</span>
                      <span className="text-xs text-blue-600">
                        {formatearTelefono(prestador.telefono)}
                      </span>
                      <button
                        type="button"
                        onClick={() => eliminarPrestador(prestador.id)}
                        className="ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                        title="Eliminar"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selector de tipo de plantilla */}
          <div className="space-y-2">
            <Label htmlFor="tipoPlantilla">Tipo de Mensaje *</Label>
            <Select
              value={tipoPlantilla}
              onValueChange={(v) => setTipoPlantilla(v as TipoPlantillaMasiva)}
            >
              <SelectTrigger id="tipoPlantilla">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recordatorio_generico">
                  💬 Recordatorio / Mensaje Libre
                </SelectItem>
                <SelectItem value="alerta_clima">
                  🌊 Alerta Meteorológica
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alert informativo sobre plantilla de clima */}
          {tipoPlantilla === "alerta_clima" && (
            <Alert
              className={
                condicionMeteorologica
                  ? "border-cyan-300 bg-cyan-50"
                  : "border-yellow-300 bg-yellow-50"
              }
            >
              {condicionMeteorologica ? (
                <CloudRain className="h-4 w-4 text-cyan-600" />
              ) : (
                <Info className="h-4 w-4 text-yellow-600" />
              )}
              <AlertTitle
                className={
                  condicionMeteorologica
                    ? "text-cyan-800 flex items-center justify-between"
                    : "text-yellow-800"
                }
              >
                <span>
                  {condicionMeteorologica
                    ? "🌊 Datos Meteorológicos en Tiempo Real"
                    : "⚠️ Sin Datos Meteorológicos"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={refrescarClima}
                  disabled={cargandoClima}
                  className="text-xs"
                >
                  <RotateCcw
                    className={`h-3 w-3 mr-1 ${
                      cargandoClima ? "animate-spin" : ""
                    }`}
                  />
                  {cargandoClima ? "Actualizando..." : "Actualizar"}
                </Button>
              </AlertTitle>
              <AlertDescription
                className={
                  condicionMeteorologica
                    ? "text-cyan-700 text-sm space-y-1"
                    : "text-yellow-700 text-sm"
                }
              >
                {condicionMeteorologica ? (
                  <>
                    <p>
                      La plantilla se completó con datos en tiempo real de la
                      API de clima:
                    </p>
                    <div className="mt-2 font-medium">
                      <p>
                        • Estado del puerto:{" "}
                        <strong className="uppercase">
                          {condicionMeteorologica.estado_puerto}
                        </strong>
                      </p>
                      <p>
                        • Oleaje:{" "}
                        <strong>{condicionMeteorologica.oleaje}m</strong>
                      </p>
                      <p>
                        • Viento:{" "}
                        <strong>
                          {condicionMeteorologica.viento_velocidad} km/h{" "}
                          {condicionMeteorologica.viento_direccion}
                        </strong>
                      </p>
                    </div>
                    <p className="text-xs mt-2 text-cyan-600">
                      El mensaje se enviará a todos los prestadores
                      seleccionados.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      No hay datos meteorológicos disponibles. La plantilla se
                      cargó con valores predeterminados.
                    </p>
                    <p className="text-xs mt-2">
                      Haz clic en &quot;Actualizar&quot; para obtener datos en
                      tiempo real o edita manualmente los valores.
                    </p>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Mensaje */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mensajeMasivo">
                Mensaje *
                {tipoPlantilla === "alerta_clima" && (
                  <span className="ml-2 text-xs text-blue-600">
                    {mensajeEditado ? "✏️ Editado" : "📝 Plantilla"}
                  </span>
                )}
              </Label>
              {mensajeEditado && tipoPlantilla === "alerta_clima" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={restaurarPlantilla}
                  className="text-xs"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Restaurar plantilla
                </Button>
              )}
            </div>
            <Textarea
              id="mensajeMasivo"
              placeholder={
                tipoPlantilla === "recordatorio_generico"
                  ? "Escribe el mensaje que se enviará a todos los prestadores seleccionados..."
                  : "La plantilla se cargó automáticamente. Puedes editarla si lo deseas..."
              }
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={8}
              required
              className={
                tipoPlantilla === "alerta_clima"
                  ? "resize-none font-mono text-sm"
                  : "resize-none"
              }
            />
            <p
              className={`text-sm ${
                validacionMensaje.valid ? "text-gray-600" : "text-red-600"
              }`}
            >
              {validacionMensaje.message}
            </p>
          </div>

          {resultado && (
            <Alert
              variant={
                resultado.includes("✅")
                  ? "default"
                  : resultado.includes("⚠️")
                  ? "default"
                  : "destructive"
              }
              className={
                resultado.includes("⚠️") ? "border-yellow-300 bg-yellow-50" : ""
              }
            >
              <AlertDescription>{resultado}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={
              enviando ||
              prestadoresSeleccionados.length === 0 ||
              !validacionMensaje.valid
            }
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {enviando
              ? "Enviando..."
              : `Enviar a ${prestadoresSeleccionados.length} Prestador(es)`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
