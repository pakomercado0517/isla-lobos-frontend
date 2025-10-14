export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[var(--isla-dark-teal)] font-medium">
          Cargando invitaciones...
        </p>
      </div>
    </div>
  );
}
