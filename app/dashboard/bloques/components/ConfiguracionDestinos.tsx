"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Settings, 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Info,
  BarChart3
} from "lucide-react";
import { DESTINOS, type DestinoType } from "@/lib/types/salida";

interface ConfiguracionDestinosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DestinoConfig {
  destino: DestinoType;
  bloques_habilitados: boolean;
  plantillas_count: number;
  bloques_hoy_count: number;
  capacidad_total_hoy: number;
  ocupacion_promedio: number;
  estado: 'configurado' | 'sin_configurar' | 'parcial';
  ultimo_uso: string | null;
}

export function ConfiguracionDestinos({ open, onOpenChange }: ConfiguracionDestinosProps) {
  const [configuraciones, setConfiguraciones] = useState<DestinoConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("resumen");

  // Simulación de datos - En producción se obtendría de la API
  useEffect(() => {
    const mockData: DestinoConfig[] = [
      {
        destino: DESTINOS.ISLA_LOBOS,
        bloques_habilitados: true,
        plantillas_count: 3,
        bloques_hoy_count: 3,
        capacidad_total_hoy: 195,
        ocupacion_promedio: 78.5,
        estado: 'configurado',
        ultimo_uso: new Date().toISOString(),
      },
      {
        destino: DESTINOS.ARRECIFE_TUXPAN,
        bloques_habilitados: false,
        plantillas_count: 0,
        bloques_hoy_count: 0,
        capacidad_total_hoy: 0,
        ocupacion_promedio: 0,
        estado: 'sin_configurar',
        ultimo_uso: null,
      },
      {
        destino: DESTINOS.ARRECIFE_EN_MEDIO,
        bloques_habilitados: true,
        plantillas_count: 2,
        bloques_hoy_count: 2,
        capacidad_total_hoy: 80,
        ocupacion_promedio: 45.2,
        estado: 'configurado',
        ultimo_uso: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        destino: DESTINOS.ARRECIFE_TANHUIJO,
        bloques_habilitados: false,
        plantillas_count: 0,
        bloques_hoy_count: 0,
        capacidad_total_hoy: 0,
        ocupacion_promedio: 0,
        estado: 'sin_configurar',
        ultimo_uso: null,
      },
    ];
    setConfiguraciones(mockData);
  }, []);

  const handleToggleBloques = async (destino: DestinoType, habilitar: boolean) => {
    setLoading(true);
    try {
      // TODO: Implementar llamada a API
      // const result = await toggleBloquesDestino(destino, habilitar);
      
      setConfiguraciones(configs => 
        configs.map(config => 
          config.destino === destino 
            ? { 
                ...config, 
                bloques_habilitados: habilitar,
                estado: habilitar ? 'configurado' : 'sin_configurar'
              }
            : config
        )
      );
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado: DestinoConfig['estado']) => {
    switch (estado) {
      case 'configurado':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1" />Configurado</Badge>;
      case 'sin_configurar':
        return <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" />Sin Configurar</Badge>;
      case 'parcial':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><AlertTriangle className="w-3 h-3 mr-1" />Parcial</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return 'Nunca';
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(fecha));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración de Bloques por Destino
          </DialogTitle>
          <DialogDescription>
            Gestiona qué destinos utilizan bloques horarios. Puedes habilitar o deshabilitar el sistema de bloques para cada destino individualmente.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resumen" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Resumen General
            </TabsTrigger>
            <TabsTrigger value="configuracion" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {configuraciones.map((config) => (
                <Card key={config.destino} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {config.destino}
                      </CardTitle>
                      {getEstadoBadge(config.estado)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Bloques Habilitados:</span>
                        <span className="font-medium">
                          {config.bloques_habilitados ? '✅ Sí' : '❌ No'}
                        </span>
                      </div>
                      
                      {config.bloques_habilitados && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Plantillas:</span>
                            <span className="font-medium">{config.plantillas_count}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Bloques Hoy:</span>
                            <span className="font-medium">{config.bloques_hoy_count}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Capacidad Total:</span>
                            <span className="font-medium flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {config.capacidad_total_hoy}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Ocupación Promedio:</span>
                            <span className="font-medium text-blue-600">
                              {config.ocupacion_promedio.toFixed(1)}%
                            </span>
                          </div>
                        </>
                      )}
                      
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm text-slate-600">Último Uso:</span>
                        <span className="text-sm font-medium">
                          {formatFecha(config.ultimo_uso)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="configuracion" className="mt-4">
            <div className="space-y-4">
              {/* Información del sistema híbrido */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-blue-900">Sistema Híbrido de Bloques</h4>
                      <p className="text-sm text-blue-700">
                        Cada destino puede funcionar con <strong>bloques horarios</strong> (capacidad controlada) 
                        o con <strong>horarios libres</strong> (solo especificar hora). Isla de Lobos siempre requiere bloques.
                      </p>
                      <ul className="text-sm text-blue-600 space-y-1 ml-4">
                        <li>• <strong>Con Bloques:</strong> Los prestadores deben seleccionar un bloque disponible</li>
                        <li>• <strong>Sin Bloques:</strong> Los prestadores especifican la hora de salida libremente</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configuración por destino */}
              <div className="space-y-4">
                {configuraciones.map((config) => (
                  <Card key={config.destino}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {config.destino}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {config.destino === DESTINOS.ISLA_LOBOS && (
                              <span className="text-amber-600 font-medium">
                                🔒 Destino con bloques obligatorios (no se puede deshabilitar)
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        {getEstadoBadge(config.estado)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor={`toggle-${config.destino}`} className="text-sm font-medium">
                            Habilitar Bloques Horarios
                          </Label>
                          <p className="text-xs text-slate-500">
                            {config.bloques_habilitados 
                              ? "Los prestadores deben seleccionar un bloque disponible"
                              : "Los prestadores especifican libremente la hora de salida"
                            }
                          </p>
                        </div>
                        <Switch
                          id={`toggle-${config.destino}`}
                          checked={config.bloques_habilitados}
                          onCheckedChange={(checked) => handleToggleBloques(config.destino, checked)}
                          disabled={loading || config.destino === DESTINOS.ISLA_LOBOS}
                        />
                      </div>
                      
                      {config.bloques_habilitados && config.plantillas_count === 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-800">
                            ⚠️ <strong>Sin plantillas configuradas.</strong> 
                            Crea al menos una plantilla de bloque para que este destino funcione correctamente.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}