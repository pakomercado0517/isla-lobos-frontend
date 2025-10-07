"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getProfileAction,
  changePasswordAction,
  uploadAvatarAction,
  deleteAvatarAction,
} from "@/actions/profile";
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
  Lock,
  Camera,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";

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

export default function PerfilPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para el cambio de contraseña
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para el avatar
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Estados para formularios
  const [changePasswordState, changePasswordActionWithState] = useActionState(
    changePasswordAction,
    {
      success: false,
    }
  );
  const [uploadAvatarState, uploadAvatarActionWithState] = useActionState(
    uploadAvatarAction,
    {
      success: false,
    }
  );
  const [, deleteAvatarActionWithState] = useActionState(deleteAvatarAction, {
    success: false,
  });

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadProfile();
    }
  }, [isLoading, isAuthorized, user]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProfileAction();

      if (result.success && result.data?.user) {
        setProfile(result.data.user);
        if (result.data.user.avatar) {
          setAvatarPreview(result.data.user.avatar);
        }
      } else {
        setError(result.error || "Error al cargar el perfil");
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setError("Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async (formData: FormData) => {
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }
    await uploadAvatarActionWithState(formData);
  };

  const handleDeleteAvatar = async () => {
    await deleteAvatarActionWithState();
    setAvatarPreview(null);
    setSelectedFile(null);
  };

  const handleChangePassword = async (formData: FormData) => {
    await changePasswordActionWithState(formData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--isla-dark-teal)]">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)]">
          Mi Perfil
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Información del Perfil */}
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
                    onOpenChange={setShowAvatarDialog}
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
                            onChange={handleFileSelect}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--isla-teal)] file:text-white hover:file:bg-[var(--isla-teal-dark)]"
                          />
                          <p className="text-sm text-gray-500">
                            Formatos permitidos: JPG, PNG, WebP. Tamaño máximo:
                            5MB
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
                          <form action={handleUploadAvatar}>
                            <Button
                              type="submit"
                              disabled={!selectedFile}
                              className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
                            >
                              Subir Avatar
                            </Button>
                          </form>
                          {profile?.avatar && (
                            <form action={handleDeleteAvatar}>
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
                  <Label htmlFor="telefono">Teléfono</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Input
                      id="telefono"
                      value={profile?.telefono || ""}
                      readOnly
                      className="bg-gray-50 text-gray-700"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Este campo no se puede modificar
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cambio de Contraseña */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-[var(--isla-teal)]" />
              <span>Seguridad</span>
            </CardTitle>
            <CardDescription>
              Cambia tu contraseña para mantener tu cuenta segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog
              open={showChangePassword}
              onOpenChange={setShowChangePassword}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cambiar Contraseña</DialogTitle>
                  <DialogDescription>
                    Ingresa tu contraseña actual y la nueva contraseña
                  </DialogDescription>
                </DialogHeader>
                <form action={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <div className="relative mt-1">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <div className="relative mt-1">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo 6 caracteres
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirmar Nueva Contraseña
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {changePasswordState.success && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        {changePasswordState.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {changePasswordState.error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        {changePasswordState.error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowChangePassword(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
                    >
                      Cambiar Contraseña
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        {profile && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
              <CardDescription>
                Detalles adicionales de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Rol:</span>
                  <p className="font-medium capitalize">{profile.rol}</p>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <p className="font-medium">
                    {profile.activo ? "Activo" : "Inactivo"}
                  </p>
                </div>
                {profile.fechaVencimientoPermiso && (
                  <div>
                    <span className="text-gray-600">Permiso vence:</span>
                    <p className="font-medium">
                      {new Date(
                        profile.fechaVencimientoPermiso
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {profile.estadoPermiso && (
                  <div>
                    <span className="text-gray-600">Estado del permiso:</span>
                    <p className="font-medium capitalize">
                      {profile.estadoPermiso.replace("_", " ")}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Miembro desde:</span>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Última actualización:</span>
                  <p className="font-medium">
                    {new Date(profile.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
