/*
LOGIN / REFRESH
      ↓
BOOTSTRAP CONTEXTO
      ↓
RECALCULAR PAPEL (DIRETO)
      ↓
RECALCULAR MENU
      ↓
ATUALIZAR CONTEXTO
      ↓
ROUTER / UI REAGEM
*/

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import {
  DadosUsuarioBackend,
  DadosUsuarioEstado,
  PapeisUsuario,
  Menu,
  UsuarioContextData,
} from "../Types/usuarioContext";
import {
  calcularEstadoInterface,
  obterMenuPorPapel,
} from "./helpers";

import { storage } from "../contexts/storage";
import papeisJson from "../../public/Papeis.json";

// CONTEXT EXTENDIDO
interface UsuarioContextDataExtendida extends UsuarioContextData {
  menu: Menu;
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
  manutencaoUsuarioAberto: boolean;
  setManutencaoUsuarioAberto: (aberto: boolean) => void;
}

const UsuarioContext = createContext<UsuarioContextDataExtendida | null>(null);

// PROVIDER
export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [papeis] = useState<PapeisUsuario[]>(papeisJson as PapeisUsuario[]);
  const [menuAberto, setMenuAberto] = useState(true);
  const [manutencaoUsuarioAberto, setManutencaoUsuarioAberto] = useState(false);

  // ---------------------
  // BACKEND (DADOS BRUTOS)
  // ---------------------
  const [backend, setBackend] = useState<DadosUsuarioBackend | null>(() => {
    return storage.getBackend();
  });

  // ---------------------
  // ESTADO (DADOS PROCESSADOS)
  // ---------------------
  const [estado, setEstado] = useState<DadosUsuarioEstado | null>(() => {
    return storage.getEstado();
  });

  // ---------------------
  // MENU (DERIVADO DO ESTADO)
  // ---------------------
  const menu = useMemo<Menu>(() => {
    if (!estado?.idPapel || estado.idPapel <= 0) {
      return { itens: [], codFuncionalidade: [] };
    }
    return obterMenuPorPapel(estado.idPapel);
  }, [estado?.idPapel]);

  // =====================
  // AÇÕES
  // =====================
  const acoes = useMemo(
    () => ({
      /**
       * LOGIN / REFRESH
       * Agora processa apenas os dados do backend e a lista de papéis
       */
      setUsuario: (dados: DadosUsuarioBackend) => {
        const estadoCalculado = calcularEstadoInterface(dados, papeis);
        
        setBackend(dados);
        setEstado(estadoCalculado);

        storage.saveLogin(dados, estadoCalculado);
        setMenuAberto(true);
      },

      /**
       * LIMPAR SESSÃO
       */
      limparUsuario: () => {
        storage.clear();
        setBackend(null);
        setEstado(null);
        setMenuAberto(false);
      },
    }),
    [papeis] // Simplificado: só depende de papeis
  );

  // =====================
  // VALUE DO CONTEXT
  // =====================
  const value = useMemo<UsuarioContextDataExtendida>(
    () => ({
      backend,
      estado: estado ?? {
        idPapel: 0,
        desPapel: "",
        tituloPagina: "",
      },
      papeis,
      menu,
      acoes,
      menuAberto,
      setMenuAberto,
      manutencaoUsuarioAberto,
      setManutencaoUsuarioAberto,
    }),
    [backend, estado, papeis, menu, acoes, menuAberto, manutencaoUsuarioAberto],
  );

  return (
    <UsuarioContext.Provider value={value}>{children}</UsuarioContext.Provider>
  );
}

// =====================
// HOOK
// =====================
export const useUsuario = () => {
  const ctx = useContext(UsuarioContext);
  if (!ctx) {
    throw new Error("useUsuario deve ser usado dentro de UsuarioProvider");
  }
  return ctx;
};