export function formatDateForExport(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-MX");
}

export function generateExportFilename(format: "csv" | "excel"): string {
  const date = new Date().toISOString().split("T")[0];
  const extension = format === "csv" ? "csv" : "xls";
  return `brazaletes-busqueda-${date}.${extension}`;
}

export function createExportBlob(content: string, format: "csv" | "excel"): Blob {
  const mimeType = format === "csv" 
    ? "text/csv;charset=utf-8;" 
    : "application/vnd.ms-excel";
  
  return new Blob([content], { type: mimeType });
}

export function downloadFile(blob: Blob, filename: string): void {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
