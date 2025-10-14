import { Bell } from "lucide-react";

interface EmptyStateProps {
  mensaje?: string;
}

export function EmptyState({
  mensaje = "No hay notificaciones",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
      <Bell className="h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-600">{mensaje}</p>
    </div>
  );
}
