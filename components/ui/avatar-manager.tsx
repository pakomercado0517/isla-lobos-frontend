"use client";

import React, {
  useState,
  useRef,
  useTransition,
  useCallback,
  useMemo,
} from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  ImageIcon,
  Sparkles,
} from "lucide-react";
import {
  uploadAvatarAction,
  deleteAvatarAction,
  generateDefaultAvatarAction,
} from "@/actions/avatars";
import { User as UserType } from "@/lib/types/auth";
import { useAuth } from "@/lib/contexts/AuthContext";

interface AvatarManagerProps {
  user: UserType;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  showEmail?: boolean;
  showActions?: boolean;
  className?: string;
  onAvatarUpdate?: (newAvatarUrl: string | null) => void;
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-20 w-20",
  lg: "h-24 w-24",
  xl: "h-32 w-32",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-3xl",
};

export default function AvatarManager({
  user,
  size = "lg",
  showName = true,
  showEmail = true,
  showActions = true,
  className = "",
  onAvatarUpdate,
}: AvatarManagerProps) {
  // Obtener el contexto de autenticación
  const { user: authUser, refreshUserFromBackend } = useAuth();

  // Usar el usuario del contexto si está disponible, sino usar el prop
  const currentUser = authUser || user;

  // Estados locales
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isActionPending, setIsActionPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook para transiciones
  const [isPending, startTransition] = useTransition();

  // Estados para las acciones
  const [uploadState, uploadActionWithState] = useActionState(
    uploadAvatarAction,
    { success: false }
  );
  const [deleteState, deleteActionWithState] = useActionState(
    deleteAvatarAction,
    { success: false }
  );
  const [generateState, generateActionWithState] = useActionState(
    generateDefaultAvatarAction,
    { success: false }
  );

  // Función optimizada para refrescar el usuario
  const handleRefreshUser = useCallback(async () => {
    try {
      await refreshUserFromBackend();
    } catch (error) {
      console.error("Error al actualizar usuario desde backend:", error);
    }
  }, [refreshUserFromBackend]);

  // Manejar selección de archivo
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  // Manejar subida de avatar
  const handleUploadAvatar = useCallback(async () => {
    if (!selectedFile) return;

    setIsActionPending(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    startTransition(() => {
      uploadActionWithState(formData);
    });
  }, [selectedFile, uploadActionWithState]);

  // Manejar eliminación de avatar
  const handleDeleteAvatar = useCallback(async () => {
    setIsActionPending(true);
    startTransition(() => {
      deleteActionWithState();
    });
  }, [deleteActionWithState]);

  // Manejar generación de avatar por defecto
  const handleGenerateDefault = useCallback(async () => {
    setIsActionPending(true);
    const formData = new FormData();
    startTransition(() => {
      generateActionWithState(formData);
    });
  }, [generateActionWithState]);

  // Obtener iniciales del usuario
  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  // Memoizar las iniciales
  const userInitials = useMemo(
    () => getInitials(currentUser.nombre),
    [currentUser.nombre, getInitials]
  );

  // Efectos para manejar estados de éxito - optimizados
  React.useEffect(() => {
    if (uploadState.success) {
      setIsActionPending(false);
      setIsUploadDialogOpen(false);
      setPreviewUrl(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Actualizar el contexto de autenticación
      handleRefreshUser();

      // Llamar callback local si existe
      if (onAvatarUpdate && uploadState.data?.avatar_url) {
        onAvatarUpdate(uploadState.data.avatar_url);
      }
    }
  }, [
    uploadState.success,
    uploadState.data?.avatar_url,
    onAvatarUpdate,
    handleRefreshUser,
  ]);

  React.useEffect(() => {
    if (deleteState.success) {
      setIsActionPending(false);
      setIsDeleteDialogOpen(false);

      // Actualizar el contexto de autenticación
      handleRefreshUser();

      // Llamar callback local si existe
      if (onAvatarUpdate) {
        onAvatarUpdate(null);
      }
    }
  }, [deleteState.success, onAvatarUpdate, handleRefreshUser]);

  React.useEffect(() => {
    if (generateState.success) {
      setIsActionPending(false);

      // Actualizar el contexto de autenticación
      handleRefreshUser();

      // Llamar callback local si existe
      if (onAvatarUpdate && generateState.data?.avatar_url) {
        onAvatarUpdate(generateState.data.avatar_url);
      }
    }
  }, [
    generateState.success,
    generateState.data?.avatar_url,
    onAvatarUpdate,
    handleRefreshUser,
  ]);

  // Efectos para resetear estado cuando hay errores
  React.useEffect(() => {
    if (uploadState.error || deleteState.error || generateState.error) {
      setIsActionPending(false);
    }
  }, [uploadState.error, deleteState.error, generateState.error]);

  // Estados de loading
  const isUploading = isPending && uploadState !== null;
  const isDeleting = isPending && deleteState !== null;
  const isGenerating = isPending && generateState !== null;
  const isLoading =
    isUploading || isDeleting || isGenerating || isActionPending;

  // Determinar si hay errores
  const hasUploadError = uploadState.error;
  const hasDeleteError = deleteState.error;
  const hasGenerateError = generateState.error;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Avatar Display */}
      <div className="flex items-center gap-4">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage
            src={currentUser.avatar_url || undefined}
            alt={`Avatar de ${currentUser.nombre}`}
          />
          <AvatarFallback className="bg-gradient-to-br from-teal-600 to-blue-600 text-white">
            <span className={textSizeClasses[size]}>{userInitials}</span>
          </AvatarFallback>
        </Avatar>

        {(showName || showEmail) && (
          <div className="flex-1">
            {showName && (
              <h3 className="text-lg font-semibold text-slate-900">
                {currentUser.nombre}
              </h3>
            )}
            {showEmail && <p className="text-slate-600">{currentUser.email}</p>}
            {currentUser.avatar_url && (
              <Badge
                variant="outline"
                className="mt-1 bg-green-50 text-green-700 border-green-200"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Avatar personalizado
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex flex-wrap gap-2">
          {/* Upload Button */}
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={isLoading}
              >
                <Upload className="w-4 h-4" />
                {currentUser.avatar_url ? "Cambiar" : "Subir"} Avatar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Subir Avatar</DialogTitle>
                <DialogDescription>
                  Selecciona una imagen para tu avatar. Formatos permitidos:
                  JPG, PNG, WebP (máx. 5MB)
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Preview */}
                {previewUrl && (
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={previewUrl} alt="Preview" />
                      <AvatarFallback>
                        <ImageIcon className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}

                {/* File Input */}
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-slate-500">
                    Recomendado: imagen cuadrada de al menos 300x300px
                  </p>
                </div>

                {/* Upload Error */}
                {hasUploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700">
                      {hasUploadError}
                    </span>
                  </div>
                )}

                {/* Upload Success */}
                {uploadState.success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      {uploadState.message || "Avatar actualizado exitosamente"}
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleUploadAvatar}
                    disabled={!selectedFile || isLoading}
                    className="gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Subir
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Generate Default Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateDefault}
            disabled={isLoading}
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Avatar por Defecto
          </Button>

          {/* Delete Button (only if has avatar) */}
          {currentUser.avatar_url && (
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 hover:text-red-700"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Eliminar Avatar</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Estás seguro de que quieres eliminar tu avatar
                    personalizado? Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {/* Delete Error */}
                {hasDeleteError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-700">
                      {hasDeleteError}
                    </span>
                  </div>
                )}

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAvatar}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Eliminando...
                      </>
                    ) : (
                      "Eliminar"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}

      {/* Generate Error */}
      {hasGenerateError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700">{hasGenerateError}</span>
        </div>
      )}

      {/* Generate Success */}
      {generateState.success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-700">
            {generateState.message ||
              "Avatar por defecto generado exitosamente"}
          </span>
        </div>
      )}
    </div>
  );
}
