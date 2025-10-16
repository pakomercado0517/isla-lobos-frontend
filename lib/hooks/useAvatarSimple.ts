"use client";

import { useState, useCallback } from "react";
import { uploadAvatarAction, deleteAvatarAction, generateDefaultAvatarAction } from "@/actions/avatars";

interface UseAvatarSimpleOptions {
  onAvatarUpdate?: (newAvatarUrl: string | null) => void;
}

export function useAvatarSimple(options: UseAvatarSimpleOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");

  const clearError = useCallback(() => setError(""), []);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      setError("");

      // Validaciones del lado del cliente
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Solo se permiten archivos JPG, PNG o WebP");
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("El archivo no puede ser mayor a 5MB");
      }

      // Crear FormData
      const formData = new FormData();
      formData.append("image", file);

      // Llamar server action directamente
      const result = await uploadAvatarAction({ success: false }, formData);
      
      if (result.success && result.data?.avatar_url) {
        options.onAvatarUpdate?.(result.data.avatar_url);
      } else {
        throw new Error(result.error || "Error al subir avatar");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al subir avatar";
      setError(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [options]);

  const deleteAvatar = useCallback(async () => {
    try {
      setIsDeleting(true);
      setError("");

      const result = await deleteAvatarAction();

      if (result.success) {
        options.onAvatarUpdate?.(null);
      } else {
        throw new Error(result.error || "Error al eliminar avatar");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al eliminar avatar";
      setError(errorMessage);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [options]);

  const generateDefaultAvatar = useCallback(async () => {
    try {
      setIsGenerating(true);
      setError("");

      const formData = new FormData();
      const result = await generateDefaultAvatarAction({ success: false }, formData);
      
      if (result.success && result.data?.avatar_url) {
        options.onAvatarUpdate?.(result.data.avatar_url);
      } else {
        throw new Error(result.error || "Error al generar avatar por defecto");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al generar avatar";
      setError(errorMessage);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [options]);

  return {
    // Acciones
    uploadAvatar,
    deleteAvatar,
    generateDefaultAvatar,

    // Estados
    isUploading,
    isDeleting,
    isGenerating,
    isLoading: isUploading || isDeleting || isGenerating,
    error,

    // Utilidades
    clearError,
  };
}