import { link, listaMarcadores } from "../estilos";
import PaginaLegal, { type SecaoLegal } from "./PaginaLegal";

const URL_SRD = "https://dnd.wizards.com/resources/systems-reference-document";
const URL_CC_BY = "https://creativecommons.org/licenses/by/4.0/legalcode";

const linkExterno = (url: string, texto: string) => (
  <a className={link} href={url} target="_blank" rel="noreferrer">{texto}</a>
);

const resumo = (
  <p>
    Este projeto de estudo usa materiais de terceiros com licenças abertas. Esta página dá o crédito que cada licença pede.
  </p>
);

const secoes: SecaoLegal[] = [
  {
    titulo: "Regras do template 5e",
    conteudo: (
      <>
        <p>
          O template de ficha &quot;5e (SRD 5.1)&quot; inclui material do System Reference Document 5.1 (&quot;SRD 5.1&quot;) da Wizards of the
          Coast LLC, disponível em {linkExterno(URL_SRD, URL_SRD)}. O SRD 5.1 é licenciado sob a{" "}
          {linkExterno(URL_CC_BY, "Creative Commons Attribution 4.0 International License")}.
        </p>
        <p>Os nomes de atributos, perícias, condições, classes e raças foram traduzidos para o português pelo projeto.</p>
      </>
    ),
  },
  {
    titulo: "Marcas",
    conteudo: (
      <p>
        Dungeons &amp; Dragons e D&amp;D são marcas da Wizards of the Coast LLC. Este projeto não é afiliado, patrocinado nem endossado
        pela Wizards of the Coast.
      </p>
    ),
  },
  {
    titulo: "Fontes e ícones",
    conteudo: (
      <ul className={listaMarcadores}>
        <li>Fontes Almendra e Literata, pela {linkExterno("https://fonts.google.com", "Google Fonts")}, sob a SIL Open Font License 1.1.</li>
        <li>Ícones do {linkExterno("https://icons.getbootstrap.com", "Bootstrap Icons")}, sob a licença MIT.</li>
      </ul>
    ),
  },
];

export default function Creditos() {
  return <PaginaLegal titulo="Créditos" resumo={resumo} secoes={secoes} />;
}
