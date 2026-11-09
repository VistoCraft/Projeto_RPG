import Link from "next/link";
import { EMAIL_CONTATO, PRAZO_EXCLUSAO_DIAS, PRAZO_RESPOSTA_DIAS, RESPONSAVEL_PROJETO } from "@/src/dominio/termos";
import { IDADE_MINIMA } from "@/src/dominio/perfil";
import PaginaLegal, { type SecaoLegal } from "./PaginaLegal";
import { link, listaMarcadores } from "../estilos";

const emailContato = <a className={link} href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a>;

const resumo = (
  <p>
    <strong>Projeto de estudo, sem fins comerciais.</strong> Coletamos só o necessário para o site funcionar. Seus dados não são
    vendidos, não são usados para publicidade e o site não tem anúncios nem rastreadores de terceiros. Esta política segue a Lei
    Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
  </p>
);

const secoes: SecaoLegal[] = [
  {
    titulo: "Quem cuida dos seus dados",
    conteudo: (
      <p>
        O responsável pelos dados (controlador) é {RESPONSAVEL_PROJETO}, pessoa física que mantém este projeto de estudo. Para
        qualquer assunto sobre privacidade, escreva para {emailContato}.
      </p>
    ),
  },
  {
    titulo: "Quais dados coletamos",
    conteudo: (
      <ul className={listaMarcadores}>
        <li><strong>No cadastro:</strong> e-mail, senha, nickname, país, data de nascimento e, se você quiser, como conheceu o site. Também guardamos a data e a versão dos termos que você aceitou.</li>
        <li><strong>Senha:</strong> nunca é guardada como texto. Guardamos apenas um código derivado dela (hash), que não permite descobrir a senha.</li>
        <li><strong>Ao usar o site:</strong> o conteúdo que você criar, como mesas, fichas e mensagens, conforme essas funções forem lançadas.</li>
        <li><strong>Dados técnicos:</strong> um cookie de sessão para manter você conectado. A hospedagem pode registrar dados técnicos de acesso, como endereço IP e horário, para segurança e diagnóstico.</li>
        <li><strong>No seu navegador:</strong> a preferência de tema (claro ou escuro) e os dados da ficha de teste ficam guardados apenas no seu aparelho (armazenamento local do navegador) e não são enviados para o servidor.</li>
      </ul>
    ),
  },
  {
    titulo: "Para que usamos os dados",
    conteudo: (
      <ul className={listaMarcadores}>
        <li><strong>Criar e manter a sua conta e o login</strong> (e-mail, senha, cookie de sessão): necessário para oferecer o serviço que você pediu (art. 7º, V, da LGPD).</li>
        <li><strong>Confirmar a idade mínima de {IDADE_MINIMA} anos</strong> (data de nascimento): para cumprir a regra de idade destes termos.</li>
        <li><strong>Identificar você para os outros jogadores</strong> (nickname): o nickname aparece nas mesas e no cabeçalho.</li>
        <li><strong>Entender quem usa o projeto</strong> (país e como conheceu): estatísticas simples para o aprendizado, com base no seu consentimento (art. 7º, I). A resposta sobre como conheceu é opcional.</li>
        <li><strong>Segurança</strong> (dados técnicos): prevenir abusos e corrigir erros, com base no legítimo interesse (art. 7º, IX).</li>
      </ul>
    ),
  },
  {
    titulo: "O que os outros usuários veem",
    conteudo: (
      <p>
        Outros usuários veem o seu nickname e o conteúdo que você publicar nas mesas de que participa. O seu e-mail, a sua data de
        nascimento e o seu país não são mostrados a outros usuários.
      </p>
    ),
  },
  {
    titulo: "Com quem compartilhamos",
    conteudo: (
      <>
        <p>Não vendemos, alugamos nem cedemos os seus dados. Eles só podem ser acessados por:</p>
        <ul className={listaMarcadores}>
          <li>serviços de infraestrutura necessários para o site funcionar, como hospedagem e banco de dados;</li>
          <li>autoridades, quando houver obrigação legal ou ordem judicial.</li>
        </ul>
        <p>
          Os servidores de hospedagem podem ficar fora do Brasil. Nesse caso, a transferência segue as regras da LGPD.
        </p>
      </>
    ),
  },
  {
    titulo: "Cookies",
    conteudo: (
      <p>
        Usamos apenas um cookie essencial, que mantém você conectado depois do login. Não usamos cookies de publicidade nem de
        análise de navegação. As fontes e os ícones são servidos pelo próprio site, sem chamadas a serviços de terceiros.
      </p>
    ),
  },
  {
    titulo: "Segurança",
    conteudo: (
      <p>
        A senha é guardada como hash, o acesso ao banco de dados é restrito e a conexão com o site publicado usa HTTPS. Nenhum
        sistema é totalmente seguro: se acontecer um incidente que possa trazer risco a você, os usuários afetados serão avisados.
      </p>
    ),
  },
  {
    titulo: "Por quanto tempo guardamos",
    conteudo: (
      <p>
        Os dados ficam guardados enquanto a sua conta existir. Se você pedir a exclusão, eles são apagados em até{" "}
        {PRAZO_EXCLUSAO_DIAS} dias, salvo quando a lei exigir que algo seja mantido. Se o projeto for encerrado, os dados serão
        apagados.
      </p>
    ),
  },
  {
    titulo: "Seus direitos",
    conteudo: (
      <>
        <p>Pela LGPD (art. 18), você pode, a qualquer momento:</p>
        <ul className={listaMarcadores}>
          <li>confirmar se tratamos dados seus e ter acesso a eles;</li>
          <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>pedir a anonimização, o bloqueio ou a exclusão dos dados;</li>
          <li>pedir a portabilidade dos dados;</li>
          <li>saber com quem os dados foram compartilhados;</li>
          <li>revogar o consentimento, o que pode levar à exclusão da conta;</li>
          <li>reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</li>
        </ul>
        <p>
          Para exercer esses direitos, escreva para {emailContato}. A resposta será enviada em até {PRAZO_RESPOSTA_DIAS} dias.
        </p>
      </>
    ),
  },
  {
    titulo: "Menores de idade",
    conteudo: (
      <p>
        O site não é destinado a menores de {IDADE_MINIMA} anos. Se identificarmos uma conta de menor, ela e os dados ligados a
        ela serão excluídos.
      </p>
    ),
  },
  {
    titulo: "Mudanças nesta política",
    conteudo: (
      <p>
        Esta política pode ser atualizada. A data da última atualização fica no topo da página e mudanças importantes serão avisadas.
        Veja também os <Link className={link} href="/termos">Termos de uso</Link>.
      </p>
    ),
  },
];

export default function PoliticaPrivacidade() {
  return <PaginaLegal titulo="Política de privacidade" resumo={resumo} secoes={secoes} />;
}
