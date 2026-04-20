// TelaPadrao.tsx

import { useUsuario } from "../contexts/UsuarioContext";
import Cabecalho from "./Cabecalho";
import Rodape from "./Rodape";
import Menu from "./Menu";
import Conteudo from "./Conteudo";
import ManutencaoDadosUsuario from "./ManutencaoDadosUsuario";

export default function TelaPadrao() {
  const { backend, menu, menuAberto, setMenuAberto, manutencaoUsuarioAberto } =
    useUsuario();

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 overflow-hidden">
      {/* 1. CABEÇALHO PRINCIPAL (Sempre no topo de tudo) */}
      <Cabecalho logado={!!backend} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* 2. MENU LATERAL (A FAIXA À ESQUERDA) */}
        {backend && (
          <aside
            className={`
              /* Se menuAberto for false, a largura é 0 e ele sai da tela */
              ${menuAberto ? "w-80" : "w-0 -translate-x-full"}
              bg-gray-200 border-r border-gray-300 shadow-xl
              transition-all duration-300 ease-in-out overflow-hidden
            `}
          >
            <div className="w-80 h-full flex flex-col">
              <Menu
                itens={menu?.itens || []}
                aoClicar={() => setMenuAberto(false)}
              />
            </div>
          </aside>
        )}

        {/* 3. CONTEÚDO (OCUPA O ESPAÇO QUE SOBRA) */}
        <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden relative">
          {manutencaoUsuarioAberto && <ManutencaoDadosUsuario />}
          <Conteudo />
        </main>
      </div>
      <Rodape />
    </div>
  );
}
