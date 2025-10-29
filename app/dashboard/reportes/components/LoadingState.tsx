export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px] p-4">
      <div className="text-center">
        <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
        <p className="text-sm md:text-base text-slate-600">
          Cargando reportes...
        </p>
      </div>
    </div>
  );
}
