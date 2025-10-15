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
import {
  User,
  Mail,
  Phone,
  Camera,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Edit,
} from "lucide-react";
import Image from "next/image";

interface UserProfile {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: "conanp" | "prestador";
  activo: boolean;
  avatar?: string;
  fechaVencimientoPermiso?: string;
  estadoPermiso?: string;
  diasNotificacion?: number;
  createdAt: string;
  updatedAt: string;
}

interface InformacionPersonalProps {
  profile: UserProfile | null;
  avatarPreview: string | null;
  showAvatarDialog: boolean;
  uploadAvatarState: { success: boolean; error?: string; message?: string };
  showPhoneDialog: boolean;
  updatePhoneState: { success: boolean; error?: string; message?: string };
  onShowAvatarDialogChange: (open: boolean) => void;
  onShowPhoneDialogChange: (open: boolean) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadAvatar: (formData: FormData) => void;
  onDeleteAvatar: () => void;
  onUpdatePhone: (formData: FormData) => void;
}

export function InformacionPersonal({
  profile,
  avatarPreview,
  showAvatarDialog,
  uploadAvatarState,
  showPhoneDialog,
  updatePhoneState,
  onShowAvatarDialogChange,
  onShowPhoneDialogChange,
  onFileSelect,
  onUploadAvatar,
  onDeleteAvatar,
  onUpdatePhone,
}: InformacionPersonalProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5 text-[var(--isla-teal)]" />
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
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt="Avatar"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <Dialog
                open={showAvatarDialog}
                onOpenChange={onShowAvatarDialogChange}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cambiar Avatar</DialogTitle>
                    <DialogDescription>
                      Selecciona una nueva imagen para tu perfil
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {avatarPreview && (
                      <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                          <Image
                            src={avatarPreview}
                            alt="Preview"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Seleccionar Imagen</Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={onFileSelect}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--isla-teal)] file:text-white hover:file:bg-[var(--isla-teal-dark)]"
                      />
                      <p className="text-sm text-gray-500">
                        Formatos permitidos: JPG, PNG, WebP. Tamaño máximo: 5MB
                      </p>
                    </div>
                    {uploadAvatarState.success && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                          {uploadAvatarState.message}
                        </AlertDescription>
                      </Alert>
                    )}
                    {uploadAvatarState.error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                          {uploadAvatarState.error}
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex justify-between">
                      <form action={onUploadAvatar}>
                        <Button
                          type="submit"
                          className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
                        >
                          Subir Avatar
                        </Button>
                      </form>
                      {profile?.avatar && (
                        <form action={onDeleteAvatar}>
                          <Button
                            type="submit"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Haz clic en la cámara para cambiar tu foto de perfil
            </p>
          </div>

          {/* Información de solo lectura */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre Completo</Label>
              <div className="flex items-center space-x-2 mt-1">
                <User className="w-4 h-4 text-gray-400" />
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
