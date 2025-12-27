import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  /**
   * Tamaño del logo
   * @default "default" - 40x40px
   * @option "sm" - 32x32px
   * @option "md" - 48x48px
   * @option "lg" - 64x64px
   * @option "xl" - 80x80px
   */
  size?: "sm" | "default" | "md" | "lg" | "xl";

  /**
   * Clase CSS adicional
   */
  className?: string;

  /**
   * Mostrar texto junto al logo
   * @default false
   */
  showText?: boolean;

  /**
   * Variante del texto
   * @default "full" - "APFF Sistema Arrecifal Lobos-Tuxpan"
   * @option "short" - "APFF"
   * @option "subtitle" - Muestra subtítulo debajo
   */
  textVariant?: "full" | "short" | "subtitle";

  /**
   * Subtítulo personalizado
   */
  subtitle?: string;
}

const sizeMap = {
  sm: { px: 32, class: "w-8 h-8" },
  default: { px: 40, class: "w-10 h-10" },
  md: { px: 48, class: "w-12 h-12" },
  lg: { px: 64, class: "w-16 h-16" },
  xl: { px: 80, class: "w-20 h-20" },
};

export function Logo({
  size = "default",
  className,
  showText = false,
  textVariant = "short",
  subtitle,
}: LogoProps) {
  const logoSize = sizeMap[size];

  const logoContent = (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("flex-shrink-0", logoSize.class)}>
        <Image
          src="/logotipo-editado-1.svg"
          alt="APFF Sistema Arrecifal Lobos-Tuxpan"
          width={logoSize.px}
          height={logoSize.px}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col [&>*]:leading-tight">
          <h1
            className={cn(
              "font-bold text-[var(--isla-dark-teal)]",
              size === "sm" && "text-sm",
              size === "default" && "text-base",
              size === "md" && "text-lg",
              size === "lg" && "text-xl",
              size === "xl" && "text-2xl"
            )}
          >
            {textVariant === "full"
              ? "APFF Sistema Arrecifal Lobos-Tuxpan"
              : "APFF"}
          </h1>
          {(textVariant === "subtitle" || subtitle) && (
            <p
              className={cn(
                "text-[var(--isla-teal)]",
                size === "sm" && "text-xs",
                size === "default" && "text-xs",
                size === "md" && "text-sm",
                size === "lg" && "text-sm",
                size === "xl" && "text-base"
              )}
            >
              {subtitle || "Sistema Arrecifal Lobos-Tuxpan"}
            </p>
          )}
        </div>
      )}
    </div>
  );

  return logoContent;
}
