import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Send,
  Info,
  UserCircle2,
  RotateCcw,
  CloudRain,
  CalendarClock,
  Package,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { enviarNotificacion, getPrestadores } from "@/actions/notificaciones";
import { enviarEmail } from "@/actions/emails";
import { getCondicionActual } from "@/actions/clima";
import { getBrazaletesPrestador } from "@/actions/brazaletes";
import {
  TipoNotificacion,
  PrioridadNotificacion,
  PrestadorSelector,
  CanalNotificacion,
} from "@/lib/types/notificaciones";
import { CondicionMeteorologica } from "@/lib/types/clima";
import {
  validarMensajeLength,
  formatearTelefono,
  generarPreviewMensaje,
  getTituloTipoNotificacion,
} from "./utils";
import { clientLogger } from "@/lib/logger-client";

const isDevelopment = process.env.NODE_ENV === "development";
const numeroTest = process.env.NEXT_PUBLIC_TWILIO_TEST_NUMBER;

interface FormularioIndividualProps {
  canal: CanalNotificacion;
}

export function FormularioIndividual({ canal }: FormularioIndividualProps) {
  const [prestadores, setPrestadores] = useState<PrestadorSelector[]>([]);
  const [prestadorSeleccionado, setPrestadorSeleccionado] =
    useState<string>("");
  const [cargandoPrestadores, setCargandoPrestadores] = useState(true);
  const [condicionMeteorologica, setCondicionMeteorologica] =
    useState<CondicionMeteorologica | null>(null);
  const [cargandoClima, setCargandoClima] = useState(false);
  const [stockBrazaletes, setStockBrazaletes] = useState<number | null>(null);
  const [cargandoStock, setCargandoStock] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [asuntoEmail, setAsuntoEmail] = useState("");
  const [plantillaOriginal, setPlantillaOriginal] = useState("");
  const [tipo, setTipo] = useState<TipoNotificacion>("recordatorio_generico");
  const [prioridad, setPrioridad] = useState<PrioridadNotificacion>("media");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<string>("");

  const validacionMensaje = validarMensajeLength(mensaje);

  // Obtener prestador seleccionado completo
  const prestador = prestadores.find((p) => p.id === prestadorSeleccionado);

  // Verificar si el mensaje fue editado por el usuario
  const mensajeEditado =
    mensaje !== plantillaOriginal && plantillaOriginal !== "";

  // Cargar prestadores al montar el componente
  useEffect(() => {
    const cargarPrestadores = async () => {
      try {
        clientLogger.info("Cargando lista de prestadores");
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

  // Cargar stock de brazaletes cuando se selecciona un prestador
  useEffect(() => {
    if (!prestador) {
      setStockBrazaletes(null);
      return;
    }

    const cargarStock = async () => {
      try {
        setCargandoStock(true);
        clientLogger.info("Cargando stock de brazaletes del prestador", {
          prestadorId: prestador.id,
          prestadorNombre: prestador.nombre,
        });

        const result = await getBrazaletesPrestador(prestador.id);

        if (result.success && result.data) {
          const disponibles = result.data.brazaletes.disponibles;
          setStockBrazaletes(disponibles);

          clientLogger.info("Stock de brazaletes cargado", {
            prestador: prestador.nombre,
            disponibles,
          });
        } else {
          clientLogger.warn("No se pudo cargar el stock de brazaletes", {
            error: result.message,
          });
          setStockBrazaletes(null);
        }
      } catch (error) {
        clientLogger.error("Error al cargar stock de brazaletes", error);
        setStockBrazaletes(null);
      } finally {
        setCargandoStock(false);
      }
    };

    cargarStock();
  }, [prestador]);

  // Calcular días hasta vencimiento del permiso
  const calcularDiasHastaVencimiento = (
    fechaVencimiento: string
  ): number | null => {
    try {
      const hoy = new Date();
      const fechaVenc = new Date(fechaVencimiento);
      const diferencia = fechaVenc.getTime() - hoy.getTime();
      const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
      return dias;
    } catch {
      return null;
    }
  };

  // Auto-completar mensaje con plantilla cuando cambia el tipo
  useEffect(() => {
    if (tipo === "recordatorio_generico") {
      // Para recordatorios genéricos, dejar vacío
      setMensaje("");
      setPlantillaOriginal("");
      return;
    }

    // Preparar datos para la plantilla
    let datosPlantilla: Record<string, string | number> = {};

    // Si es alerta de clima, usar datos reales de la API
    if (tipo === "alerta_clima" && condicionMeteorologica) {
      datosPlantilla = {
        estado_puerto: condicionMeteorologica.estado_puerto.toUpperCase(),
        oleaje: condicionMeteorologica.oleaje,
        viento: condicionMeteorologica.viento_velocidad,
        viento_direccion: condicionMeteorologica.viento_direccion,
      };

      clientLogger.info("Usando datos meteorológicos en tiempo real", {
        oleaje: condicionMeteorologica.oleaje,
        viento: condicionMeteorologica.viento_velocidad,
        estadoPuerto: condicionMeteorologica.estado_puerto,
      });
    }

    // Si es permiso por vencer, usar datos reales del prestador seleccionado
    if (tipo === "permiso_por_vencer" && prestador?.fechaVencimientoPermiso) {
      const diasRestantes = calcularDiasHastaVencimiento(
        prestador.fechaVencimientoPermiso
      );

      if (diasRestantes !== null) {
        datosPlantilla = {
          nombre: prestador.nombre,
          dias: diasRestantes,
          fecha_vencimiento: prestador.fechaVencimientoPermiso,
        };

        clientLogger.info("Usando datos de permiso del prestador", {
          prestador: prestador.nombre,
          diasRestantes,
          fechaVencimiento: prestador.fechaVencimientoPermiso,
        });
      }
    }

    // Si es stock bajo, usar datos reales del stock del prestador
    if (tipo === "stock_brazaletes_bajo" && stockBrazaletes !== null) {
      datosPlantilla = {
        nombre: prestador?.nombre || "Prestador",
        cantidad: stockBrazaletes,
      };

      clientLogger.info("Usando datos de stock del prestador", {
        prestador: prestador?.nombre,
        stockDisponible: stockBrazaletes,
      });
    }

    // Generar plantilla según el tipo con datos reales
    const plantilla = generarPreviewMensaje(tipo, datosPlantilla);
    setMensaje(plantilla);
    setPlantillaOriginal(plantilla);

    clientLogger.info("Plantilla auto-cargada", {
      tipo,
      conDatosReales:
        (tipo === "alerta_clima" && !!condicionMeteorologica) ||
        (tipo === "permiso_por_vencer" &&
          !!prestador?.fechaVencimientoPermiso) ||
        (tipo === "stock_brazaletes_bajo" && stockBrazaletes !== null),
      longitudPlantilla: plantilla.length,
    });
  }, [tipo, condicionMeteorologica, prestador, stockBrazaletes]);

  // Función para restaurar la plantilla original
  const restaurarPlantilla = () => {
    setMensaje(plantillaOriginal);
    clientLogger.info("Plantilla restaurada", { tipo });
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
        if (tipo === "alerta_clima") {
          const datosPlantilla = {
            estado_puerto: result.data.condicion.estado_puerto.toUpperCase(),
            oleaje: result.data.condicion.oleaje,
            viento: result.data.condicion.viento_velocidad,
            viento_direccion: result.data.condicion.viento_direccion,
          };

          const plantilla = generarPreviewMensaje(tipo, datosPlantilla);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prestador) {
      setResultado("❌ Debe seleccionar un prestador");
      return;
    }

    // Validar que tenga teléfono si se va a enviar por WhatsApp
    if (
      canal !== "email" &&
      (!prestador.telefono || prestador.telefono.trim() === "")
    ) {
      setResultado(
        "❌ El prestador seleccionado no tiene teléfono registrado para WhatsApp"
      );
      return;
    }

    // Validar que tenga email si se va a enviar por Email
    if (
      canal !== "whatsapp" &&
      (!prestador.email || prestador.email.trim() === "")
    ) {
      setResultado("❌ El prestador seleccionado no tiene email registrado");
      return;
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

      if (canal === "whatsapp") {
        // Enviar solo por WhatsApp
        clientLogger.info("Enviando notificación por WhatsApp", {
          prestadorId: prestador.id,
          prestadorNombre: prestador.nombre,
          telefono: prestador.telefono,
          tipo,
          prioridad,
        });

        const result = await enviarNotificacion({
          telefono: prestador.telefono,
          mensaje,
          tipo,
          prioridad,
        });

        if (result.success) {
          setResultado(
            `✅ WhatsApp enviado exitosamente a ${prestador.nombre}`
          );
          clientLogger.info("WhatsApp enviado", {
            messageId: result.data?.message_id,
            prestador: prestador.nombre,
          });
          setMensaje("");
          setAsuntoEmail("");
        } else {
          setResultado(`❌ Error: ${result.error}`);
          clientLogger.error("Error al enviar WhatsApp", result.error);
        }
      } else if (canal === "email") {
        // Enviar solo por Email
        clientLogger.info("Enviando email", {
          prestadorId: prestador.id,
          prestadorNombre: prestador.nombre,
          email: prestador.email,
          asunto: asuntoEmail,
          tipo,
          prioridad,
        });

        const result = await enviarEmail({
          email: prestador.email,
          asunto: asuntoEmail,
          mensaje,
          tipo,
          prioridad,
          esHtml: false,
        });

        if (result.success) {
          setResultado(`✅ Email enviado exitosamente a ${prestador.nombre}`);
          clientLogger.info("Email enviado", {
            messageId: result.data?.message_id,
            prestador: prestador.nombre,
          });
          setMensaje("");
          setAsuntoEmail("");
        } else {
          setResultado(`❌ Error: ${result.error}`);
          clientLogger.error("Error al enviar email", result.error);
        }
      } else {
        // Enviar por ambos canales
        clientLogger.info("Enviando por ambos canales", {
          prestadorId: prestador.id,
          prestadorNombre: prestador.nombre,
          telefono: prestador.telefono,
          email: prestador.email,
        });

        const [whatsappResult, emailResult] = await Promise.all([
          enviarNotificacion({
            telefono: prestador.telefono,
            mensaje,
            tipo,
            prioridad,
          }),
          enviarEmail({
            email: prestador.email,
            asunto: asuntoEmail,
            mensaje,
            tipo,
            prioridad,
            esHtml: false,
          }),
        ]);

        const whatsappExito = whatsappResult.success;
        const emailExito = emailResult.success;

        if (whatsappExito && emailExito) {
          setResultado(
            `✅ Mensaje enviado por ambos canales a ${prestador.nombre}`
          );
          setMensaje("");
          setAsuntoEmail("");
        } else if (whatsappExito && !emailExito) {
          setResultado(
            `⚠️ WhatsApp enviado, pero Email falló: ${emailResult.error}`
          );
        } else if (!whatsappExito && emailExito) {
          setResultado(
            `⚠️ Email enviado, pero WhatsApp falló: ${whatsappResult.error}`
          );
        } else {
          setResultado(
            `❌ Ambos canales fallaron. WhatsApp: ${whatsappResult.error}, Email: ${emailResult.error}`
          );
        }

        clientLogger.info("Envío multi-canal completado", {
          whatsappExito,
          emailExito,
        });
      }
    } catch (error) {
      setResultado("❌ Error al enviar notificación");
      clientLogger.error("Error crítico al enviar notificación", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {canal === "whatsapp" && <MessageSquare className="h-5 w-5" />}
          {canal === "email" && <Mail className="h-5 w-5" />}
          {canal === "ambos" && <Send className="h-5 w-5" />}
          Envío Individual
        </CardTitle>
        <CardDescription>
          {canal === "whatsapp" &&
            "Enviar mensaje de WhatsApp a un prestador específico"}
          {canal === "email" && "Enviar email a un prestador específico"}
          {canal === "ambos" &&
            "Enviar mensaje por WhatsApp y Email simultáneamente"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector de Prestador */}
          <div className="space-y-2">
            <Label htmlFor="prestador">Prestador *</Label>
            <Select
              value={prestadorSeleccionado}
              onValueChange={setPrestadorSeleccionado}
              disabled={cargandoPrestadores}
            >
              <SelectTrigger id="prestador">
                <SelectValue
                  placeholder={
                    cargandoPrestadores
                      ? "Cargando prestadores..."
                      : "Selecciona un prestador"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {prestadores.length === 0 && !cargandoPrestadores ? (
                  <SelectItem value="sin-prestadores" disabled>
                    No hay prestadores disponibles
                  </SelectItem>
                ) : (
                  prestadores.map((p) => {
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
                  })
                )}
              </SelectContent>
            </Select>

            {/* Leyenda de iconos */}
            <div className="flex items-center gap-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <span>📱 = Teléfono</span>
              <span>📧 = Email</span>
              <span>⚠️ = Sin datos</span>
            </div>

            {/* Información del prestador seleccionado */}
            {prestador && (
              <Alert
                className={
                  ((canal === "whatsapp" || canal === "ambos") &&
                    !prestador.telefono) ||
                  ((canal === "email" || canal === "ambos") && !prestador.email)
                    ? "border-orange-300 bg-orange-50"
                    : "border-blue-300 bg-blue-50"
                }
              >
                <UserCircle2
                  className={
                    ((canal === "whatsapp" || canal === "ambos") &&
                      !prestador.telefono) ||
                    ((canal === "email" || canal === "ambos") &&
                      !prestador.email)
                      ? "h-4 w-4 text-orange-600"
                      : "h-4 w-4 text-blue-600"
                  }
                />
                <AlertTitle
                  className={
                    ((canal === "whatsapp" || canal === "ambos") &&
                      !prestador.telefono) ||
                    ((canal === "email" || canal === "ambos") &&
                      !prestador.email)
                      ? "text-orange-800"
                      : "text-blue-800"
                  }
                >
                  Prestador Seleccionado
                </AlertTitle>
                <AlertDescription
                  className={
                    ((canal === "whatsapp" || canal === "ambos") &&
                      !prestador.telefono) ||
                    ((canal === "email" || canal === "ambos") &&
                      !prestador.email)
                      ? "text-orange-700 space-y-1"
                      : "text-blue-700 space-y-1"
                  }
                >
                  <p>
                    <strong>Nombre:</strong> {prestador.nombre}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Teléfono:</strong>{" "}
                    {prestador.telefono && prestador.telefono.trim() !== "" ? (
                      <>
                        {formatearTelefono(prestador.telefono)}
                        <span className="text-xs">📱</span>
                      </>
                    ) : (
                      <span className="text-red-600 text-sm">
                        ⚠️ No registrado
                      </span>
                    )}
                  </p>
                  <p className="flex items-center gap-2">
                    <strong>Email:</strong>{" "}
                    {prestador.email && prestador.email.trim() !== "" ? (
                      <>
                        {prestador.email}
                        <span className="text-xs">📧</span>
                      </>
                    ) : (
                      <span className="text-red-600 text-sm">
                        ⚠️ No registrado
                      </span>
                    )}
                  </p>
                  {prestador.empresa && (
                    <p>
                      <strong>Empresa:</strong> {prestador.empresa}
                    </p>
                  )}

                  {/* Advertencias específicas por canal */}
                  {canal === "whatsapp" && !prestador.telefono && (
                    <p className="text-orange-800 font-semibold text-sm mt-2">
                      ⚠️ No se puede enviar WhatsApp: sin teléfono
                    </p>
                  )}
                  {canal === "email" && !prestador.email && (
                    <p className="text-orange-800 font-semibold text-sm mt-2">
                      ⚠️ No se puede enviar Email: sin email
                    </p>
                  )}
                  {canal === "ambos" &&
                    (!prestador.telefono || !prestador.email) && (
                      <p className="text-orange-800 font-semibold text-sm mt-2">
                        ⚠️ Falta{" "}
                        {!prestador.telefono && !prestador.email
                          ? "teléfono y email"
                          : !prestador.telefono
                          ? "teléfono"
                          : "email"}
                      </p>
                    )}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Notificación</Label>
              <Select
                value={tipo}
                onValueChange={(v) => setTipo(v as TipoNotificacion)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recordatorio_generico">
                    Recordatorio
                  </SelectItem>
                  <SelectItem value="alerta_clima">Alerta Clima</SelectItem>
                  <SelectItem value="permiso_por_vencer">
                    Permiso por Vencer
                  </SelectItem>
                  <SelectItem value="confirmacion_salida">
                    Confirmación Salida
                  </SelectItem>
                  <SelectItem value="stock_brazaletes_bajo">
                    Stock Bajo
                  </SelectItem>
                  <SelectItem value="bienvenida">Bienvenida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridad">Prioridad</Label>
              <Select
                value={prioridad}
                onValueChange={(v) => setPrioridad(v as PrioridadNotificacion)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alert informativo sobre plantillas */}
          {tipo !== "recordatorio_generico" && (
            <Alert
              className={
                tipo === "alerta_clima" && condicionMeteorologica
                  ? "border-cyan-300 bg-cyan-50"
                  : tipo === "alerta_clima" && !condicionMeteorologica
                  ? "border-yellow-300 bg-yellow-50"
                  : tipo === "permiso_por_vencer" &&
                    prestador?.fechaVencimientoPermiso
                  ? "border-purple-300 bg-purple-50"
                  : tipo === "permiso_por_vencer" &&
                    !prestador?.fechaVencimientoPermiso
                  ? "border-yellow-300 bg-yellow-50"
                  : tipo === "stock_brazaletes_bajo" && stockBrazaletes !== null
                  ? "border-orange-300 bg-orange-50"
                  : tipo === "stock_brazaletes_bajo" && stockBrazaletes === null
                  ? "border-yellow-300 bg-yellow-50"
                  : "border-green-300 bg-green-50"
              }
            >
              {tipo === "alerta_clima" && condicionMeteorologica ? (
                <CloudRain className="h-4 w-4 text-cyan-600" />
              ) : tipo === "alerta_clima" && !condicionMeteorologica ? (
                <Info className="h-4 w-4 text-yellow-600" />
              ) : tipo === "permiso_por_vencer" &&
                prestador?.fechaVencimientoPermiso ? (
                <CalendarClock className="h-4 w-4 text-purple-600" />
              ) : tipo === "permiso_por_vencer" &&
                !prestador?.fechaVencimientoPermiso ? (
                <Info className="h-4 w-4 text-yellow-600" />
              ) : tipo === "stock_brazaletes_bajo" &&
                stockBrazaletes !== null ? (
                <Package className="h-4 w-4 text-orange-600" />
              ) : tipo === "stock_brazaletes_bajo" &&
                stockBrazaletes === null ? (
                <Info className="h-4 w-4 text-yellow-600" />
              ) : (
                <Info className="h-4 w-4 text-green-600" />
              )}
              <AlertTitle
                className={
                  (tipo === "alerta_clima" && condicionMeteorologica) ||
                  (tipo === "permiso_por_vencer" &&
                    prestador?.fechaVencimientoPermiso) ||
                  (tipo === "stock_brazaletes_bajo" && stockBrazaletes !== null)
                    ? "flex items-center justify-between" +
                      (tipo === "alerta_clima"
                        ? " text-cyan-800"
                        : tipo === "permiso_por_vencer"
                        ? " text-purple-800"
                        : " text-orange-800")
                    : tipo === "alerta_clima" && !condicionMeteorologica
                    ? "text-yellow-800"
                    : tipo === "permiso_por_vencer" &&
                      !prestador?.fechaVencimientoPermiso
                    ? "text-yellow-800"
                    : tipo === "stock_brazaletes_bajo" &&
                      stockBrazaletes === null
                    ? "text-yellow-800"
                    : "text-green-800"
                }
              >
                <span>
                  {tipo === "alerta_clima" && condicionMeteorologica
                    ? "🌊 Datos Meteorológicos en Tiempo Real"
                    : tipo === "alerta_clima" && !condicionMeteorologica
                    ? "⚠️ Sin Datos Meteorológicos"
                    : tipo === "permiso_por_vencer" &&
                      prestador?.fechaVencimientoPermiso
                    ? "📅 Datos de Permiso en Tiempo Real"
                    : tipo === "permiso_por_vencer" &&
                      !prestador?.fechaVencimientoPermiso
                    ? "⚠️ Sin Información de Permiso"
                    : tipo === "stock_brazaletes_bajo" &&
                      stockBrazaletes !== null
                    ? "📦 Datos de Inventario en Tiempo Real"
                    : tipo === "stock_brazaletes_bajo" &&
                      stockBrazaletes === null
                    ? "⚠️ Cargando Stock de Brazaletes..."
                    : "📝 Plantilla Auto-cargada"}
                </span>
                {tipo === "alerta_clima" && (
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
                )}
              </AlertTitle>
              <AlertDescription
                className={
                  tipo === "alerta_clima" && condicionMeteorologica
                    ? "text-cyan-700 text-sm space-y-1"
                    : tipo === "alerta_clima" && !condicionMeteorologica
                    ? "text-yellow-700 text-sm"
                    : tipo === "permiso_por_vencer" &&
                      prestador?.fechaVencimientoPermiso
                    ? "text-purple-700 text-sm space-y-1"
                    : tipo === "permiso_por_vencer" &&
                      !prestador?.fechaVencimientoPermiso
                    ? "text-yellow-700 text-sm"
                    : tipo === "stock_brazaletes_bajo" &&
                      stockBrazaletes !== null
                    ? "text-orange-700 text-sm space-y-1"
                    : tipo === "stock_brazaletes_bajo" &&
                      stockBrazaletes === null
                    ? "text-yellow-700 text-sm"
                    : "text-green-700 text-sm"
                }
              >
                {tipo === "alerta_clima" && condicionMeteorologica ? (
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
                      Puedes editar el mensaje o agregar información adicional.
                    </p>
                  </>
                ) : tipo === "alerta_clima" && !condicionMeteorologica ? (
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
                ) : tipo === "permiso_por_vencer" &&
                  prestador?.fechaVencimientoPermiso ? (
                  <>
                    <p>
                      La plantilla se completó con datos en tiempo real del
                      prestador seleccionado:
                    </p>
                    <div className="mt-2 font-medium">
                      <p>
                        • Prestador: <strong>{prestador.nombre}</strong>
                      </p>
                      <p>
                        • Días restantes:{" "}
                        <strong>
                          {calcularDiasHastaVencimiento(
                            prestador.fechaVencimientoPermiso
                          )}{" "}
                          días
                        </strong>
                      </p>
                      <p>
                        • Fecha de vencimiento:{" "}
                        <strong>{prestador.fechaVencimientoPermiso}</strong>
                      </p>
                      <p>
                        • Estado:{" "}
                        <strong
                          className={
                            prestador.estadoPermiso === "por_vencer"
                              ? "text-orange-700"
                              : prestador.estadoPermiso === "vencido"
                              ? "text-red-700"
                              : "text-green-700"
                          }
                        >
                          {prestador.estadoPermiso === "por_vencer"
                            ? "Por Vencer"
                            : prestador.estadoPermiso === "vencido"
                            ? "Vencido"
                            : "Vigente"}
                        </strong>
                      </p>
                    </div>
                    <p className="text-xs mt-2 text-purple-600">
                      El mensaje personalizado está listo para enviar. Puedes
                      editarlo si lo deseas.
                    </p>
                  </>
                ) : tipo === "permiso_por_vencer" &&
                  !prestador?.fechaVencimientoPermiso ? (
                  <>
                    <p>
                      El prestador seleccionado no tiene información de permiso
                      registrada. La plantilla se cargó con valores
                      predeterminados.
                    </p>
                    <p className="text-xs mt-2">
                      Edita manualmente los valores o selecciona otro prestador.
                    </p>
                  </>
                ) : tipo === "stock_brazaletes_bajo" &&
                  stockBrazaletes !== null ? (
                  <>
                    <p>
                      La plantilla se completó con datos en tiempo real del
                      inventario del prestador:
                    </p>
                    <div className="mt-2 font-medium">
                      <p>
                        • Prestador:{" "}
                        <strong>{prestador?.nombre || "N/A"}</strong>
                      </p>
                      <p>
                        • Brazaletes disponibles:{" "}
                        <strong
                          className={
                            stockBrazaletes < 10
                              ? "text-red-700"
                              : stockBrazaletes < 30
                              ? "text-orange-700"
                              : "text-green-700"
                          }
                        >
                          {stockBrazaletes} brazaletes
                        </strong>
                      </p>
                      <p>
                        • Estado:{" "}
                        <strong
                          className={
                            stockBrazaletes < 10
                              ? "text-red-700"
                              : stockBrazaletes < 30
                              ? "text-orange-700"
                              : "text-green-700"
                          }
                        >
                          {stockBrazaletes < 10
                            ? "Crítico"
                            : stockBrazaletes < 30
                            ? "Bajo"
                            : "Normal"}
                        </strong>
                      </p>
                    </div>
                    <p className="text-xs mt-2 text-orange-600">
                      El mensaje está listo con el stock actual del prestador.
                    </p>
                  </>
                ) : tipo === "stock_brazaletes_bajo" &&
                  stockBrazaletes === null ? (
                  <>
                    <p>
                      {cargandoStock
                        ? "Cargando información de stock de brazaletes..."
                        : "No se pudo cargar el stock de brazaletes. La plantilla se cargó con valores predeterminados."}
                    </p>
                    <p className="text-xs mt-2">
                      {!cargandoStock &&
                        "Edita manualmente los valores o intenta más tarde."}
                    </p>
                  </>
                ) : (
                  <>
                    El mensaje se completó automáticamente con la plantilla de{" "}
                    <strong>{getTituloTipoNotificacion(tipo)}</strong>. Puedes
                    editarlo libremente o restaurarlo con el botón.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Campo de Asunto (solo para Email y Ambos) */}
          {canal !== "whatsapp" && (
            <div className="space-y-2">
              <Label htmlFor="asunto">Asunto del Email *</Label>
              <Input
                id="asunto"
                type="text"
                placeholder="Ej: Alerta Meteorológica - Isla Lobos"
                value={asuntoEmail}
                onChange={(e) => setAsuntoEmail(e.target.value)}
                required={canal === "email" || canal === "ambos"}
                className="font-medium"
              />
              <p className="text-xs text-gray-600">
                El asunto aparecerá en la bandeja de entrada del destinatario
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="mensaje">
                Mensaje *
                {tipo !== "recordatorio_generico" && (
                  <span className="ml-2 text-xs text-blue-600">
                    {mensajeEditado ? "✏️ Editado" : "📝 Plantilla"}
                  </span>
                )}
              </Label>
              {mensajeEditado && (
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
              id="mensaje"
              placeholder={
                tipo === "recordatorio_generico"
                  ? "Escribe tu mensaje personalizado aquí..."
                  : "La plantilla se cargó automáticamente. Puedes editarla si lo deseas..."
              }
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={8}
              required
              className="resize-none font-mono text-sm"
            />
            <div className="flex items-center justify-between">
              <p
                className={`text-sm ${
                  validacionMensaje.valid ? "text-gray-600" : "text-red-600"
                }`}
              >
                {validacionMensaje.message}
              </p>
              {tipo !== "recordatorio_generico" && (
                <p className="text-xs text-gray-500">
                  {getTituloTipoNotificacion(tipo)}
                </p>
              )}
            </div>
          </div>

          {prestador && isDevelopment && numeroTest && canal !== "email" && (
            <Alert className="border-amber-300 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">
                🧪 Modo Desarrollo - WhatsApp
              </AlertTitle>
              <AlertDescription className="text-amber-700 space-y-1">
                <p>
                  <strong>Destinatario original:</strong>{" "}
                  {formatearTelefono(prestador.telefono)}
                </p>
                <p>
                  <strong>Se enviará a:</strong> {numeroTest} (número de prueba)
                </p>
              </AlertDescription>
            </Alert>
          )}

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
              !prestador ||
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
              ? "Enviar WhatsApp"
              : canal === "email"
              ? "Enviar Email"
              : "Enviar por Ambos Canales"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
