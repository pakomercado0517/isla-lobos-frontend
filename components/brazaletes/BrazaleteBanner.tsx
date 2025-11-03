import React from "react";

type Props = {
  /** Width will be controlled by the parent container. Height is responsive. */
  className?: string;
  /** Optional text to show on the gold ribbon (keeps default look when omitted) */
  ribbonText?: string[];
};

export default function BrazaleteBanner({ className = "", ribbonText }: Props) {
  const lines = ribbonText ?? [
    "PAQUETE DE CONSERVACIÓN - ÁREA NATURAL",
    "Contribución voluntaria: $XX.XX",
  ];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-2xl ${className}`}
      role="img"
      aria-label="Brazalete estilo banner con cinta dorada"
    >
      {/* Background (maroon textured gradient) */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(90deg,#6b0f1a 0%, #8a1f2a 40%, #7a1420 60%, #5b0c13 100%)",
          }}
        />
        {/* subtle diagonal lines overlay to suggest texture */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="lines"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2"
                stroke="rgba(255,255,255,0.02)"
                strokeWidth="1"
              />
            </pattern>
            <filter id="grain">
              <feTurbulence
                baseFrequency="0.8"
                numOctaves="2"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" />
            </filter>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>
      </div>

      {/* Gold wavy ribbon (SVG) */}
      <svg
        viewBox="0 0 1200 200"
        className="absolute left-0 right-0 -top-6 md:-top-8 lg:-top-12 h-28 md:h-36 lg:h-44 w-[150%] transform -translate-x-12"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#f6d16b" />
            <stop offset="50%" stopColor="#e6b84a" />
            <stop offset="100%" stopColor="#c8922a" />
          </linearGradient>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="8"
              floodColor="#000"
              floodOpacity="0.25"
            />
          </filter>
        </defs>

        {/* Ribbon shape */}
        <path
          d="M0,80 C150,10 350,150 600,80 C850,10 1050,150 1200,80 L1200,200 L0,200 Z"
          fill="url(#goldGrad)"
          filter="url(#softShadow)"
        />

        {/* inner highlight */}
        <path
          d="M0,95 C150,30 350,165 600,95 C850,30 1050,165 1200,95"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      {/* Content layer */}
      <div className="relative z-10 flex items-center gap-4 px-4 md:px-6 lg:px-10 py-6 md:py-8">
        {/* Left emblem */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/10">
            {/* Stylized white emblem */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 md:w-16 md:h-16">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="3"
              />
              <path
                d="M30 55 Q42 30 60 50 Q72 68 80 46"
                fill="none"
                stroke="rgba(255,255,255,0.95)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Main body texts and small logos */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="max-w-[65%]">
              <h3 className="text-white text-sm md:text-base font-semibold tracking-wide">
                Conservación y Manejo del Área Protegida
              </h3>
              <p className="text-white/80 text-xs md:text-sm mt-1">
                Donación voluntaria para conservación — Recibirá comprobante
                fiscal según corresponda.
              </p>
            </div>

            {/* small rectangular seal on the right */}
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="w-24 h-12 rounded-md bg-white/10 flex items-center justify-center border border-white/10 text-xs text-white/90 font-medium">
                CONANP
              </div>
              <div className="w-24 h-8 rounded-md bg-white/6 text-[11px] text-white/80 flex items-center justify-center">
                www.gob.mx
              </div>
            </div>
          </div>

          {/* Spacer to let ribbon overlay */}
          <div className="mt-4">
            <div className="flex items-center gap-3">
              {/* small logos row */}
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 rounded bg-white/8 flex items-center justify-center text-[10px]">
                  S
                </div>
                <div className="w-8 h-8 rounded bg-white/8 flex items-center justify-center text-[10px]">
                  M
                </div>
                <div className="w-8 h-8 rounded bg-white/8 flex items-center justify-center text-[10px]">
                  E
                </div>
              </div>

              <p className="text-white/70 text-[12px] md:text-sm">
                Valor aproximado: $XX.XX MXN
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gold ribbon text overlay (centered on the ribbon) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-full max-w-4xl px-6 md:px-12 lg:px-20">
          <div className="relative">
            <div className="text-center -mt-2 md:-mt-3 lg:-mt-5">
              {lines.map((t, i) => (
                <div
                  key={i}
                  className={`text-xs md:text-sm lg:text-base font-semibold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-amber-900`}
                  style={{ textShadow: "0 1px 0 rgba(255,255,255,0.12)" }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer tiny decorative strip to mimic the rightmost darker panel */}
      <div className="absolute right-4 bottom-3 hidden md:flex flex-col items-center gap-1">
        <div className="w-16 h-10 rounded-md bg-gradient-to-b from-emerald-700 to-emerald-600 flex items-center justify-center text-xs text-white">
          Seal
        </div>
      </div>
    </div>
  );
}
