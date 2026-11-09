import { faixaDestaque } from "../estilos";

export default function BannerHub() {
  return (
    <section className={faixaDestaque}>
      <h1 className="font-titulo text-[2.5rem] leading-tight font-bold">Hub de mesas</h1>
      <p className="mx-auto mt-3 max-w-[520px] text-lg">Escolha uma mesa e reúna seu grupo para a próxima sessão.</p>
    </section>
  );
}
