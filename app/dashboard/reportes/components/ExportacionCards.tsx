import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Users, BarChart3, FileText } from "lucide-react";

interface ExportacionCardsProps {
  onExportEjecutivo: () => void;
  onExportPrestadores: () => void;
  onExportOcupacion: () => void;
  onExportEjecutivoExcel: () => void;
  onExportPrestadoresExcel: () => void;
  onExportOcupacionExcel: () => void;
  isLoading?: boolean;
}

export function ExportacionCards({
  onExportEjecutivo,
  onExportPrestadores,
  onExportOcupacion,
  onExportEjecutivoExcel,
  onExportPrestadoresExcel,
  onExportOcupacionExcel,
  isLoading = false,
}: ExportacionCardsProps) {
  return (
    <div className="space-y-3 md:space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
        <p className="text-xs md:text-sm text-blue-900">
          <strong>📊 Formatos Disponibles:</strong>
        </p>
        <ul className="text-xs md:text-sm text-blue-900 mt-2 space-y-1">
          <li className="break-words">
            <strong>📈 Excel (.xlsx):</strong> Archivos profesionales con
            múltiples hojas, formato corporativo CONANP, colores condicionales y
            fórmulas automáticas.
          </li>
          <li className="break-words">
            <strong>📄 CSV:</strong> Valores separados por punto y coma,
            optimizados para importar en Excel México.
          </li>
        </ul>
        <p className="text-[10px] md:text-xs text-blue-700 mt-2">
          💡 <strong>Recomendado:</strong> Usar Excel para análisis avanzado y
          presentaciones ejecutivas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Reporte Ejecutivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <FileSpreadsheet className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600 flex-shrink-0" />
              <span className="truncate">Reporte Ejecutivo</span>
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Reporte completo con resumen general y métricas clave
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="text-xs md:text-sm text-muted-foreground">
                Incluye:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Resumen general</li>
                  <li>Top 10 prestadores</li>
                  <li>Ocupación diaria</li>
                  <li>Totales y promedios</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={onExportEjecutivoExcel}
                  className="w-full h-9 md:h-10 text-xs md:text-sm bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  <FileSpreadsheet className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  {isLoading ? "Generando..." : "📈 Excel Profesional"}
                </Button>
                <Button
                  onClick={onExportEjecutivo}
                  className="w-full h-9 md:h-10 text-xs md:text-sm"
                  variant="outline"
                  disabled={isLoading}
                >
                  <FileText className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  {isLoading ? "Generando..." : "📄 CSV Simple"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reporte por Prestadores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600 flex-shrink-0" />
              <span className="truncate">Por Prestador</span>
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Análisis detallado del desempeño de cada prestador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="text-xs md:text-sm text-muted-foreground">
                Incluye:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Salidas por prestador</li>
                  <li>Total de pasajeros</li>
                  <li>Ingresos estimados</li>
                  <li>Eficiencia operativa</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={onExportPrestadoresExcel}
                  className="w-full h-9 md:h-10 text-xs md:text-sm bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  <FileSpreadsheet className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  {isLoading ? "Generando..." : "📈 Excel Profesional"}
                </Button>
                <Button
                  onClick={onExportPrestadores}
                  className="w-full h-9 md:h-10 text-xs md:text-sm"
                  variant="outline"
                  disabled={isLoading}
                >
                  <FileText className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  {isLoading ? "Generando..." : "📄 CSV Simple"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reporte de Ocupación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-600 flex-shrink-0" />
              <span className="truncate">Ocupación Diaria</span>
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Análisis día por día de la ocupación y demanda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:space-y-4">
              <div className="text-xs md:text-sm text-muted-foreground">
                Incluye:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Salidas por día</li>
                  <li>Pasajeros por día</li>
                  <li>Porcentaje ocupación</li>
                  <li>Estado de demanda</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={onExportOcupacionExcel}
                  className="w-full h-9 md:h-10 text-xs md:text-sm bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  <FileSpreadsheet className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  {isLoading ? "Generando..." : "📈 Excel Profesional"}
                </Button>
                <Button
                  onClick={onExportOcupacion}
                  className="w-full h-9 md:h-10 text-xs md:text-sm"
                  variant="outline"
                  disabled={isLoading}
                >
                  <FileText className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                  {isLoading ? "Generando..." : "📄 CSV Simple"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
