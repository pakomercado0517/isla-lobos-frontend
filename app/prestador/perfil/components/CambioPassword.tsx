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
  return (
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
          onOpenChange={onShowChangePasswordChange}
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
            <form action={onChangePassword} className="space-y-4">
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
                    onClick={onShowCurrentPasswordToggle}
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
                    onClick={onShowNewPasswordToggle}
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
                    onClick={onShowConfirmPasswordToggle}
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
                  onClick={() => onShowChangePasswordChange(false)}
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
  );
}
