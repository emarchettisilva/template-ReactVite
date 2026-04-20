import { useParams } from "react-router-dom";


interface CabecalhoConteudoProps {
  onAbrirMenu: () => void;
}

export default function CabecalhoConteudo({
  onAbrirMenu,
}: CabecalhoConteudoProps) {
  const { titulo } = useParams();

  const tituloFormatado = decodeURIComponent(titulo || "Módulo Selecionado");
   
  return (
    <header className="flex items-center justify-between bg-gray-100 py-1 px-4 border-b border-gray-300 shadow-sm h-12 shrink-0 z-10">
      
      {/* LADO ESQUERDO: Botão Menu */}
      <div className="flex items-center">
        <button
          onClick={onAbrirMenu}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <span className="text-xl leading-none">≡</span> MENU
        </button>
      </div>

      {/* CENTRO: Título (Centralizado de verdade) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center w-1/3 hidden md:block">
        <h1 className="text-lg font-bold text-gray-800 uppercase tracking-wider truncate">
          {tituloFormatado}
        </h1>
      </div>

    </header>
  );
}