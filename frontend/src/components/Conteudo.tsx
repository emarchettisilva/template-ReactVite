import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUsuario } from "../contexts/UsuarioContext";

import CabecalhoConteudo from "../components/CabecalhoConteudo";

export default function Conteudo() {
  const { backend, setMenuAberto } = useUsuario();
  const location = useLocation();
  const navigate = useNavigate();
  ;
      
  const usuarioLogado = !!(backend && 
                        typeof backend === 'object' && 
                        Object.keys(backend).length > 0)
  const deveExibirCabecalho = usuarioLogado && location.pathname !== "/app";

  // Unificamos a função: Abre o menu e volta para a home
  const handleAcaoMenu = () => {
    setMenuAberto(true); 
    
    navigate("/app");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white text-black relative overflow-hidden">
      
      {/* O Cabeçalho desaparece se estiver na Home (/app) */}
      {deveExibirCabecalho && (
        <CabecalhoConteudo 
          onAbrirMenu={handleAcaoMenu}
        />
      )}


      <main className="flex-1 min-h-0 overflow-auto bg-white relative">
          {/* Marca d'água de fundo aplicada à área útil */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-center justify-center"
            style={{
              backgroundImage: "url('/TelaFundo.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'contain',
              margin: '20px'
            }}
          />
          
          {/* Conteúdo das rotas (pode ter fundo transparente para mostrar a marca d'água) */}
          <div className="relative w-full h-full">
            <Outlet />
          </div>
      </main>
    </div>
  );
}