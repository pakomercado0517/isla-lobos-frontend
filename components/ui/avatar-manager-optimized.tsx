"use client";

import { useState, useRef, useCallback } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { User as UserType } from "@/lib/types/auth";
import { useAvatarSimple } from "@/lib/hooks/useAvatarSimple";
import { clientLogger } from "@/lib/logger-client";

interface AvatarManagerOptimizedProps {
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

export default function AvatarManagerOptimized({
  user,
  size = "lg",
  showName = true,
  showEmail = true,
  showActions = true,
  className = "",
  onAvatarUpdate,
}: AvatarManagerOptimizedProps) {
  // Estados locales para dialogs
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook simplificado
  const {
    uploadAvatar,
    deleteAvatar,
    generateDefaultAvatar,
    isUploading,
    isDeleting,
    isGenerating,
    isLoading,
    error,
    clearError,
  } = useAvatarSimple({
    onAvatarUpdate: (avatarUrl) => {
      onAvatarUpdate?.(avatarUrl);
      setSuccessMessage(
        avatarUrl
          ? "Avatar actualizado exitosamente"
          : "Avatar eliminado exitosamente"
      );
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  // Obtener iniciales del usuario
  const getInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const userInitials = getInitials(user.nombre);

  // Manejar selección de archivo
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        clearError();

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [clearError]
  );

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Manejar subida de avatar
  const handleUploadAvatar = useCallback(async () => {
    if (!selectedFile) return;

    try {
      await uploadAvatar(selectedFile);
      clearSelection();
      setIsUploadDialogOpen(false);
    } catch (error) {
      // Error ya manejado en el hook
      clientLogger.error("Error subiendo avatar:", error);
    }
  }, [selectedFile, uploadAvatar, clearSelection]);

  // Manejar eliminación de avatar
  const handleDeleteAvatar = useCallback(async () => {
    try {
      await deleteAvatar();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      clientLogger.error("Error eliminando avatar:", error);
    }
  }, [deleteAvatar]);

  // Manejar generación de avatar por defecto
  const handleGenerateDefault = useCallback(async () => {
    try {
      await generateDefaultAvatar();
    } catch (error) {
      clientLogger.error("Error generando avatar por defecto:", error);
    }
  }, [generateDefaultAvatar]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Avatar Display */}
      <div className="flex items-center gap-4">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage
            src={user.avatar_url || undefined}
            alt={`Avatar de ${user.nombre}`}
          />
          <AvatarFallback className="bg-gradient-to-br from-teal-600 to-blue-600 text-white">
            <span className={textSizeClasses[size]}>{userInitials}</span>
          </AvatarFallback>
        </Avatar>

        {(showName || showEmail) && (
          <div className="flex-1">
            {showName && (
              <h3 className="text-lg font-semibold text-slate-900">
                {user.nombre}
              </h3>
            )}
            {showEmail && <p className="text-slate-600">{user.email}</p>}
            {user.avatar_url && (
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

      {/* Success Message */}
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

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
                onClick={clearError}
              >
                <Upload className="w-4 h-4" />
                {user.avatar_url ? "Cambiar" : "Subir"} Avatar
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

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsUploadDialogOpen(false);
                      clearSelection();
                      clearError();
                    }}
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
          {user.avatar_url && (
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
    </div>
  );
}
