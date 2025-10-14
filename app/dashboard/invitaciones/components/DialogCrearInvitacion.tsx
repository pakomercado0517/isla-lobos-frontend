import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw, Sparkles, Mail } from "lucide-react";
import { RolInvitacion } from "@/lib/types/invitaciones";
import {
  generarCodigoInvitacion,
  getFechaMinima,
  getFechaPorDefecto,
} from "./utils";

interface FormData {
  codigo: string;
  email: string;
  nombre: string;
  rol: RolInvitacion;
  fecha_expiracion: string;
}

interface DialogCrearInvitacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData, enviarEmail: boolean) => Promise<void>;
  submitting: boolean;
}

export function DialogCrearInvitacion({
  open,
  onOpenChange,
  onSubmit,
  submitting,
}: DialogCrearInvitacionProps) {
  const [enviarEmail, setEnviarEmail] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    codigo: "",
    email: "",
    nombre: "",
    rol: "prestador",
    fecha_expiracion: getFechaPorDefecto(),
  });

  const handleGenerarCodigo = () => {
    const nuevoCodigo = generarCodigoInvitacion(formData.rol);
    setFormData({ ...formData, codigo: nuevoCodigo });
  };

  const handleSubmit = async () => {
    await onSubmit(formData, enviarEmail);

    // Resetear formulario
    setFormData({
      codigo: "",
      email: "",
      nombre: "",
      rol: "prestador",
      fecha_expiracion: getFechaPorDefecto(),
    });
    setEnviarEmail(false);
  };

  const handleRolChange = (nuevoRol: RolInvitacion) => {
    setFormData({ ...formData, rol: nuevoRol });
    // Si hay código generado, regenerar con nuevo prefijo
    if (formData.codigo) {
      const nuevoCodigo = generarCodigoInvitacion(nuevoRol);
      setFormData({ ...formData, codigo: nuevoCodigo, rol: nuevoRol });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--isla-teal)]" />
            Crear Nueva Invitación
          </DialogTitle>
          <DialogDescription>
            Completa la información para generar una nueva invitación.
            Opcionalmente puedes enviar un email automático.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Código de Invitación */}
          <div className="space-y-2">
            <Label htmlFor="codigo">Código de Invitación *</Label>
            <div className="flex gap-2">
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    codigo: e.target.value.toUpperCase(),
                  })
                }
                placeholder="Ej: PRESTADOR001"
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerarCodigo}
                className="shrink-0"
              >
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Click en el botón para generar un código único
            </p>
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <Select
              value={formData.rol}
              onValueChange={(value: RolInvitacion) => handleRolChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prestador">
                  Prestador de Servicios
                </SelectItem>
                <SelectItem value="conanp">Administrador CONANP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha de Expiración */}
          <div className="space-y-2">
            <Label htmlFor="fecha_expiracion">Fecha de Expiración</Label>
            <Input
              id="fecha_expiracion"
              type="date"
              value={formData.fecha_expiracion}
              onChange={(e) =>
                setFormData({ ...formData, fecha_expiracion: e.target.value })
              }
              min={getFechaMinima()}
            />
            <p className="text-xs text-gray-500">
              Por defecto: 30 días desde hoy
            </p>
          </div>

          {/* Divider */}
          <div className="border-t pt-4">
            {/* Checkbox Enviar Email */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="enviarEmail"
                checked={enviarEmail}
                onChange={(e) => setEnviarEmail(e.target.checked)}
                className="w-4 h-4 text-[var(--isla-teal)] border-gray-300 rounded focus:ring-[var(--isla-teal)]"
              />
              <Label
                htmlFor="enviarEmail"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Enviar email automáticamente
              </Label>
            </div>

            {/* Campos condicionales de email */}
            {enviarEmail && (
              <div className="space-y-4 pl-6 border-l-2 border-[var(--isla-teal)]">
                <div className="space-y-2">
                  <Label htmlFor="email">Email del Destinatario *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="usuario@ejemplo.com"
                    required={enviarEmail}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Destinatario *</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Juan Pérez"
                    required={enviarEmail}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    ℹ️ Se enviará un email con el link de registro
                    automáticamente.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !formData.codigo.trim()}
            className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : (
              <>{enviarEmail ? "Crear y Enviar Email" : "Crear Invitación"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
