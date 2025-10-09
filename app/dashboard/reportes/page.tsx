import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/user";
import { getAllReportesData } from "@/actions/reportes";
import { ReportesContent } from "./components/ReportesContent";

// Forzar renderizado dinámico porque usa cookies para autenticación
export const dynamic = "force-dynamic";

export default async function ReportesPage() {
  // Verificar autenticación y rol
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.rol !== "conanp") {
    redirect("/prestador");
  }

  // Calcular fechas por defecto (primer día del mes actual hasta hoy)
  // Usar zona horaria local para evitar problemas de desfase
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

  // Formatear fechas usando zona horaria local (no UTC)
  const fechaInicio = `${primerDiaMes.getFullYear()}-${String(
    primerDiaMes.getMonth() + 1
  ).padStart(2, "0")}-${String(primerDiaMes.getDate()).padStart(2, "0")}`;
  const fechaFin = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(hoy.getDate()).padStart(2, "0")}`;

  console.log("📊 ReportesPage: Cargando datos iniciales con filtros:", {
    fechaInicio,
    fechaFin,
  });

  // Obtener datos del reporte con filtros iniciales
  const reporteResult = await getAllReportesData({
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
  });

  // Manejar error en la carga inicial
  if (!reporteResult.success || !reporteResult.data) {
    console.error(
      "📊 ReportesPage: Error al cargar datos:",
      reporteResult.error
    );

    // Datos por defecto en caso de error
    const defaultData = {
      estadisticas: {
        total_usuarios: 0,
        total_embarcaciones: 0,
        embarcaciones_activas: 0,
        total_salidas_hoy: 0,
        total_pasajeros_hoy: 0,
        ocupacion_promedio: 0,
        ingresos_estimados: 0,
        salidas_este_mes: 0,
        pasajeros_este_mes: 0,
        tendencia_mes_anterior: 0,
      },
      ocupacion_por_dia: [],
      reporte_por_prestador: [],
    };

    return (
      <ReportesContent
        initialData={defaultData}
        initialFechaInicio={fechaInicio}
        initialFechaFin={fechaFin}
        initialError={
          reporteResult.error ||
          "Error al cargar los datos del reporte. Por favor, intenta nuevamente."
        }
      />
    );
  }

  console.log("📊 ReportesPage: Datos cargados exitosamente:", {
    estadisticas: reporteResult.data.estadisticas,
    ocupacion_count: reporteResult.data.ocupacion_por_dia.length,
    prestadores_count: reporteResult.data.reporte_por_prestador.length,
  });

  return (
    <ReportesContent
      initialData={reporteResult.data}
      initialFechaInicio={fechaInicio}
      initialFechaFin={fechaFin}
    />
  );
}
