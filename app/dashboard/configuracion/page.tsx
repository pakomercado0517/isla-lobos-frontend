"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Bell, Moon, Globe, Lock, Database, Zap } from "lucide-react";
import { useState } from "react";

export default function ConfiguracionPage() {
  const [notificaciones, setNotificaciones] = useState({
    email: true,
    whatsapp: true,
    alertasClima: true,
    recordatorios: false,
  });

  const [preferencias, setPreferencias] = useState({
    modoOscuro: false,
    idioma: "es",
    zonaHoraria: "America/Mexico_City",
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-600 mt-1">
          Personaliza tu experiencia en el sistema
        </p>
      </div>

      {/* Notificaciones */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Notificaciones
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notif-email" className="text-base">
                Notificaciones por Email
              </Label>
              <p className="text-sm text-slate-500">
                Recibe alertas importantes por correo electrónico
              </p>
            </div>
            <Switch
              id="notif-email"
              checked={notificaciones.email}
              onCheckedChange={(checked: boolean) =>
                setNotificaciones({ ...notificaciones, email: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notif-whatsapp" className="text-base">
                Notificaciones por WhatsApp
              </Label>
              <p className="text-sm text-slate-500">
                Recibe alertas urgentes por WhatsApp
              </p>
            </div>
            <Switch
              id="notif-whatsapp"
              checked={notificaciones.whatsapp}
              onCheckedChange={(checked: boolean) =>
                setNotificaciones({ ...notificaciones, whatsapp: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notif-clima" className="text-base">
                Alertas Meteorológicas
              </Label>
              <p className="text-sm text-slate-500">
                Recibe alertas cuando cambian las condiciones del puerto
              </p>
            </div>
            <Switch
              id="notif-clima"
              checked={notificaciones.alertasClima}
              onCheckedChange={(checked: boolean) =>
                setNotificaciones({ ...notificaciones, alertasClima: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notif-recordatorios" className="text-base">
                Recordatorios Diarios
              </Label>
              <p className="text-sm text-slate-500">
                Recibe un resumen diario de actividades
              </p>
            </div>
            <Switch
              id="notif-recordatorios"
              checked={notificaciones.recordatorios}
              onCheckedChange={(checked: boolean) =>
                setNotificaciones({ ...notificaciones, recordatorios: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Preferencias de Interfaz */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Preferencias de Interfaz
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="modo-oscuro" className="text-base">
                Modo Oscuro
              </Label>
              <p className="text-sm text-slate-500">
                Activa el tema oscuro para reducir el brillo
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-slate-400" />
              <Switch
                id="modo-oscuro"
                checked={preferencias.modoOscuro}
                onCheckedChange={(checked: boolean) =>
                  setPreferencias({ ...preferencias, modoOscuro: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="idioma"
              className="text-base flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Idioma
            </Label>
            <select
              id="idioma"
              value={preferencias.idioma}
              onChange={(e) =>
                setPreferencias({ ...preferencias, idioma: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="es">Español (México)</option>
              <option value="en">English (US)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Seguridad */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Seguridad y Privacidad
          </h3>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Lock className="w-4 h-4 mr-2" />
            Cambiar Contraseña
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Settings className="w-4 h-4 mr-2" />
            Gestionar Sesiones Activas
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Database className="w-4 h-4 mr-2" />
            Descargar Mis Datos
          </Button>
        </div>
      </Card>

      {/* Zona de Peligro */}
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">
            Zona de Peligro
          </h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-red-700 mb-2">
              Esta acción no se puede deshacer. Ten cuidado.
            </p>
            <Button variant="destructive" className="w-full">
              Desactivar Cuenta
            </Button>
          </div>
        </div>
      </Card>

      {/* Botón de Guardar */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancelar</Button>
        <Button className="bg-teal-600 hover:bg-teal-700">
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
