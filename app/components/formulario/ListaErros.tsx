type ListaErrosProps = {
  erros: string[];
};

export default function ListaErros({ erros }: ListaErrosProps) {
  if (erros.length === 0) return null;

  return (
    <ul role="alert" className="mb-4 flex flex-col gap-1 rounded-md border border-vida bg-vida/10 p-3 text-sm">
      {erros.map((erro) => <li key={erro}>{erro}</li>)}
    </ul>
  );
}
