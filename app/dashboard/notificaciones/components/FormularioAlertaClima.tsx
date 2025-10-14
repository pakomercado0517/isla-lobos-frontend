import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Cloud, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { enviarAlertaClima } from "@/actions/notificaciones";
import { EstadoPuerto } from "@/lib/types/notificaciones";
import { clientLogger } from "@/lib/logger-client";

export function FormularioAlertaClima() {
  const [estadoPuerto, setEstadoPuerto] = useState<EstadoPuerto>("cerrado");
  const [oleaje, setOleaje] = useState("");
  const [viento, setViento] = useState("");
  const [mensajeAdicional, setMensajeAdicional] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const oleajeNum = parseFloat(oleaje);
    const vientoNum = parseFloat(viento);

    if (isNaN(oleajeNum) || oleajeNum < 0 || oleajeNum > 10) {
      setResultado("❌ El oleaje debe estar entre 0 y 10 metros");
      return;
    }

    if (isNaN(vientoNum) || vientoNum < 0 || vientoNum > 200) {
      setResultado("❌ El viento debe estar entre 0 y 200 km/h");
      return;
    }

    try {
      setEnviando(true);
      setResultado("");

      clientLogger.warn("Enviando alerta de clima a todos los prestadores", {
        estadoPuerto,
        oleaje: oleajeNum,
        viento: vientoNum,
      });

      const result = await enviarAlertaClima({
        estado_puerto: estadoPuerto,
        oleaje: oleajeNum,
        viento_velocidad: vientoNum,
        mensaje_adicional: mensajeAdicional || undefined,
      });

      if (result.success && result.data) {
        const { enviados, fallidos, total } = result.data.resumen;
        setResultado(
          `✅ ${enviados}/${total} alertas enviadas, ${fallidos} fallidos`
        );
        clientLogger.info("Alerta de clima enviada", {
          total,
          enviados,
          fallidos,
        });
      } else {
        setResultado(`❌ Error: ${result.error}`);
        clientLogger.error("Error al enviar alerta de clima", result.error);
      }
    } catch (error) {
      setResultado("❌ Error al enviar alerta de clima");
      clientLogger.error("Error crítico al enviar alerta de clima", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Alerta Meteorológica
        </CardTitle>
        <CardDescription>
          Enviar alerta de clima a todos los prestadores activos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert
          variant="default"
          className="mb-4 border-orange-300 bg-orange-50"
        >
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-800">Advertencia</AlertTitle>
          <AlertDescription className="text-orange-700">
            Esta alerta se enviará a <strong>TODOS</strong> los prestadores
            activos
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="estado">Estado del Puerto *</Label>
            <Select
              value={estadoPuerto}
              onValueChange={(v) => setEstadoPuerto(v as EstadoPuerto)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abierto">🟢 Abierto</SelectItem>
                <SelectItem value="restricciones">🟡 Restricciones</SelectItem>
                <SelectItem value="cerrado">🔴 Cerrado</SelectItem>
                <SelectItem value="emergencia">⚡ Emergencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oleaje">Oleaje (metros) *</Label>
              <Input
                id="oleaje"
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="2.5"
                value={oleaje}
                onChange={(e) => setOleaje(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="viento">Viento (km/h) *</Label>
              <Input
                id="viento"
                type="number"
                step="1"
                min="0"
                max="200"
                placeholder="45"
                value={viento}
                onChange={(e) => setViento(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adicional">Mensaje Adicional (opcional)</Label>
            <Textarea
              id="adicional"
              placeholder="Información adicional sobre las condiciones..."
              value={mensajeAdicional}
              onChange={(e) => setMensajeAdicional(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-sm text-gray-600">
              {mensajeAdicional.length}/500 caracteres
            </p>
          </div>

          {resultado && (
            <Alert
              variant={resultado.includes("✅") ? "default" : "destructive"}
            >
              <AlertDescription>{resultado}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={enviando} className="w-full">
            {enviando ? "Enviando..." : "Enviar Alerta de Clima"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
