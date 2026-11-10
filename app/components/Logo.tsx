import { useId } from "react";

type TamanhoLogo = "pequeno" | "medio" | "grande";

type LogoProps = {
  tamanho?: TamanhoLogo;
  comTexto?: boolean;
  comTextoSoEmTelaGrande?: boolean;
};

const TAMANHOS: Record<TamanhoLogo, { emblema: string; titulo: string; subtitulo: string }> = {
  pequeno: { emblema: "h-9 w-9", titulo: "text-[22px]", subtitulo: "text-[10px]" },
  medio: { emblema: "h-12 w-12", titulo: "text-[28px]", subtitulo: "text-xs" },
  grande: { emblema: "h-16 w-16", titulo: "text-[36px]", subtitulo: "text-sm" },
};

const CONTORNO = "32,4 56,18 56,46 32,60 8,46 8,18";
const FACE_CENTRAL = "32,18 47,43 17,43";
const ARESTAS = [
  [32, 4, 32, 18], [56, 18, 32, 18], [56, 18, 47, 43], [56, 46, 47, 43],
  [32, 60, 47, 43], [32, 60, 17, 43], [8, 46, 17, 43], [8, 18, 17, 43], [8, 18, 32, 18],
];
const ESTRELA = "M32 27 L34.2 32.8 L40 35 L34.2 37.2 L32 43 L29.8 37.2 L24 35 L29.8 32.8 Z";

export function EmblemaLogo({ classes }: { classes: string }) {
  const id = useId();
  const fundo = `${id}-fundo`;
  const brilho = `${id}-brilho`;

  return (
    <svg className={classes} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={fundo} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-arcano)" />
          <stop offset="1" stopColor="var(--color-mare)" />
        </linearGradient>
        <linearGradient id={brilho} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-essencia)" />
          <stop offset="1" stopColor="var(--color-arcano-texto-escuro)" />
        </linearGradient>
      </defs>
      <polygon points={CONTORNO} fill={`url(#${fundo})`} stroke={`url(#${brilho})`} strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points={FACE_CENTRAL} fill="var(--color-noite)" fillOpacity="0.35" stroke="var(--color-pergaminho)" strokeOpacity="0.85" strokeWidth="1.5" strokeLinejoin="round" />
      {ARESTAS.map(([x1, y1, x2, y2]) => (
        <line key={`${x1}-${y1}-${x2}-${y2}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-pergaminho)" strokeOpacity="0.45" strokeWidth="1.2" />
      ))}
      <path d={ESTRELA} fill="var(--color-essencia)" />
    </svg>
  );
}

export default function Logo({ tamanho = "medio", comTexto = true, comTextoSoEmTelaGrande = false }: LogoProps) {
  const medidas = TAMANHOS[tamanho];

  return (
    <span className="inline-flex items-center gap-2.5" aria-label="RPG de mesa">
      <EmblemaLogo classes={`${medidas.emblema} shrink-0 drop-shadow-[0_0_6px_var(--color-arcano)]`} />
      {comTexto && (
        <span className={`${comTextoSoEmTelaGrande ? "hidden sm:flex" : "flex"} flex-col leading-none`} aria-hidden="true">
          <span className={`font-titulo font-bold tracking-wide ${medidas.titulo}`}>RPG</span>
          <span className={`font-texto tracking-[0.3em] uppercase opacity-75 ${medidas.subtitulo}`}>de mesa</span>
        </span>
      )}
    </span>
  );
}
