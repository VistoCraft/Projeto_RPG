type ListaErrosProps = {
  erros: string[];
};

export default function ListaErros({ erros }: ListaErrosProps) {
  if (erros.length === 0) return null;

  return (
    <ul role="alert" className="mb-5 flex flex-col gap-1 rounded-md border border-vida/60 bg-vida/10 p-3 text-sm">
      {erros.map((erro) => (
        <li key={erro} className="flex gap-2"><i aria-hidden="true" className="bi bi-exclamation-circle text-vida" />{erro}</li>
      ))}
    </ul>
  );
}
