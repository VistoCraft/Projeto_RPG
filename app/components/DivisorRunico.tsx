const RUNAS = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ";

export default function DivisorRunico() {
  return (
    <div className="col-span-2 flex items-center gap-4" aria-hidden="true">
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-essencia"></span>
      <span className="bg-linear-to-r from-essencia to-arcano bg-clip-text text-[22px] tracking-[0.3em] text-transparent drop-shadow-[0_0_6px_var(--color-arcano)]">{RUNAS}</span>
      <span className="h-px flex-1 bg-linear-to-r from-arcano to-transparent"></span>
    </div>
  );
}
