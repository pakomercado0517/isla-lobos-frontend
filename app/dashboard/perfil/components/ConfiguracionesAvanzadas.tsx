"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Shield,
  Key,
  Smartphone,
  Bell,
  Database,
  Download,
  Upload,
  Users,
  Mail,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export function ConfiguracionesAvanzadas() {
  return (
    <Card className="mb-4 md:mb-6">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg flex-wrap">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 md:w-5 md:h-5 text-[var(--isla-teal)] flex-shrink-0" />
            <span className="truncate">Configuraciones Avanzadas</span>
          </div>
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] md:text-xs"
          >
            <Shield className="w-2.5 h-2.5 md:w-3 md:h-3 mr-0.5 md:mr-1" />
            Solo CONANP
          </Badge>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Configuraciones administrativas y de seguridad
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Seguridad y Acceso */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-xs md:text-sm">
              <Shield className="w-3 h-3 md:w-4 md:h-4 text-red-500 flex-shrink-0" />
              Seguridad y Acceso
            </h4>

            <div className="space-y-2 md:space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <Key className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">Cambiar Contraseña</div>
                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                    Actualizar credenciales
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <Smartphone className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">Autenticación 2FA</div>
                  <div className="text-[10px] md:text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-500 flex-shrink-0" />
                      No configurado
                    </span>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <Users className="w-3 h-3 md:w-4 md:h-4 text-purple-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">
                    Gestión de Sesiones
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                    Ver y cerrar sesiones activas
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Notificaciones y Comunicación */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-xs md:text-sm">
              <Bell className="w-3 h-3 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
              Notificaciones
            </h4>

            <div className="space-y-2 md:space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <Bell className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">Configurar Alertas</div>
                  <div className="text-[10px] md:text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-500 flex-shrink-0" />
                      Email y WhatsApp OK
                    </span>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-indigo-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">Templates de Email</div>
                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                    Personalizar mensajes
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <MessageSquare className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">Mensajes WhatsApp</div>
                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                    Config. notificaciones
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Sistema y Datos */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-xs md:text-sm">
              <Database className="w-3 h-3 md:w-4 md:h-4 text-teal-500 flex-shrink-0" />
              Sistema y Datos
            </h4>

            <div className="space-y-2 md:space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <Download className="w-3 h-3 md:w-4 md:h-4 text-blue-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">Exportar Datos</div>
                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                    Backup completo
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <Upload className="w-3 h-3 md:w-4 md:h-4 text-green-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">Importar Datos</div>
                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                    Migración y restauración
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <Database className="w-3 h-3 md:w-4 md:h-4 text-purple-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">Optimizar BD</div>
                  <div className="text-[10px] md:text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-500 flex-shrink-0" />
                      Última: 2 días
                    </span>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Configuraciones del Sistema */}
          <div className="space-y-3 md:space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-xs md:text-sm">
              <Settings className="w-3 h-3 md:w-4 md:h-4 text-gray-500 flex-shrink-0" />
              Configuraciones
            </h4>

            <div className="space-y-2 md:space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <Settings className="w-3 h-3 md:w-4 md:h-4 text-gray-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">
                    Parámetros Globales
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                    Capacidades, horarios
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <Users className="w-3 h-3 md:w-4 md:h-4 text-orange-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">
                    Gestión de Usuarios
                  </div>
                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                    Invitaciones, permisos
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start gap-2 md:gap-3 h-auto py-2 md:py-3 text-xs md:text-sm"
              >
                <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-red-600 flex-shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium truncate">Modo Mantenimiento</div>
                  <div className="text-[10px] md:text-xs text-gray-500 truncate">
                    Actualizaciones críticas
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Nota Importante */}
        <div className="bg-amber-50 rounded-lg p-3 md:p-4 mt-4 md:mt-6 border border-amber-200">
          <div className="flex items-start gap-2 md:gap-3">
            <div className="bg-amber-100 rounded-full p-1.5 md:p-2 flex-shrink-0">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-amber-900 mb-1 text-xs md:text-sm">
                Acceso Administrativo
              </h4>
              <p className="text-[10px] md:text-sm text-amber-700 mb-2">
                Estas configuraciones solo están disponibles para usuarios
                CONANP. Cualquier cambio afectará todo el sistema.
              </p>
              <div className="text-[9px] md:text-xs text-amber-600">
                🔐 Privilegios Elevados | ⚠️ Usar con Precaución | 📞 Soporte:
                ext. 101
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
