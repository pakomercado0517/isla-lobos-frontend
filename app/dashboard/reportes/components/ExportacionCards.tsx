import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

interface ExportacionCardsProps {
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export function ExportacionCards({
  onExportExcel,
  onExportPDF,
}: ExportacionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Exportar a Excel
          </CardTitle>
          <CardDescription>
            Descarga un archivo Excel con todos los datos del período
            seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Incluye:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Estadísticas generales</li>
                <li>Ocupación por día</li>
                <li>Reporte por prestador</li>
                <li>Detalle de salidas</li>
              </ul>
            </div>
            <Button onClick={onExportExcel} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Descargar Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Exportar a PDF
          </CardTitle>
          <CardDescription>
            Genera un reporte ejecutivo en formato PDF
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Incluye:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Resumen ejecutivo</li>
                <li>Gráficas de tendencias</li>
                <li>Análisis comparativo</li>
                <li>Recomendaciones</li>
              </ul>
            </div>
            <Button onClick={onExportPDF} className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

