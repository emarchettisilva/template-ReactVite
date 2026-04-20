import { useUsuario } from "../contexts/UsuarioContext";

interface CabecalhoProps {
  logado: boolean;
}

export default function Cabecalho({ logado }: CabecalhoProps) {
  const {
    backend,
    estado,
    acoes,
    manutencaoUsuarioAberto,
    setManutencaoUsuarioAberto,
  } = useUsuario();
  

  if (logado && !backend) return null;

  
  // FUNÇÃO AO CLICAR EM SAIR
  const handleSair = async () => {
      acoes.limparUsuario();
  };

  return (
    <header className="flex items-center justify-between bg-gray-200 px-4 py-2 shadow-md">
      {/* LADO ESQUERDO: Logo */}
      <div className="flex-shrink-0">
        <img src="/SeapaLogo.jpg" className="h-14 w-auto" alt="Logo SEAPA" />
      </div>

      {/* CENTRO: Título do Sistema */}
      <div className="text-center border-4 border-cyan-600 bg-cyan-50 px-6 py-1 mx-4">
        <h1 className="text-lg font-bold text-gray-800 leading-tight">SIGET</h1>
        <p className="text-[10px] uppercase font-semibold text-gray-600 tracking-tighter">
          Sistema de Gestão de Terras de Minas Gerais
        </p>
      </div>

      {/* LADO DIREITO: Info Usuário */}
      <div className="flex items-center gap-3">
        {logado && backend && (
          <>

            {/* ÍCONE DO USUÁRIO */}
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700 text-white shadow-sm  hover:bg-cyan-800 transition-colors"
              title={`Alterar dados\nUsuário: ${backend.nomUsuario}\nPapel: ${estado?.desPapel}`}
              onClick={() =>
                setManutencaoUsuarioAberto(!manutencaoUsuarioAberto)
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* BOTÃO SAIR */}
            <button
              onClick={handleSair}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
              title="Sair / Encerrar Sessão"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
