import { DadosUsuarioBackend, DadosUsuarioEstado } from "../Types/usuarioContext";

const KEYS = {
  BACKEND: "@App:backend",
  ESTADO: "@App:estado",
  TOKEN: "@App:token",
};

export const storage = {
  // Chamado apenas no momento do LOGIN inicial
  saveLogin: (backend: DadosUsuarioBackend, estado: DadosUsuarioEstado) => {
    localStorage.setItem(KEYS.BACKEND, JSON.stringify(backend));
    localStorage.setItem(KEYS.ESTADO, JSON.stringify(estado));
  },

  // Chamado nas trocas de Perfil ou Vínculo (acoes.setPerfil / acoes.setVinculo)
  updateEstado: (estado: DadosUsuarioEstado) => {
    localStorage.setItem(KEYS.ESTADO, JSON.stringify(estado));
  },

  getBackend: (): DadosUsuarioBackend | null => {
    const data = localStorage.getItem(KEYS.BACKEND);
    try {
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  getEstado: (): DadosUsuarioEstado | null => {
    const data = localStorage.getItem(KEYS.ESTADO);
    try {
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },

  saveToken: (token: string) => localStorage.setItem(KEYS.TOKEN, token),
  getToken: () => localStorage.getItem(KEYS.TOKEN),

  clear: () => {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  }
};