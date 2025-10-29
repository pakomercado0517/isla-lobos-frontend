"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import AvatarManagerOptimized from "@/components/ui/avatar-manager-optimized";
import {
  User as UserIcon,
  Mail,
  Phone,
  CheckCircle,
  AlertTriangle,
  Edit,
  Shield,
  Crown,
  Calendar,
} from "lucide-react";

import { User } from "@/lib/types/auth";
import { formatearFechaRegional } from "@/lib/utils";

interface UserProfile extends User {
  fechaVencimientoPermiso?: string;
  estadoPermiso?: string;
  diasNotificacion?: number;
}

interface InformacionPersonalProps {
  profile: UserProfile | null;
  showPhoneDialog: boolean;
  updatePhoneState: { success: boolean; error?: string; message?: string };
  onShowPhoneDialogChange: (open: boolean) => void;
  onUpdatePhone: (formData: FormData) => void;
  onAvatarUpdate?: (newAvatarUrl: string | null) => void;
}

export function InformacionPersonal({
  profile,
  showPhoneDialog,
  updatePhoneState,
  onShowPhoneDialogChange,
  onUpdatePhone,
  onAvatarUpdate,
}: InformacionPersonalProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
      {/* Avatar y Información Principal */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
            <Crown className="w-4 h-4 md:w-5 md:h-5 text-amber-500 flex-shrink-0" />
            <span className="truncate">Información del Administrador</span>
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Tu información personal como Administrador CONANP
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col items-center space-y-4 md:space-y-6">
            {/* Avatar */}
            {profile && (
              <AvatarManagerOptimized
                user={profile}
                size="xl"
                showName={true}
                showEmail={true}
                showActions={true}
                className="text-center w-full"
                onAvatarUpdate={onAvatarUpdate}
              />
            )}

            {/* Badges de Rol */}
            <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] md:text-xs"
              >
                <Shield className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                Admin CONANP
              </Badge>
              <Badge
                variant="outline"
                className={`text-[10px] md:text-xs ${
                  profile?.activo
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {profile?.activo ? "✅ Activo" : "❌ Inactivo"}
              </Badge>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] md:text-xs"
              >
                <Crown className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
                Acceso Total
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalles de Contacto */}
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
            <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-[var(--isla-teal)] flex-shrink-0" />
            <span className="truncate">Información de Contacto</span>
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Información personal y datos de contacto oficial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
          {/* Nombre */}
          <div>
            <Label htmlFor="nombre" className="text-xs md:text-sm">
              Nombre Completo
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <UserIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
              <Input
                id="nombre"
                value={profile?.nombre || ""}
                readOnly
                className="bg-gray-50 text-gray-700 h-9 md:h-10 text-xs md:text-sm"
              />
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1">
              Campo no modificable - Contacta con soporte
            </p>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-xs md:text-sm">
              Correo Electrónico Oficial
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
              <Input
                id="email"
                value={profile?.email || ""}
                readOnly
                className="bg-gray-50 text-gray-700 h-9 md:h-10 text-xs md:text-sm truncate"
              />
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1">
              📧 Email oficial - No modificable
            </p>
          </div>

          {/* Teléfono */}
          <div>
            <Label htmlFor="telefono" className="text-xs md:text-sm">
              Teléfono de Contacto
              <span className="text-[10px] md:text-xs text-gray-500 ml-1 md:ml-2">
                (Notificaciones)
              </span>
            </Label>
            <div className="flex items-center gap-1.5 md:gap-2 mt-1">
              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
              <Input
                id="telefono"
                value={profile?.telefono || "Sin teléfono"}
                readOnly
                className="bg-gray-50 text-gray-700 flex-1 h-9 md:h-10 text-xs md:text-sm"
              />
              <Dialog
                open={showPhoneDialog}
                onOpenChange={onShowPhoneDialogChange}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white h-9 text-xs md:text-sm flex-shrink-0"
                  >
                    <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-base md:text-lg">
                      Actualizar Teléfono
                    </DialogTitle>
                    <DialogDescription className="text-xs md:text-sm">
                      Ingresa tu teléfono para recibir notificaciones del
                      sistema (10 dígitos).
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    action={onUpdatePhone}
                    className="space-y-3 md:space-y-4"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="telefono-edit"
                        className="text-xs md:text-sm"
                      >
                        Número de Teléfono
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                        <Input
                          id="telefono-edit"
                          name="telefono"
                          type="tel"
                          placeholder="2291234567"
                          defaultValue={profile?.telefono || ""}
                          pattern="[0-9]{10}"
                          maxLength={10}
                          required
                          className="flex-1 h-9 md:h-10 text-xs md:text-sm"
                        />
                      </div>
                      <p className="text-[10px] md:text-xs text-gray-500">
                        📱 Ejemplo: 2291234567 (10 dígitos)
                      </p>
                    </div>

                    {updatePhoneState.success && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                        <AlertDescription className="text-green-700 text-xs md:text-sm break-words">
                          {updatePhoneState.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    {updatePhoneState.error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
                        <AlertDescription className="text-red-700 text-xs md:text-sm break-words">
                          {updatePhoneState.error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex flex-col md:flex-row justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onShowPhoneDialogChange(false)}
                        className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="w-full md:w-auto bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white h-9 md:h-10 text-xs md:text-sm"
                      >
                        Guardar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1">
              🔔 Recibirás alertas importantes
            </p>
          </div>

          {/* Fecha de Registro */}
          <div>
            <Label htmlFor="fecha-registro" className="text-xs md:text-sm">
              Fecha de Registro
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
              <Input
                id="fecha-registro"
                value={
                  profile?.created_at
                    ? formatearFechaRegional(profile.created_at.split("T")[0])
                    : "No disponible"
                }
                readOnly
                className="bg-gray-50 text-gray-700 h-9 md:h-10 text-xs md:text-sm"
              />
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 mt-1">
              📅 Fecha de creación de tu cuenta
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
