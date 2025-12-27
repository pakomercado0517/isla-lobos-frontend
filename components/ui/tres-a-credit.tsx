import Image from "next/image";
import { cn } from "@/lib/utils";

interface TresACreditProps {
  /**
   * Variante del crédito
   * @default "created" - "Created by [logo] TresA Design"
   * @option "designed" - "Designed by [logo] TresA Design"
   * @option "full" - "Desarrollado por TresA Design"
   * @option "short" - "TresA Design"
   * @option "minimal" - Solo "TresA Design"
   */
  variant?: "created" | "designed" | "full" | "short" | "minimal";
  
  /**
   * Tamaño del texto
   * @default "sm"
   */
  size?: "xs" | "sm" | "md";
  
  /**
   * Clase CSS adicional
   */
  className?: string;
  
  /**
   * Color del texto
   * @default "muted" - Gris suave
   * @option "default" - Color normal
   */
  color?: "default" | "muted";
  
  /**
   * Mostrar como link (si tienes sitio web)
   */
  asLink?: boolean;
  
  /**
   * URL del sitio web de TresA Design (opcional)
   */
  href?: string;
  
  /**
   * Mostrar logo junto al texto
   * @default true
   */
  showLogo?: boolean;
  
  /**
   * Tamaño del logo en píxeles
   * @default 16
   */
  logoSize?: number;
}

export function TresACredit({
  variant = "created",
  size = "sm",
  className,
  color = "muted",
  asLink = false,
  href = "#",
  showLogo = true,
  logoSize = 16,
}: TresACreditProps) {
  const prefixText = {
    created: "Created by",
    designed: "Designed by",
    full: "Desarrollado por",
    short: "",
    minimal: "",
  };

  const companyName = "TresA Design";
  
  const getDisplayText = () => {
    if (variant === "created" || variant === "designed") {
      return (
        <>
          <span>{prefixText[variant]}</span>
          <span className="mx-1">TresA Design</span>
        </>
      );
    }
    if (variant === "full") {
      return `${prefixText[variant]} ${companyName}`;
    }
    return companyName;
  };

  const sizeClasses = {
    xs: "text-[10px]",
    sm: "text-xs",
    md: "text-sm",
  };

  const colorClasses = {
    default: "text-[var(--isla-dark-teal)]",
    muted: "text-slate-400",
  };

  const content = (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "font-medium",
          sizeClasses[size],
          colorClasses[color]
        )}
      >
        {getDisplayText()}
      </span>
      {showLogo && (
        <div 
          className="flex-shrink-0"
          style={{ width: logoSize, height: logoSize }}
        >
          <Image
            src="/logotipo-editado.svg"
            alt="TresA Design"
            width={logoSize}
            height={logoSize}
            className="w-full h-full object-contain opacity-70"
          />
        </div>
      )}
    </div>
  );

  if (asLink && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "hover:underline transition-colors inline-flex items-center gap-2",
          color === "muted" && "hover:text-slate-600",
          color === "default" && "hover:text-[var(--isla-teal)]"
        )}
      >
        {content}
      </a>
    );
  }

  return content;
}

