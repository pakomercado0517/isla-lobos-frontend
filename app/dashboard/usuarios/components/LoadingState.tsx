import { RefreshCw } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center p-4">
      <div className="text-center">
        <RefreshCw className="w-6 h-6 md:w-8 md:h-8 animate-spin mx-auto mb-3 md:mb-4 text-[var(--isla-teal)]" />
        <p className="text-sm md:text-base text-[var(--isla-dark-teal)]">
          Cargando usuarios...
        </p>
      </div>
    </div>
  );
}
