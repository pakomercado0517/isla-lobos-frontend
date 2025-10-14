import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
import { Send, Info, UserCircle2, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { enviarNotificacion, getPrestadores } from "@/actions/notificaciones";
import {
  TipoNotificacion,
  PrioridadNotificacion,
  PrestadorSelector,
} from "@/lib/types/notificaciones";
import {
  validarMensajeLength,
  formatearTelefono,
  generarPreviewMensaje,
  getTituloTipoNotificacion,
} from "./utils";
import { clientLogger } from "@/lib/logger-client";

const isDevelopment = process.env.NODE_ENV === "development";
const numeroTest = process.env.NEXT_PUBLIC_TWILIO_TEST_NUMBER;

export function FormularioIndividual() {
  const [prestadores, setPrestadores] = useState<PrestadorSelector[]>([]);
  const [prestadorSeleccionado, setPrestadorSeleccionado] =
    useState<string>("");
  const [cargandoPrestadores, setCargandoPrestadores] = useState(true);
  const [mensaje, setMensaje] = useState("");
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

  // Auto-completar mensaje con plantilla cuando cambia el tipo
  useEffect(() => {
    if (tipo === "recordatorio_generico") {
      // Para recordatorios genéricos, dejar vacío
      setMensaje("");
      setPlantillaOriginal("");
      return;
    }

    // Generar plantilla según el tipo
    const plantilla = generarPreviewMensaje(tipo, {});
    setMensaje(plantilla);
    setPlantillaOriginal(plantilla);

    clientLogger.info("Plantilla auto-cargada", {
      tipo,
      longitudPlantilla: plantilla.length,
    });
  }, [tipo]);

  // Función para restaurar la plantilla original
  const restaurarPlantilla = () => {
    setMensaje(plantillaOriginal);
    clientLogger.info("Plantilla restaurada", { tipo });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prestador) {
      setResultado("❌ Debe seleccionar un prestador");
      return;
    }

    if (!validacionMensaje.valid) {
      setResultado(`❌ ${validacionMensaje.message}`);
      return;
    }

    try {
      setEnviando(true);
      setResultado("");

      clientLogger.info("Enviando notificación individual", {
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
          `✅ Notificación enviada exitosamente a ${prestador.nombre}`
        );
        clientLogger.info("Notificación enviada", {
          messageId: result.data?.message_id,
          prestador: prestador.nombre,
        });

        // Limpiar formulario
        setMensaje("");
      } else {
        setResultado(`❌ Error: ${result.error}`);
        clientLogger.error("Error al enviar notificación", result.error);
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
        <CardTitle>Envío Individual</CardTitle>
        <CardDescription>
          Enviar mensaje de WhatsApp a un prestador específico
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
                  prestadores.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre} - {formatearTelefono(p.telefono)}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Información del prestador seleccionado */}
            {prestador && (
              <Alert className="border-blue-300 bg-blue-50">
                <UserCircle2 className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">
                  Prestador Seleccionado
                </AlertTitle>
                <AlertDescription className="text-blue-700 space-y-1">
                  <p>
                    <strong>Nombre:</strong> {prestador.nombre}
                  </p>
                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {formatearTelefono(prestador.telefono)}
                  </p>
                  <p>
                    <strong>Email:</strong> {prestador.email}
                  </p>
                  {prestador.empresa && (
                    <p>
                      <strong>Empresa:</strong> {prestador.empresa}
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
            <Alert className="border-green-300 bg-green-50">
              <Info className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                📝 Plantilla Auto-cargada
              </AlertTitle>
              <AlertDescription className="text-green-700 text-sm">
                El mensaje se completó automáticamente con la plantilla de{" "}
                <strong>{getTituloTipoNotificacion(tipo)}</strong>. Puedes
                editarlo libremente o restaurarlo con el botón.
              </AlertDescription>
            </Alert>
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

          {prestador && isDevelopment && numeroTest && (
            <Alert className="border-amber-300 bg-amber-50">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">
                🧪 Modo Desarrollo
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
            disabled={enviando || !prestador || !validacionMensaje.valid}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {enviando ? "Enviando..." : "Enviar Notificación"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
