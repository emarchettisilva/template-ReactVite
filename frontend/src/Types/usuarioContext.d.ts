// =====================
// BACKEND (dados crus)
// =====================


// Dados Constantes durante a sessão de Usuario
export interface DadosUsuarioBackend {
  codUsuarioCPF: string;
  nomUsuario: string;
  idPapel: number; // papel selecionado
}

// =====================
// FRONTEND (config)
// =====================

export interface PapeisUsuario {
  idPapel: number;
  desPapel: string;
}

export interface Funcionalidade {
  codFuncionalidade: number;
  label: string;
  rota: string;
}

export interface FuncionalidadesAcesso {
  idPapel: number;
  codFuncionalidade: number[];
}

// =====================
// UI / ESTADO
// =====================

export interface DadosUsuarioEstado {
  idPapel: number;
  desPapel: string;
  tituloPagina: string;
}

export interface MenuItem {
  rota: string;
  label: string;
}

export interface Menu {
  itens: MenuItem[];
  codFuncionalidade: number[];
}

// =====================
// CONTEXT
// =====================

export interface UsuarioContextData {
  backend: DadosUsuarioBackend | null;
  estado: DadosUsuarioEstado | null;
  papeis: PapeisUsuario[]; //Papeis lido do frontend
  acoes: {
    setUsuario: (dados: DadosUsuarioBackend) => void;
    limparUsuario: () => void;
  };
}
