const ANO_ATUAL = new Date().getFullYear();

export default function Rodape() {
  return (
    <footer className="mx-auto mt-10 w-full max-w-[940px] border-t border-borda px-4 py-5 text-center text-sm opacity-80">
      Desenvolvido por <strong>Victor Prezia</strong> · {ANO_ATUAL}
    </footer>
  );
}
