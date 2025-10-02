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
      <div className="px-6 py-4">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && <span className="text-gray-300">/</span>}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-[var(--isla-teal)] transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-700 font-medium">
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Main header content */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Back button */}
            {backHref && (
              <div className="mb-3">
                <Link href={backHref}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-[var(--isla-teal)] hover:bg-[var(--isla-teal)]/10"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {backLabel}
                  </Button>
                </Link>
              </div>
            )}

            {/* Title and description */}
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 truncate">
                {title}
              </h1>
              {badge && (
                <Badge
                  variant={badge.variant || "secondary"}
                  className="shrink-0"
                >
                  {badge.text}
                </Badge>
              )}
            </div>

            {description && (
              <p className="text-gray-600 text-lg">{description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={refreshing}
                className="shrink-0"
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")}
                />
                Actualizar
              </Button>
            )}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}
