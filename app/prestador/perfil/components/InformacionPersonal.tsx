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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserIcon className="w-5 h-5 text-[var(--isla-teal)]" />
          <span>Información Personal</span>
        </CardTitle>
        <CardDescription>
          Tu información de contacto con CONANP (solo lectura)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
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

          {/* Información de solo lectura */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre Completo</Label>
              <div className="flex items-center space-x-2 mt-1">
                <UserIcon className="w-4 h-4 text-gray-400" />
                <Input
                  id="nombre"
                  value={profile?.nombre || ""}
                  readOnly
                  className="bg-gray-50 text-gray-700"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Este campo no se puede modificar
              </p>
            </div>

            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  value={profile?.email || ""}
                  readOnly
                  className="bg-gray-50 text-gray-700"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Este campo no se puede modificar
              </p>
            </div>

            <div>
              <Label htmlFor="telefono">
                Teléfono
                <span className="text-xs text-gray-500 ml-2">
                  (Para WhatsApp)
                </span>
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <Phone className="w-4 h-4 text-gray-400" />
                <Input
                  id="telefono"
                  value={profile?.telefono || "Sin teléfono registrado"}
                  readOnly
                  className="bg-gray-50 text-gray-700 flex-1"
                />
                <Dialog
                  open={showPhoneDialog}
                  onOpenChange={onShowPhoneDialogChange}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Actualizar Teléfono</DialogTitle>
                      <DialogDescription>
                        Ingresa tu número de teléfono para recibir
                        notificaciones por WhatsApp. Debe ser de 10 dígitos sin
                        espacios ni guiones.
                      </DialogDescription>
                    </DialogHeader>
                    <form action={onUpdatePhone} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefono-edit">
                          Número de Teléfono
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <Input
                            id="telefono-edit"
                            name="telefono"
                            type="tel"
                            placeholder="2291234567"
                            defaultValue={profile?.telefono || ""}
                            pattern="[0-9]{10}"
                            maxLength={10}
                            required
                            className="flex-1"
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          📱 Ejemplo: 2291234567 (10 dígitos)
                        </p>
                      </div>

                      {updatePhoneState.success && (
                        <Alert className="border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-700">
                            {updatePhoneState.message}
                          </AlertDescription>
                        </Alert>
                      )}

                      {updatePhoneState.error && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-700">
                            {updatePhoneState.error}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => onShowPhoneDialogChange(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
                        >
                          Guardar Teléfono
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 Puedes actualizar tu teléfono en cualquier momento
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
