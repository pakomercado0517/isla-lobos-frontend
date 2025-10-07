import { Ship } from "lucide-react";

interface BienvenidaHeaderProps {
  nombreUsuario: string;
}

export function BienvenidaHeader({ nombreUsuario }: BienvenidaHeaderProps) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-[var(--isla-teal)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Ship className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)] mb-2">
        ¡Bienvenido, {nombreUsuario}!
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Gestiona tus embarcaciones, registra salidas y mantén un control completo
        de tus operaciones turísticas en Isla Lobos.
      </p>
    </div>
  );
}

