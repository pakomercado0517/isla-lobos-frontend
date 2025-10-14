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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Send, X, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import {
  enviarNotificacionMasiva,
  getPrestadores,
} from "@/actions/notificaciones";
import { PrestadorSelector } from "@/lib/types/notificaciones";
import { validarMensajeLength, formatearTelefono } from "./utils";
import { clientLogger } from "@/lib/logger-client";

export function FormularioMasivo() {
  const [prestadores, setPrestadores] = useState<PrestadorSelector[]>([]);
  const [prestadoresSeleccionados, setPrestadoresSeleccionados] = useState<
    PrestadorSelector[]
  >([]);
  const [prestadorParaAgregar, setPrestadorParaAgregar] = useState<string>("");
  const [cargandoPrestadores, setCargandoPrestadores] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState("");

  const validacionMensaje = validarMensajeLength(mensaje);

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
        tipo: "recordatorio_generico",
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

          {/* Mensaje */}
          <div className="space-y-2">
            <Label htmlFor="mensajeMasivo">Mensaje *</Label>
            <Textarea
              id="mensajeMasivo"
              placeholder="Escribe el mensaje que se enviará a todos los prestadores seleccionados..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={6}
              required
              className="resize-none"
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
