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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[var(--isla-teal)]" />
          <span>Configuraciones Avanzadas</span>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Shield className="w-3 h-3 mr-1" />
            Solo CONANP
          </Badge>
        </CardTitle>
        <CardDescription>
          Configuraciones administrativas y de seguridad del sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Seguridad y Acceso */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              Seguridad y Acceso
            </h4>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Key className="w-4 h-4 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">Cambiar Contraseña</div>
                  <div className="text-xs text-gray-500">
                    Actualizar credenciales administrativas
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Smartphone className="w-4 h-4 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">Autenticación 2FA</div>
                  <div className="text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      No configurado - Recomendado
                    </span>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Users className="w-4 h-4 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium">Gestión de Sesiones</div>
                  <div className="text-xs text-gray-500">
                    Ver y cerrar sesiones activas
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Notificaciones y Comunicación */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-500" />
              Notificaciones y Comunicación
            </h4>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Bell className="w-4 h-4 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">Configurar Alertas</div>
                  <div className="text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Email y WhatsApp configurados
                    </span>
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Mail className="w-4 h-4 text-indigo-600" />
                <div className="text-left">
                  <div className="font-medium">Templates de Email</div>
                  <div className="text-xs text-gray-500">
                    Personalizar mensajes automáticos
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <MessageSquare className="w-4 h-4 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">Mensajes WhatsApp</div>
                  <div className="text-xs text-gray-500">
                    Configurar notificaciones automáticas
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Sistema y Datos */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-teal-500" />
              Sistema y Datos
            </h4>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">Exportar Datos</div>
                  <div className="text-xs text-gray-500">
                    Backup completo del sistema
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Upload className="w-4 h-4 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">Importar Datos</div>
                  <div className="text-xs text-gray-500">
                    Migración y restauración
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Database className="w-4 h-4 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium">Optimizar Base de Datos</div>
                  <div className="text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      Última optimización: 2 días
                    </span>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Configuraciones del Sistema */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              Configuraciones del Sistema
            </h4>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Settings className="w-4 h-4 text-gray-600" />
                <div className="text-left">
                  <div className="font-medium">Parámetros Globales</div>
                  <div className="text-xs text-gray-500">
                    Capacidades, horarios, restricciones
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <Users className="w-4 h-4 text-orange-600" />
                <div className="text-left">
                  <div className="font-medium">Gestión de Usuarios</div>
                  <div className="text-xs text-gray-500">
                    Invitaciones, permisos, suspensiones
                  </div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-auto py-3"
              >
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <div className="text-left">
                  <div className="font-medium">Modo de Mantenimiento</div>
                  <div className="text-xs text-gray-500">
                    Activar para actualizaciones críticas
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Nota Importante */}
        <div className="bg-amber-50 rounded-lg p-4 mt-8 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="bg-amber-100 rounded-full p-2">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-1">
                Acceso Administrativo
              </h4>
              <p className="text-sm text-amber-700 mb-2">
                Estas configuraciones solo están disponibles para usuarios con 
                rol de CONANP. Cualquier cambio afectará todo el sistema.
              </p>
              <div className="text-xs text-amber-600">
                🔐 Privilegios Elevados | ⚠️ Usar con Precaución | 📞 Soporte: ext. 101
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}