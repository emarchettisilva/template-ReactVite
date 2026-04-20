import React from "react";

type BotaoVariante =
  | "Incluir"
  | "Salvar"
  | "Cancelar"
  | "Aviso"
  | "Visualizar"
  | "Editar"
  | "Excluir"
  | "Fechar"
  | "Recolher"
  | "Validar"
  | "Voltar"
  | "Imprimir" 
  | "Prefeitura"
  | "Emater"
  | "EmpresaGeo"
  | "Beneficiario"
  | "Imovel"
  | "Detalhe"

interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  titulo?: string;
  variante: BotaoVariante;
  loading?: boolean;
  hint?: string;
}

const Botao: React.FC<BotaoProps> = ({
  titulo,
  variante = "Salvar",
  loading = false,
  hint = "",
  className = "",
  ...props
}) => {
  const estilosFull: Record<BotaoVariante, string> = {
    Salvar:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Cancelar:
      "bg-gray-500 hover:bg-gray-600 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Incluir:
      "bg-green-600 hover:bg-green-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Aviso:
      "bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Visualizar:
      "bg-blue-400 hover:bg-blue-500 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Editar:
      "bg-orange-500 hover:bg-orange-600 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Excluir:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Fechar:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Recolher:
      "bg-red-600 hover:bg-red-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Validar:
      "bg-blue-600 hover:bg-red-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Voltar:
      "bg-blue-600 hover:bg-red-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Imprimir:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Prefeitura:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Emater:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    EmpresaGeo:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Beneficiario:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Imovel:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
    Detalhe:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-4 py-2 rounded-lg font-bold",
  };

  const estilosIconeApenas: Record<BotaoVariante, string> = {
    Salvar: "text-blue-600 hover:text-blue-800",
    Cancelar: "text-gray-500 hover:text-gray-800",
    Incluir: "text-green-600 hover:text-green-800",
    Aviso: "text-yellow-600 hover:text-yellow-800",
    Visualizar: "text-blue-400 hover:text-blue-600",
    Editar: "text-orange-500 hover:text-orange-700",
    Excluir: "text-red-600 hover:text-red-800",
    Fechar: "text-black-600 hover:text-black-800",
    Recolher: "text-gray-600 hover:text-black-800",
    Validar: "text-gray-600 hover:text-black-800",
    Voltar: "text-gray-600 hover:text-black-800",
    Imprimir: "text-gray-600 hover:text-black-800",
    Prefeitura: "text-gray-600 hover:text-black-800",
    Emater: "text-gray-600 hover:text-black-800",
    EmpresaGeo: "text-gray-600 hover:text-black-800",
    Beneficiario: "text-gray-600 hover:text-black-800",
    Imovel: "text-gray-600 hover:text-black-800",
    Detalhe: "text-gray-600 hover:text-black-800"
  };

  const icones: Record<BotaoVariante, React.ReactNode> = {
    Salvar: "💾",
    Cancelar: "❌",
    Incluir: "⊕",
    Aviso: "⚠️",
    Visualizar: "🔍",
    Editar: "✏️",
    Excluir: "🗑️",
    Fechar: "✕",
    Recolher: "▲",
    Validar: "✅",
    Voltar: "⬅️",
    Imprimir: "🖨️",
    Prefeitura: "🏛️",
    Emater: "🏡",
    EmpresaGeo: "🏢",
    Beneficiario: "🙋",
    Imovel: "📜",
    Detalhe: "📋"
  };

  const temTitulo = !!(titulo && titulo.trim().length > 0);

  return (
    <button
      {...props}
      title={hint}
      disabled={loading || props.disabled}
      className={`
        flex items-center justify-center gap-1.5 transition-all active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          temTitulo
            ? estilosFull[variante]
            : `bg-transparent p-0.5 border-none shadow-none ${estilosIconeApenas[variante]}`
        }
        ${className}
      `}
    >
      {loading ? (
        <span className="animate-spin inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <>
          <span className={temTitulo ? "text-base" : "text-xl"}>
            {icones[variante]}
          </span>
          {temTitulo && <span>{titulo}</span>}
        </>
      )}
    </button>
  );
};

export default Botao;
