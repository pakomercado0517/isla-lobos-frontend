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
import AvatarManagerOptimized from "@/components/ui/avatar-manager-optimized";
import {
  User as UserIcon,
  Mail,
  Phone,
  CheckCircle,
  AlertTriangle,
  Edit,
} from "lucide-react";

import { User } from "@/lib/types/auth";

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
    <Card className="mb-4 md:mb-6">
      <CardHeader className="pb-4 md:pb-6">
        <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
          <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-[var(--isla-teal)] flex-shrink-0" />
          <span>Información Personal</span>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm mt-2">
          Tu información de contacto con CONANP (solo lectura)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="space-y-6 md:space-y-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center justify-center pb-4 md:pb-6 border-b">
            {profile && (
              <AvatarManagerOptimized
                user={profile}
                size="xl"
                showName={true}
                showEmail={true}
                showActions={true}
                className="text-center"
                onAvatarUpdate={onAvatarUpdate}
              />
            )}
          </div>

          {/* Information Fields Section */}
          <div className="space-y-5 md:space-y-6">
            {/* Nombre Completo */}
            <div className="pb-5 md:pb-6 border-b last:border-b-0 last:pb-0">
              <Label
                htmlFor="nombre"
                className="text-xs md:text-sm font-medium block mb-2"
              >
                Nombre Completo
              </Label>
              <div className="flex items-center space-x-2 mt-2">
                <UserIcon className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                <Input
                  id="nombre"
                  value={profile?.nombre || ""}
                  readOnly
                  className="bg-gray-50 text-gray-700 text-xs md:text-sm h-9 md:h-10 flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-5 md:ml-6">
                Este campo no se puede modificar
              </p>
            </div>

            {/* Correo Electrónico */}
            <div className="pb-5 md:pb-6 border-b last:border-b-0 last:pb-0">
              <Label
                htmlFor="email"
                className="text-xs md:text-sm font-medium block mb-2"
              >
                Correo Electrónico
              </Label>
              <div className="flex items-center space-x-2 mt-2">
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                <Input
                  id="email"
                  value={profile?.email || ""}
                  readOnly
                  className="bg-gray-50 text-gray-700 text-xs md:text-sm h-9 md:h-10 flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-5 md:ml-6">
                Este campo no se puede modificar
              </p>
            </div>

            {/* Teléfono */}
            <div className="pb-0">
              <Label
                htmlFor="telefono"
                className="text-xs md:text-sm font-medium block mb-2"
              >
                Teléfono
                <span className="text-xs text-gray-500 ml-1 md:ml-2">
                  (Para WhatsApp)
                </span>
              </Label>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                  <Input
                    id="telefono"
                    value={profile?.telefono || "Sin teléfono registrado"}
                    readOnly
                    className="bg-gray-50 text-gray-700 flex-1 text-xs md:text-sm h-9 md:h-10"
                  />
                </div>
                <Dialog
                  open={showPhoneDialog}
                  onOpenChange={onShowPhoneDialogChange}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-xs md:text-sm h-9 md:h-10 w-full"
                    >
                      <Edit className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                      Editar Teléfono
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto p-4 md:p-6 gap-4 md:gap-6">
                    <DialogHeader className="space-y-2">
                      <DialogTitle className="text-lg md:text-xl">
                        Actualizar Teléfono
                      </DialogTitle>
                      <DialogDescription className="text-xs md:text-sm">
                        Ingresa tu número de teléfono para recibir
                        notificaciones por WhatsApp. Debe ser de 10 dígitos sin
                        espacios ni guiones.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      action={onUpdatePhone}
                      className="space-y-4 md:space-y-5"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="telefono-edit"
                          className="text-xs md:text-sm font-medium"
                        >
                          Número de Teléfono
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <Input
                            id="telefono-edit"
                            name="telefono"
                            type="tel"
                            placeholder="2291234567"
                            defaultValue={profile?.telefono || ""}
                            pattern="[0-9]{10}"
                            maxLength={10}
                            required
                            className="flex-1 text-xs md:text-sm h-9 md:h-10"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          📱 Ejemplo: 2291234567 (10 dígitos)
                        </p>
                      </div>

                      {updatePhoneState.success && (
                        <Alert className="border-green-200 bg-green-50 py-3 md:py-4">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <AlertDescription className="text-green-700 text-xs md:text-sm ml-2">
                            {updatePhoneState.message}
                          </AlertDescription>
                        </Alert>
                      )}

                      {updatePhoneState.error && (
                        <Alert className="border-red-200 bg-red-50 py-3 md:py-4">
                          <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <AlertDescription className="text-red-700 text-xs md:text-sm ml-2">
                            {updatePhoneState.error}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => onShowPhoneDialogChange(false)}
                          className="text-xs md:text-sm h-9 md:h-10"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white text-xs md:text-sm h-9 md:h-10"
                        >
                          Guardar Teléfono
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Puedes actualizar tu teléfono en cualquier momento
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
