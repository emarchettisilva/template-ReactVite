import { useEffect, useRef } from "react";
import { useMensagem } from "../contexts/MensagemContext";

export default function Rodape() {
  const { fecharMensagem, mensagemPacote, mensagemVisivel } = useMensagem();

  const rodapeRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!mensagemVisivel || !mensagemPacote) return;

    // Cancela timeout anterior (se existir)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        rodapeRef.current &&
        !rodapeRef.current.contains(event.target as Node)
      ) {
        fecharMensagem();
      }
    };

    if (mensagemPacote.tipo === "ERRO") {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

    timeoutRef.current = setTimeout(() => {
      fecharMensagem();
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

  }, [mensagemVisivel, mensagemPacote, fecharMensagem]);

  if (!mensagemPacote) return null;

  const tipoClasse =
    mensagemPacote.tipo === "ERRO"
      ? "bg-red-300"
      : mensagemPacote.tipo === "AVISO"
      ? "bg-yellow-200"
      : "bg-green-100";

  const visibilidadeClasse = mensagemVisivel
    ? "opacity-100 max-h-30 py-2"
    : "opacity-0 max-h-0 py-0";

  return (
    <div
      ref={rodapeRef}
      className={`fixed bottom-0 border-2 border-gray-400 left-0 w-full transition-all duration-300 z-50 overflow-hidden p-4 ${visibilidadeClasse} ${tipoClasse}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <ul className="list-disc list-inside space-y-1 text-left text-black">
            {mensagemPacote.mensagem.map((msg: string, index: number) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}