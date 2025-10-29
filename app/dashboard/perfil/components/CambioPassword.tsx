"use client";

import { useEffect } from "react";
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
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";

interface CambioPasswordProps {
  showChangePassword: boolean;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  changePasswordState: { success: boolean; error?: string; message?: string };
  onShowChangePasswordChange: (open: boolean) => void;
  onShowCurrentPasswordToggle: () => void;
  onShowNewPasswordToggle: () => void;
  onShowConfirmPasswordToggle: () => void;
  onChangePassword: (formData: FormData) => void;
}

export function CambioPassword({
  showChangePassword,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  changePasswordState,
  onShowChangePasswordChange,
  onShowCurrentPasswordToggle,
  onShowNewPasswordToggle,
  onShowConfirmPasswordToggle,
  onChangePassword,
}: CambioPasswordProps) {
  // Cleanup body styles cuando el dialog se cierra
  useEffect(() => {
    if (!showChangePassword) {
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.pointerEvents = "";
        document.body.style.paddingRight = "";
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showChangePassword]);

  return (
    <Card className="mb-4 md:mb-6">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
          <Lock className="w-4 h-4 md:w-5 md:h-5 text-[var(--isla-teal)] flex-shrink-0" />
          <span>Seguridad</span>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Cambia tu contraseña para mantener tu cuenta segura
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <Dialog
          open={showChangePassword}
          onOpenChange={onShowChangePasswordChange}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white h-9 md:h-10 text-xs md:text-sm w-full md:w-auto"
            >
              <Lock className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Cambiar Contraseña
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">
                Cambiar Contraseña
              </DialogTitle>
              <DialogDescription className="text-xs md:text-sm">
                Ingresa tu contraseña actual y la nueva contraseña
              </DialogDescription>
            </DialogHeader>
            <form action={onChangePassword} className="space-y-3 md:space-y-4">
              <div>
                <Label htmlFor="currentPassword" className="text-xs md:text-sm">
                  Contraseña Actual
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    className="pr-10 h-9 md:h-10 text-xs md:text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2 md:px-3 py-2 hover:bg-transparent"
                    onClick={onShowCurrentPasswordToggle}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-xs md:text-sm">
                  Nueva Contraseña
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    className="pr-10 h-9 md:h-10 text-xs md:text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2 md:px-3 py-2 hover:bg-transparent"
                    onClick={onShowNewPasswordToggle}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-xs md:text-sm">
                  Confirmar Nueva Contraseña
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="pr-10 h-9 md:h-10 text-xs md:text-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-2 md:px-3 py-2 hover:bg-transparent"
                    onClick={onShowConfirmPasswordToggle}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    ) : (
                      <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {changePasswordState.success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                  <AlertDescription className="text-green-700 text-xs md:text-sm break-words">
                    {changePasswordState.message}
                  </AlertDescription>
                </Alert>
              )}

              {changePasswordState.error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
                  <AlertDescription className="text-red-700 text-xs md:text-sm break-words">
                    {changePasswordState.error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col md:flex-row justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onShowChangePasswordChange(false)}
                  className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="w-full md:w-auto bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white h-9 md:h-10 text-xs md:text-sm"
                >
                  Cambiar Contraseña
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
