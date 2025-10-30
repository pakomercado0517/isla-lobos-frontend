import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  backHref,
  backLabel = "Volver",
  actions,
  onRefresh,
  refreshing = false,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10",
        className
      )}
    >
      <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 overflow-x-auto">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                {index > 0 && <span className="text-gray-300">/</span>}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-[var(--isla-teal)] transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-700 font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Main header content */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            {/* Back button */}
            {backHref && (
              <div className="mb-2 sm:mb-3">
                <Link href={backHref}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-[var(--isla-teal)] hover:bg-[var(--isla-teal)]/10 h-8 sm:h-9 text-xs sm:text-sm"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {backLabel}
                  </Button>
                </Link>
              </div>
            )}

            {/* Title and description */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words sm:truncate">
                {title}
              </h1>
              {badge && (
                <Badge
                  variant={badge.variant || "secondary"}
                  className="shrink-0 w-fit text-xs"
                >
                  {badge.text}
                </Badge>
              )}
            </div>

            {description && (
              <p className="text-gray-600 text-sm sm:text-base md:text-lg">{description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:ml-4">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={refreshing}
                className="shrink-0 h-8 sm:h-9 text-xs sm:text-sm"
              >
                <RefreshCw
                  className={cn("w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2", refreshing && "animate-spin")}
                />
                <span className="hidden sm:inline">Actualizar</span>
                <span className="sm:hidden">Actualizar</span>
              </Button>
            )}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}
