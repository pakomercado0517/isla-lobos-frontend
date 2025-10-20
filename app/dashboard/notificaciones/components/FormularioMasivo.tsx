import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  MessageSquare,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  enviarNotificacionMasiva,
  getPrestadores,
} from "@/actions/notificaciones";
import { enviarEmailMasivo } from "@/actions/emails";
import { getCondicionActual } from "@/actions/clima";
import {
  PrestadorSelector,
  CanalNotificacion,
} from "@/lib/types/notificaciones";
import { CondicionMeteorologica } from "@/lib/types/clima";
import {
  validarMensajeLength,
  validarEmail,
  generarPreviewMensaje,
} from "./utils";
import { clientLogger } from "@/lib/logger-client";

type TipoPlantillaMasiva = "alerta_clima" | "recordatorio_generico";

interface FormularioMasivoProps {
  canal: CanalNotificacion;
}

export function FormularioMasivo({ canal }: FormularioMasivoProps) {
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
  const [asuntoEmail, setAsuntoEmail] = useState("");
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

    // Validar que los prestadores tengan los datos necesarios según el canal
    if (canal === "whatsapp" || canal === "ambos") {
      const sinTelefono = prestadoresSeleccionados.filter(
        (p) => !p.telefono || p.telefono.trim() === ""
      );
      if (sinTelefono.length > 0) {
        setResultado(
          `❌ ${sinTelefono.length} prestador(es) sin teléfono: ${sinTelefono
            .map((p) => p.nombre)
            .join(", ")}`
        );
        return;
      }
    }

    if (canal === "email" || canal === "ambos") {
      const sinEmail = prestadoresSeleccionados.filter(
        (p) => !p.email || p.email.trim() === ""
      );
      if (sinEmail.length > 0) {
        setResultado(
          `❌ ${sinEmail.length} prestador(es) sin email: ${sinEmail
            .map((p) => p.nombre)
            .join(", ")}`
        );
        return;
      }

      // Validar formato de emails
      const emailsInvalidos = prestadoresSeleccionados.filter(
        (p) => p.email && !validarEmail(p.email)
      );
      if (emailsInvalidos.length > 0) {
        setResultado(
          `❌ ${
            emailsInvalidos.length
          } prestador(es) con email inválido: ${emailsInvalidos
            .map((p) => `${p.nombre} (${p.email})`)
            .join(", ")}`
        );
        return;
      }
    }

    if (!validacionMensaje.valid) {
      setResultado(`❌ ${validacionMensaje.message}`);
      return;
    }

    // Validar asunto para emails
    if (canal !== "whatsapp" && !asuntoEmail.trim()) {
      setResultado("❌ El asunto es requerido para emails");
      return;
    }

    try {
      setEnviando(true);
      setResultado("");

      const idsArray = prestadoresSeleccionados.map((p) => p.id);

      if (canal === "whatsapp") {
        // Enviar solo por WhatsApp
        clientLogger.info("Enviando notificación masiva por WhatsApp", {
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
            `✅ WhatsApp: ${enviados}/${total} mensajes enviados${
              fallidos > 0 ? `, ${fallidos} fallidos` : ""
            }`
          );
          setMensaje("");
          setAsuntoEmail("");
          setPrestadoresSeleccionados([]);
        } else {
          setResultado(`❌ Error: ${result.error}`);
        }
      } else if (canal === "email") {
        // Enviar solo por Email
        clientLogger.info("Enviando emails masivos", {
          totalPrestadores: idsArray.length,
          asunto: asuntoEmail,
        });

        const result = await enviarEmailMasivo({
          usuarios_ids: idsArray,
          asunto: asuntoEmail,
          mensaje,
          tipo: tipoPlantilla,
          html: false,
        });

        if (result.success && result.data) {
          const { enviados, fallidos, total } = result.data.resumen;
          setResultado(
            `✅ Email: ${enviados}/${total} emails enviados${
              fallidos > 0 ? `, ${fallidos} fallidos` : ""
            }`
          );
          setMensaje("");
          setAsuntoEmail("");
          setPrestadoresSeleccionados([]);
        } else {
          // Mostrar error más específico del backend
          const errorMessage =
            result.error || "Error desconocido al enviar emails masivos";
          setResultado(`❌ Error al enviar emails: ${errorMessage}`);
          clientLogger.error("Error al enviar emails masivos", {
            error: result.error,
            totalPrestadores: idsArray.length,
            asunto: asuntoEmail,
          });
        }
      } else {
        // Enviar por ambos canales
        clientLogger.info("Enviando por ambos canales (masivo)", {
          totalPrestadores: idsArray.length,
        });

        const [whatsappResult, emailResult] = await Promise.all([
          enviarNotificacionMasiva({
            usuarios_ids: idsArray,
            mensaje,
            tipo: tipoPlantilla,
          }),
          enviarEmailMasivo({
            usuarios_ids: idsArray,
            asunto: asuntoEmail,
            mensaje,
            tipo: tipoPlantilla,
            html: false,
          }),
        ]);

        const whatsappEnviados = whatsappResult.data?.resumen.enviados || 0;
        const emailEnviados = emailResult.data?.resumen.enviados || 0;
        const whatsappTotal = whatsappResult.data?.resumen.total || 0;
        const emailTotal = emailResult.data?.resumen.total || 0;

        if (whatsappResult.success && emailResult.success) {
          setResultado(
            `✅ Envío completado - WhatsApp: ${whatsappEnviados}/${whatsappTotal}, Email: ${emailEnviados}/${emailTotal}`
          );
          setMensaje("");
          setAsuntoEmail("");
          setPrestadoresSeleccionados([]);
        } else if (whatsappResult.success && !emailResult.success) {
          setResultado(
            `⚠️ WhatsApp enviado (${whatsappEnviados}/${whatsappTotal}), pero Email falló: ${emailResult.error}`
          );
        } else if (!whatsappResult.success && emailResult.success) {
          setResultado(
            `⚠️ Email enviado (${emailEnviados}/${emailTotal}), pero WhatsApp falló: ${whatsappResult.error}`
          );
        } else {
          setResultado(
            `❌ Ambos canales fallaron. WhatsApp: ${whatsappResult.error}, Email: ${emailResult.error}`
          );
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setResultado(
        `❌ Error crítico al enviar notificaciones: ${errorMessage}`
      );
      clientLogger.error("Error crítico al enviar notificación masiva", {
        error: errorMessage,
        totalPrestadores: prestadoresSeleccionados.length,
        canal,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {canal === "whatsapp" && (
            <MessageSquare className="h-5 w-5 text-teal-600" />
          )}
          {canal === "email" && <Mail className="h-5 w-5 text-blue-600" />}
          {canal === "ambos" && <Users className="h-5 w-5 text-purple-600" />}
          Envío Masivo
        </CardTitle>
        <CardDescription>
          {canal === "whatsapp" &&
            "Enviar el mismo mensaje de WhatsApp a múltiples prestadores"}
          {canal === "email" && "Enviar el mismo email a múltiples prestadores"}
          {canal === "ambos" &&
            "Enviar por WhatsApp y Email a múltiples prestadores"}
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
                  {prestadoresDisponibles.map((p) => {
                    const tieneTelefono =
                      p.telefono && p.telefono.trim() !== "";
                    const tieneEmail = p.email && p.email.trim() !== "";

                    return (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{p.nombre}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            {tieneTelefono && "📱"}
                            {tieneEmail && "📧"}
                            {!tieneTelefono && !tieneEmail && "⚠️"}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
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

          {/* Leyenda de iconos */}
          <div className="flex items-center gap-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <span>📱 = Teléfono</span>
            <span>📧 = Email</span>
            <span>⚠️ = Falta dato necesario</span>
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
                  {prestadoresSeleccionados.map((prestador) => {
                    const tieneTelefono =
                      prestador.telefono && prestador.telefono.trim() !== "";
                    const tieneEmail =
                      prestador.email && prestador.email.trim() !== "";
                    const faltaDatos =
                      (canal === "whatsapp" && !tieneTelefono) ||
                      (canal === "email" && !tieneEmail) ||
                      (canal === "ambos" && (!tieneTelefono || !tieneEmail));

                    return (
                      <Badge
                        key={prestador.id}
                        variant="secondary"
                        className={`text-sm py-2 px-3 flex items-center gap-2 ${
                          faltaDatos
                            ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                      >
                        <span className="font-medium">{prestador.nombre}</span>
                        <span className="text-xs flex items-center gap-1">
                          {tieneTelefono && "📱"}
                          {tieneEmail && "📧"}
                          {faltaDatos && "⚠️"}
                        </span>
                        <button
                          type="button"
                          onClick={() => eliminarPrestador(prestador.id)}
                          className={`ml-1 rounded-full p-0.5 transition-colors ${
                            faltaDatos
                              ? "hover:bg-orange-300"
                              : "hover:bg-blue-300"
                          }`}
                          title="Eliminar"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
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

          {/* Campo de Asunto (solo para Email y Ambos) */}
          {canal !== "whatsapp" && (
            <div className="space-y-2">
              <Label htmlFor="asuntoMasivo">Asunto del Email *</Label>
              <Input
                id="asuntoMasivo"
                type="text"
                placeholder="Ej: Alerta Meteorológica - Isla Lobos"
                value={asuntoEmail}
                onChange={(e) => setAsuntoEmail(e.target.value)}
                required={canal === "email" || canal === "ambos"}
                className="font-medium"
              />
              <p className="text-xs text-gray-600">
                El mismo asunto se usará para todos los destinatarios
              </p>
            </div>
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
                resultado.includes("⚠️")
                  ? "border-yellow-300 bg-yellow-50"
                  : resultado.includes("❌")
                  ? "border-red-300 bg-red-50"
                  : "border-green-300 bg-green-50"
              }
            >
              <AlertDescription
                className={
                  resultado.includes("❌")
                    ? "text-red-800 font-medium"
                    : resultado.includes("⚠️")
                    ? "text-yellow-800 font-medium"
                    : "text-green-800 font-medium"
                }
              >
                {resultado}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={
              enviando ||
              prestadoresSeleccionados.length === 0 ||
              !validacionMensaje.valid ||
              (canal !== "whatsapp" && !asuntoEmail.trim())
            }
            className={`w-full ${
              canal === "whatsapp"
                ? "bg-teal-600 hover:bg-teal-700"
                : canal === "email"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {canal === "whatsapp" && <MessageSquare className="h-4 w-4 mr-2" />}
            {canal === "email" && <Mail className="h-4 w-4 mr-2" />}
            {canal === "ambos" && <Send className="h-4 w-4 mr-2" />}
            {enviando
              ? "Enviando..."
              : canal === "whatsapp"
              ? `Enviar WhatsApp a ${prestadoresSeleccionados.length} Prestador(es)`
              : canal === "email"
              ? `Enviar Email a ${prestadoresSeleccionados.length} Prestador(es)`
              : `Enviar por Ambos Canales a ${prestadoresSeleccionados.length} Prestador(es)`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
