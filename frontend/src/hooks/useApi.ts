import { useCallback } from "react";
import { useMensagem } from "../contexts/MensagemContext";
import { useLoading } from "./contexts/LoadingContext";
import { useUsuario } from "../contexts/UsuarioContext";

export interface ErroInterface {
  mensagem: string;
  codUsuario: string | number;
  nomUsuario: string;
  desPerfil: string;
  desPapel: string;
  rota: string;
  origem: "APP" 
}

export const useApi = () => {
  const { exibirMensagem } = useMensagem();
  const { loading, startLoading, stopLoading } = useLoading();
  const { backend, estado, acoes } = useUsuario();

  const ENV = import.meta.env;

  const valida = (key: keyof typeof ENV): string => {
    const value = ENV[key];

    if (!value) {
      const modo = ENV.MODE;
      const msg = `ERRO CRÍTICO: Variável ${key} não definida no arquivo .env.${modo}!`;
      window.alert(msg);
      throw new Error(msg);
    }

    return value as string;
  };

  valida("VITE_API_URL_APP");
  

  // Configurações de Ambiente (Lidas uma única vez na inicialização do módulo)
  const BASEURL_APP = import.meta.env.VITE_API_URL_APP;
  

  /**
   * 1. REGISTRADOR DE LOG CENTRALIZADO
   * Captura o contexto do usuário e envia para o Flask.
   */
  const registrarLogNoServidor = useCallback(
    async (
      mensagemErro: string,
      rotaErro: string,
      origem: ErroInterface["origem"],
    ) => {
      try {
        const logData: ErroInterface = {
          mensagem: mensagemErro,
          codUsuario: backend?.codUsuarioCPF || "0",
          nomUsuario: backend?.nomUsuario || "Não Identificado",
          desPerfil: estado?.desPerfil || "N/A",
          desPapel: estado?.desPapel || "N/A",
          rota: rotaErro,
          origem: origem,
        };

      } catch (err) {
        console.error("Falha Crítica: Servidor de Log inacessível.", err);
      }
    },
    [backend],
  );

  /**
   * O MOTOR DE CONEXAO COM BACKEND (Funil Único)
   * O backend pode retornar:
   * um objeto{tipo: SUCESSO|AVISO|ERRO}, Mensagem: []} ou um array de objetos dos dados
   * também pode ocorrer erros de conexão e falha no sql
   * retorna dados em caso de select e um false em caso erro
   * Gerencia Loading, Headers, Erros HTTP, Erros de Negócio e Logs.
   */
  const execFetch = useCallback(
    async (
      baseUrl: string,
      endpoint: string,
      options: RequestInit = {},
      requerAutenticacao: boolean = true,
      origem: ErroInterface["origem"],
    ) => {
      const TIMEOUT_MS = 60000; // 1 minutos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      // Função interna para deslogar
      const forcarLogout = () => {
        acoes.limparUsuario();
        window.location.href = "/login";
      };

      startLoading();
      const rotaUrl = `${baseUrl}${endpoint}`;
      const token = localStorage.getItem("@App:token");
      const headers = new Headers(options.headers);

      if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }

      // Tratamento antes de executar o acesso no back
      if (requerAutenticacao) {
        // Rotas privadas JWT
        if (token) {
          headers.set("Authorization", `Bearer ${token.trim()}`);
        } else {
          exibirMensagem({
            tipo: "ERRO",
            mensagem: ["Sessão expirada. Faça login."],
          });
          stopLoading();
          clearTimeout(timeoutId);
          forcarLogout();
        }
      }

      try {
        const response = await fetch(rotaUrl, {
          ...options,
          headers,
          signal: controller.signal, // Atribui o controle de aborto aqui
        });

        clearTimeout(timeoutId); // Limpa o timeout se a resposta chegar a tempo

        // Tratamento específico de Erro de Autenticação no Backend
        if (response.status === 401 && requerAutenticacao) {
          exibirMensagem({
            tipo: "ERRO",
            mensagem: [
              "Sua sessão expirou por inatividade. Faça login novamente.",
            ],
          });
          registrarLogNoServidor("Sessão Expirada (401)", rotaUrl, origem);
          setTimeout(forcarLogout, 2000);
          return false;
        }

        // Erros HTTP (SQL Errado, 500, 404, etc)
        if (!response.ok) {
          let msgErro = `Erro no servidor (${response.status})`;
          try {
            const errBody = await response.json();
            msgErro = errBody.mensagem?.[0] || msgErro;
          } catch {
            /* não é JSON */
          }
          throw new Error(msgErro);
        }

        // Verificando se tem blob imagem, pdf, octet-stream
        const contentType = response.headers.get("content-type");
        if (
          contentType &&
          (contentType.includes("image/") ||
            contentType.includes("application/pdf") ||
            contentType.includes("application/octet-stream"))
        ) {
          return await response.blob();
        }

        const data = await response.json();

        // Objeto de Mensagem Padronizada { tipo: 'ERRO' | 'AVISO' | 'SUCESSO', mensagem: [] }
        if (data && typeof data === "object" && data.tipo) {
          exibirMensagem(data);
          if (data.tipo === "ERRO") {
            registrarLogNoServidor(data.mensagem[0], rotaUrl, origem);
            return false;
          }

          if (data.tipo === "AVISO") {
            return false;
          }

          // Se for SUCESSO, retorna os dados reais (se houver) ou true
          return data.dados || true;
        }

        // Caso não caia em nenhum padrão acima, retorna o dado bruto
        return data;
      } catch (error: any) {
        clearTimeout(timeoutId);

        let msgFinal = error.message;

        // Trata especificamente o erro de Timeout
        if (error.name === "AbortError") {
          msgFinal =
            "O servidor demorou muito para responder. Verifique sua conexão ou tente novamente.";
        } else if (msgFinal.includes("Failed to fetch")) {
          msgFinal =
            "Não foi possível conectar ao servidor. Verifique se você está on-line.";
        }

        exibirMensagem({ tipo: "ERRO", mensagem: [msgFinal] });
        registrarLogNoServidor(msgFinal, rotaUrl, origem);

        return false; // Retorna false para sinalizar falha técnica/interrupção
      } finally {
        stopLoading();
      }
    },
    [exibirMensagem, startLoading, stopLoading, registrarLogNoServidor],
  );

  /**
   * 3. EXPOSIÇÃO DOS SERVIÇOS ESPECÍFICOS
   * Cada método mantém sua identidade e porta original.
   */
  const fetchApp = useCallback(
    (endpoint: string, options?: RequestInit, auth = true) =>
      execFetch(BASEURL_APP, endpoint, options, auth, "APP"),
    [execFetch],
  );

  return { fetchApp, loading };
};
