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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      {/* Avatar y Información Principal */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <span>Información del Administrador</span>
          </CardTitle>
          <CardDescription>
            Tu información personal como Administrador CONANP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
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
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge 
                variant="outline" 
                className="bg-amber-50 text-amber-700 border-amber-200"
              >
                <Shield className="w-3 h-3 mr-1" />
                Administrador CONANP
              </Badge>
              <Badge 
                variant="outline" 
                className={
                  profile?.activo
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {profile?.activo ? "✅ Activo" : "❌ Inactivo"}
              </Badge>
              <Badge 
                variant="outline" 
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                <Crown className="w-3 h-3 mr-1" />
                Acceso Total
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalles de Contacto */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5 text-[var(--isla-teal)]" />
            <span>Información de Contacto</span>
          </CardTitle>
          <CardDescription>
            Información personal y datos de contacto oficial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nombre */}
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
              Campo no modificable - Contacta con soporte para cambios
            </p>
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Correo Electrónico Oficial</Label>
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
              📧 Email oficial de CONANP - No modificable
            </p>
          </div>

          {/* Teléfono */}
          <div>
            <Label htmlFor="telefono">
              Teléfono de Contacto
              <span className="text-xs text-gray-500 ml-2">
                (Para notificaciones de sistema)
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
                    <DialogTitle>Actualizar Teléfono Administrativo</DialogTitle>
                    <DialogDescription>
                      Ingresa tu número de teléfono para recibir
                      notificaciones importantes del sistema. Debe ser de 10 dígitos.
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
                        📱 Ejemplo: 2291234567 (10 dígitos sin espacios)
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
              🔔 Recibirás alertas importantes del sistema
            </p>
          </div>

          {/* Fecha de Registro */}
          <div>
            <Label htmlFor="fecha-registro">Fecha de Registro en Sistema</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Input
                id="fecha-registro"
                value={
                  profile?.created_at
                    ? formatearFechaRegional(profile.created_at.split('T')[0])
                    : "No disponible"
                }
                readOnly
                className="bg-gray-50 text-gray-700"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              📅 Fecha de creación de tu cuenta administrativa
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}