"use client";

import React, { useCallback, useState, useTransition } from "react";
import { useActionState } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  uploadAvatarAction,
  deleteAvatarAction,
  generateDefaultAvatarAction,
} from "@/actions/avatars";

interface UseAvatarOptions {
  onSuccess?: (avatarUrl: string | null) => void;
  onError?: (error: string) => void;
}

export function useAvatar(options: UseAvatarOptions = {}) {
  const { refreshUserFromBackend } = useAuth();
  const [isActionPending, setIsActionPending] = useState(false);
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

  // Función para manejar éxito de acciones
  const handleActionSuccess = useCallback(
    async (avatarUrl: string | null) => {
      try {
        await refreshUserFromBackend();
        if (options.onSuccess) {
          options.onSuccess(avatarUrl);
        }
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
        if (options.onError) {
          options.onError("Error al actualizar la información del usuario");
        }
      }
    },
    [refreshUserFromBackend, options]
  );

  // Función para manejar errores
  const handleActionError = useCallback(
    (error: string) => {
      setIsActionPending(false);
      if (options.onError) {
        options.onError(error);
      }
    },
    [options]
  );

  // Subir avatar
  const uploadAvatar = useCallback(
    (file: File) => {
      setIsActionPending(true);
      const formData = new FormData();
      formData.append("image", file);

      startTransition(() => {
        uploadActionWithState(formData);
      });
    },
    [uploadActionWithState]
  );

  // Eliminar avatar
  const deleteAvatar = useCallback(() => {
    setIsActionPending(true);
    startTransition(() => {
      deleteActionWithState();
    });
  }, [deleteActionWithState]);

  // Generar avatar por defecto
  const generateDefaultAvatar = useCallback(() => {
    setIsActionPending(true);
    const formData = new FormData();
    startTransition(() => {
      generateActionWithState(formData);
    });
  }, [generateActionWithState]);

  // Efectos para manejar estados de éxito
  React.useEffect(() => {
    if (uploadState.success) {
      setIsActionPending(false);
      const avatarUrl = uploadState.data?.avatar_url || null;

      // Llamar callback inmediatamente con la nueva URL
      if (options.onSuccess && avatarUrl) {
        options.onSuccess(avatarUrl);
      }

      // Actualizar el contexto de autenticación después de un pequeño delay
      setTimeout(() => {
        handleActionSuccess(avatarUrl);
      }, 100);
    } else if (uploadState.error) {
      handleActionError(uploadState.error);
    }
  }, [
    uploadState.success,
    uploadState.error,
    uploadState.data?.avatar_url,
    options,
    handleActionSuccess,
    handleActionError,
  ]);

  React.useEffect(() => {
    if (deleteState.success) {
      setIsActionPending(false);

      // Llamar callback inmediatamente
      if (options.onSuccess) {
        options.onSuccess(null);
      }

      // Actualizar el contexto de autenticación después de un pequeño delay
      setTimeout(() => {
        handleActionSuccess(null);
      }, 100);
    } else if (deleteState.error) {
      handleActionError(deleteState.error);
    }
  }, [
    deleteState.success,
    deleteState.error,
    options,
    handleActionSuccess,
    handleActionError,
  ]);

  React.useEffect(() => {
    if (generateState.success) {
      setIsActionPending(false);
      const avatarUrl = generateState.data?.avatar_url || null;

      // Llamar callback inmediatamente con la nueva URL
      if (options.onSuccess && avatarUrl) {
        options.onSuccess(avatarUrl);
      }

      // Actualizar el contexto de autenticación después de un pequeño delay
      setTimeout(() => {
        handleActionSuccess(avatarUrl);
      }, 100);
    } else if (generateState.error) {
      handleActionError(generateState.error);
    }
  }, [
    generateState.success,
    generateState.error,
    generateState.data?.avatar_url,
    options,
    handleActionSuccess,
    handleActionError,
  ]);

  return {
    // Acciones
    uploadAvatar,
    deleteAvatar,
    generateDefaultAvatar,

    // Estados
    isActionPending: isActionPending || isPending,

    // Estados específicos
    uploadState,
    deleteState,
    generateState,

    // Estados de loading
    isUploading: isPending && isActionPending,
    isDeleting: isPending && isActionPending,
    isGenerating: isPending && isActionPending,
  };
}
