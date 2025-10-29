import { useEffect, useState } from "react";
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
import { generarCodigoInvitacion, getFechaMinima } from "./utils";

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
    fecha_expiracion: getFechaMinima(),
  });

  // Limpieza de estilos del body al cerrar el diálogo
  useEffect(() => {
    if (!open) {
      const timeoutId = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.pointerEvents = "";
        document.body.style.paddingRight = "";
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

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
      fecha_expiracion: getFechaMinima(),
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base md:text-lg">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[var(--isla-teal)] flex-shrink-0" />
            <span>Crear Nueva Invitación</span>
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Completa la información para generar una nueva invitación.
            Opcionalmente puedes enviar un email automático.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 md:gap-4 py-3 md:py-4">
          {/* Código de Invitación */}
          <div className="space-y-2">
            <Label htmlFor="codigo" className="text-xs md:text-sm">
              Código de Invitación *
            </Label>
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
                className="flex-1 h-9 md:h-10 text-xs md:text-sm"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerarCodigo}
                className="shrink-0 h-9 md:h-10 px-2 md:px-3"
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500">
              Click en el botón para generar un código único
            </p>
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="rol" className="text-xs md:text-sm">
              Rol
            </Label>
            <Select
              value={formData.rol}
              onValueChange={(value: RolInvitacion) => handleRolChange(value)}
            >
              <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prestador" className="text-xs md:text-sm">
                  Prestador de Servicios
                </SelectItem>
                <SelectItem value="conanp" className="text-xs md:text-sm">
                  Administrador CONANP
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha de Expiración */}
          <div className="space-y-2">
            <Label htmlFor="fecha_expiracion" className="text-xs md:text-sm">
              Fecha de Expiración
            </Label>
            <Input
              id="fecha_expiracion"
              type="date"
              value={formData.fecha_expiracion}
              onChange={(e) =>
                setFormData({ ...formData, fecha_expiracion: e.target.value })
              }
              min={getFechaMinima()}
              className="h-9 md:h-10 text-xs md:text-sm"
            />
            <p className="text-[10px] md:text-xs text-gray-500">
              Fecha mínima: hoy. Recomendado: 30 días desde hoy
            </p>
          </div>

          {/* Email del Destinatario (SIEMPRE REQUERIDO) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs md:text-sm">
              Email del Destinatario *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="usuario@ejemplo.com"
              required
              className="h-9 md:h-10 text-xs md:text-sm"
            />
            <p className="text-[10px] md:text-xs text-gray-500">
              Este email será asignado al prestador al registrarse
            </p>
          </div>

          {/* Nombre del Destinatario (SIEMPRE REQUERIDO) */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-xs md:text-sm">
              Nombre del Destinatario *
            </Label>
            <Input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              placeholder="Juan Pérez"
              required
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>

          {/* Divider */}
          <div className="border-t pt-3 md:pt-4">
            {/* Checkbox Enviar Email */}
            <div className="flex items-start space-x-2 mb-3 md:mb-4">
              <input
                type="checkbox"
                id="enviarEmail"
                checked={enviarEmail}
                onChange={(e) => setEnviarEmail(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-[var(--isla-teal)] border-gray-300 rounded focus:ring-[var(--isla-teal)]"
              />
              <Label
                htmlFor="enviarEmail"
                className="flex items-center gap-2 cursor-pointer text-xs md:text-sm"
              >
                <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                <span>Enviar email con link de registro automáticamente</span>
              </Label>
            </div>

            {enviarEmail && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 md:p-3 ml-6">
                <p className="text-[10px] md:text-xs text-blue-800 break-words">
                  ℹ️ Se enviará un email a{" "}
                  <strong className="break-all">
                    {formData.email || "..."}
                  </strong>{" "}
                  con el link de registro automáticamente.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 md:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              submitting ||
              !formData.codigo.trim() ||
              !formData.email.trim() ||
              !formData.nombre.trim()
            }
            className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-2 animate-spin" />
                <span className="truncate">Creando...</span>
              </>
            ) : (
              <span className="truncate">
                {enviarEmail ? "Crear y Enviar Email" : "Crear Invitación"}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
