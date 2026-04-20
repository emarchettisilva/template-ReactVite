import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo
} from "react";
import { MensagemObj } from "../Types/mensagem";

interface MensagemContextType {
  exibirMensagem: (obj: MensagemObj) => void;
  fecharMensagem: () => void;
  mensagemPacote: MensagemObj | null;
  mensagemVisivel: boolean;
}

interface MensagemProviderProps {
  children: ReactNode;
}

const MensagemContext = createContext<MensagemContextType | undefined>(undefined);

export const MensagemProvider: React.FC<MensagemProviderProps> = ({ children }) => {
  const [mensagemPacote, setMensagemPacote] = useState<MensagemObj | null>(null);
  const [mensagemVisivel, setMensagemVisivel] = useState(false);

  const exibirMensagem = useCallback((obj: MensagemObj) => {
    if (!obj || !Array.isArray(obj.mensagem)) return;
    setMensagemPacote(obj);
    setMensagemVisivel(true);
  }, []);

  const fecharMensagem = useCallback(() => {
    setMensagemVisivel(false);
    setTimeout(() => setMensagemPacote(null), 300);
  }, []);

  /**
   * AUTO-CLOSE APENAS PARA SUCESSO
   */
  useEffect(() => {
    if (!mensagemVisivel || !mensagemPacote) return;

    if (mensagemPacote.tipo === "ERRO") {
      return;
    }

    const timer = setTimeout(() => {
      fecharMensagem();
    }, 6000);

    return () => clearTimeout(timer);
  }, [mensagemVisivel, mensagemPacote, fecharMensagem]);

  const value = useMemo(
    () => ({
      exibirMensagem,
      fecharMensagem,
      mensagemPacote,
      mensagemVisivel
    }),
    [exibirMensagem, fecharMensagem, mensagemPacote, mensagemVisivel]
  );

  return (
    <MensagemContext.Provider value={value}>
      {children}
    </MensagemContext.Provider>
  );
};

export const useMensagem = () => {
  const context = useContext(MensagemContext);
  if (!context) {
    throw new Error("useMensagem deve ser usado dentro de um MensagemProvider");
  }
  return context;
};
