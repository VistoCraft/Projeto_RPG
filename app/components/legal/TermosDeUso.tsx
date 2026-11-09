import Link from "next/link";
import { EMAIL_CONTATO, RESPONSAVEL_PROJETO } from "@/src/dominio/termos";
import { IDADE_MINIMA } from "@/src/dominio/perfil";
import PaginaLegal, { type SecaoLegal } from "./PaginaLegal";
import { link, listaMarcadores } from "../estilos";

const emailContato = <a className={link} href={`mailto:${EMAIL_CONTATO}`}>{EMAIL_CONTATO}</a>;

const linkPrivacidade = <Link className={link} href="/privacidade">Política de privacidade</Link>;

const resumo = (
  <p>
    <strong>Este é um projeto pessoal de estudo, sem fins comerciais.</strong> Ele existe para que {RESPONSAVEL_PROJETO} aprenda
    e pratique desenvolvimento web. O uso é gratuito, não há anúncios, nada é vendido e o site pode mudar, ficar fora do ar ou
    ser encerrado a qualquer momento.
  </p>
);

const secoes: SecaoLegal[] = [
  {
    titulo: "Sobre o projeto",
    conteudo: (
      <>
        <p>
          O site é um projeto de aprendizado criado e mantido por {RESPONSAVEL_PROJETO}, pessoa física. Não há empresa por trás dele,
          não é um produto comercial e não existe nenhuma cobrança, assinatura ou plano pago.
        </p>
        <p>
          Por ser um projeto em desenvolvimento, funções podem ser adicionadas, alteradas ou removidas sem aviso prévio, e o site pode
          ser encerrado a qualquer momento.
        </p>
      </>
    ),
  },
  {
    titulo: "Aceite destes termos",
    conteudo: (
      <p>
        Ao criar uma conta, você declara que leu e concorda com estes Termos de uso e com a {linkPrivacidade}. Se não concordar, não
        crie uma conta. Você ainda pode navegar pelas páginas públicas como visitante.
      </p>
    ),
  },
  {
    titulo: "Quem pode usar",
    conteudo: (
      <ul className={listaMarcadores}>
        <li>É preciso ter pelo menos {IDADE_MINIMA} anos para criar uma conta.</li>
        <li>Cada pessoa deve ter uma única conta, com informações verdadeiras.</li>
        <li>Contas de menores de {IDADE_MINIMA} anos, quando identificadas, serão excluídas.</li>
      </ul>
    ),
  },
  {
    titulo: "Sua conta",
    conteudo: (
      <ul className={listaMarcadores}>
        <li>Guarde a sua senha com cuidado. Você é responsável pelo que for feito com a sua conta.</li>
        <li>O nickname não pode se passar por outra pessoa nem ter conteúdo ofensivo, discriminatório ou ilegal.</li>
        <li>Se perceber uso indevido da sua conta, avise pelo e-mail de contato.</li>
      </ul>
    ),
  },
  {
    titulo: "Regras de convivência",
    conteudo: (
      <>
        <p>Ao usar o site, você se compromete a não:</p>
        <ul className={listaMarcadores}>
          <li>praticar assédio, ameaça, discriminação ou discurso de ódio contra outras pessoas;</li>
          <li>publicar conteúdo ilegal, sexual envolvendo menores, violento de forma gratuita ou que viole direitos de terceiros;</li>
          <li>tentar invadir, sobrecarregar ou explorar falhas do site, ou acessar dados de outras pessoas;</li>
          <li>usar robôs ou automações que prejudiquem o funcionamento do site.</li>
        </ul>
        <p>Encontrou uma falha de segurança? Avise pelo e-mail de contato, sem explorá-la.</p>
      </>
    ),
  },
  {
    titulo: "O conteúdo que você cria",
    conteudo: (
      <p>
        Mesas, fichas, mensagens e outros conteúdos que você criar continuam sendo seus. Ao publicá-los, você permite que o site os
        guarde e os mostre aos participantes, apenas para que as funções funcionem. Você é responsável por ter o direito de usar o
        que enviar. Conteúdo que viole estes termos pode ser removido.
      </p>
    ),
  },
  {
    titulo: "Sistemas de RPG e conteúdo de terceiros",
    conteudo: (
      <p>
        Os nomes de sistemas de RPG mencionados no site pertencem aos seus donos. O projeto não é afiliado, patrocinado nem
        endossado por eles. Regras usadas sob licença aberta, como o System Reference Document 5.1, são creditadas conforme a
        licença (Creative Commons Attribution 4.0).
      </p>
    ),
  },
  {
    titulo: "Sem garantias",
    conteudo: (
      <p>
        O site é oferecido como está, por se tratar de um projeto de estudo. Ele pode ter erros, ficar indisponível ou perder dados.
        Não guarde aqui nada que você não possa perder. Na medida permitida pela lei, o responsável pelo projeto não responde por
        prejuízos decorrentes do uso ou da impossibilidade de uso do site.
      </p>
    ),
  },
  {
    titulo: "Suspensão e exclusão de conta",
    conteudo: (
      <p>
        Você pode pedir a exclusão da sua conta a qualquer momento pelo e-mail {emailContato}. Contas que descumprirem estes termos
        podem ser suspensas ou excluídas.
      </p>
    ),
  },
  {
    titulo: "Mudanças nestes termos",
    conteudo: (
      <p>
        Estes termos podem ser atualizados. A data da última atualização fica no topo da página. Se a mudança for importante, você
        será avisado e poderá ter que aceitar a versão nova para continuar usando a conta.
      </p>
    ),
  },
  {
    titulo: "Lei aplicável e contato",
    conteudo: (
      <p>
        Estes termos seguem as leis do Brasil. Dúvidas, pedidos ou reclamações podem ser enviados para {emailContato}.
      </p>
    ),
  },
];

export default function TermosDeUso() {
  return <PaginaLegal titulo="Termos de uso" resumo={resumo} secoes={secoes} />;
}
