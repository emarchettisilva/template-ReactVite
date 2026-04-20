import React, { ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback.
    return { hasError: true };
  }

  async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 1. Log no console para o desenvolvedor
    console.error("ERRO_CRITICO_INTERFACE:", error, errorInfo);

    try {
      // 2. Tenta recuperar dados do usuário salvos pelo Auth no localStorage
      const userJson = localStorage.getItem("@App:backend");
      const user = userJson ? JSON.parse(userJson) : {};

      // 3. Monta o payload conforme a interface profissional definida
      const logPayload = {
        mensagem: `CRASH_JS: ${error.message}`,
        codUsuario: user.codUsuarioCPF || "0",
        nomUsuario: user.nomUsuario || "SISTEMA",
        desPerfil: user.desPerfil || "N/A",
        desPapel: user.desPapel || "N/A",
        rota: window.location.pathname,
        origem: "SISTEMA", // Identifica que foi um erro de interface/JS
        detalhe: errorInfo.componentStack // Opcional: envia a pilha de erro para o Flask
      };

      // 4. Envio direto para o Flask (usando fetch nativo para evitar dependências de hooks)
      const BASEURL_LOG = import.meta.env.VITE_API_URL_LOG;
      

      await fetch(`${BASEURL_LOG}/registrar-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logPayload),
      });
    } catch (logErr) {
      console.error("Falha ao reportar crash ao servidor de logs:", logErr);
    }
  }

  render() {
    if (this.state.hasError) {
      // UI de Fallback
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center w-full h-full bg-gray-50 z-[9999] p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl border-t-8 border-red-600 max-w-lg text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-gray-800 text-2xl font-bold mb-2">
              Instabilidade Detectada
            </h1>
            <p className="text-gray-600 mb-6">
              Ocorreu um erro inesperado na interface. O incidente foi registrado e nossa equipe técnica já foi notificada.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors"
              >
                TENTAR NOVAMENTE
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300 transition-colors"
              >
                IR PARA O INÍCIO
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;