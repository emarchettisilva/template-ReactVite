import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUsuario } from "../contexts/UsuarioContext"

export default function Conteudo() {
  type MensagemObj = {
    tipo: "erro" | "aviso" | "sucesso";
    mensagem: string[];
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { tituloPagina } = useUsuario();
  const mostrarBotaoVoltar = location.pathname !== "/";
  const [mensagemPacote, setMensagemPacote] = useState<MensagemObj | null>(null);
  const [mensagemVisivel, setMensagemVisivel] = useState(false);
  const handleVoltar = () => {
    navigate("/TelaPadrao");
  };

  const exibirMensagem = (obj: MensagemObj) => {
    if (!obj || !Array.isArray(obj.mensagem))
       return;

    setMensagemPacote(obj);
    setMensagemVisivel(true);
  };

  useEffect(() => {
    if (mensagemVisivel) {
      const timer = setTimeout(() => {
        setMensagemVisivel(false);
        setTimeout(() => setMensagemPacote(null), 300); // Pequeno delay para a transição de saída
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [mensagemVisivel]);

  return (
    <div className="flex flex-col h-screen w-full bg-white text-black">
      {/* Cabeçalho da tela */}
      <div className="relative flex items-center justify-center bg-gray-100 py-3 border-b border-gray-300 shadow-sm">
      <h1 className="text-xl font-semibold">{tituloPagina}</h1>

        {mostrarBotaoVoltar && (
          <button
            onClick={handleVoltar}
            className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded"
          >
            ⬅ Voltar
          </button>
        )}
      </div>

      <div className="p-5 flex-grow overflow-auto">
        { <Outlet context={{ exibirMensagem }} />}
      </div>

      {/* Rodapé de mensagens */}
      {mensagemPacote && (
        <div
          className={`fixed bottom-0 left-0 w-full transition-all duration-300 z-50
            ${mensagemVisivel ? "opacity-100 max-h-40 py-4" : "opacity-0 max-h-0 py-0"}
            bg-gray-900 text-white text-sm overflow-hidden`}
        >
          <ul className="list-disc list-inside space-y-1 px-4 text-left">
            {mensagemPacote.mensagem.map((msg, idx) => (
              <li
                key={idx}
                className={
                  mensagemPacote.tipo === "erro"
                    ? "text-red-400"
                    : mensagemPacote.tipo === "aviso"
                    ? "text-yellow-300"
                    : "text-green-300"
                }
              >
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
