import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMensagem } from "../contexts/MensagemContext";
import { useUsuario } from "../contexts/UsuarioContext";
import { useApi } from "../hooks/useApi";

interface UsuarioLogado {
  cpf: string;
  nomUsuario: string;
  perfil: string;
  senha: string;
  idtTemSenha: boolean;
}

export default function Login() {
  const { acoes } = useUsuario();
  const { fetchApp } = useApi();
  const { exibirMensagem } = useMensagem();

  // Estados do formulário
  const [cpf, setCpf] = useState("");
  const [usuarioValido, setUsuarioValido] = useState<UsuarioLogado | null>(
    null,
  );
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const toggleSenhaVisivel = () => setSenhaVisivel((prev) => !prev);

 
  // --- PASSO 1: Verificar CPF ---
  const verificarCpf = async (e: React.FormEvent) => {
    e.preventDefault();
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      exibirMensagem({
        tipo: "AVISO",
        mensagem: ["O CPF deve conter 11 dígitos."],
      });
      return;
    }

    const resultado = await fetchApp(
      `/loginAcesso/${cpfLimpo}`,
      { method: "GET" },
      false, // Sem autenticação necessária aqui
    );

    if (resultado && resultado.nomUsuario) {
      setUsuarioValido({
        cpf: cpfLimpo,
        nomUsuario: resultado.nomUsuario,
        perfil: "",
        senha: "",
        idtTemSenha: resultado.idtTemSenha ?? true,
      });
    }
  };
  const handleEsqueceuSenha = async () => {
    await fetchApp(
      `/esqueceuSenha/${usuarioValido?.cpf}`,
      {
        method: "PUT",
      },
      false,
    );
  };
  // --- PASSO 2: Verificar/Criar Senha e Logar ---
  const verificarSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioValido?.cpf) {
      exibirMensagem({
        tipo: "ERRO",
        mensagem: ["Dados de usuário inválidos. Reinicie o processo."],
      });
      return;
    }

    const cpfLimpo = usuarioValido.cpf;

    // Caso de Primeiro Acesso (Criar Senha)
    if (!usuarioValido.idtTemSenha) {
      if (senha.length < 4) {
        exibirMensagem({
          tipo: "AVISO",
          mensagem: ["A senha deve ter no mínimo 4 caracteres."],
        });
        return;
      }
      if (senha !== confirmarSenha) {
        exibirMensagem({
          tipo: "ERRO",
          mensagem: ["As senhas digitadas não coincidem."],
        });
        return;
      }

      const responseSenha = await fetchApp(
        "/alterarSenha",
        {
          method: "PUT",
          body: JSON.stringify({ codUsuarioCPF: cpfLimpo, desSenha: senha }),
        },
        false,
      );

      if (!responseSenha) return;
      exibirMensagem({
        tipo: "SUCESSO",
        mensagem: ["Senha cadastrada com sucesso! Proseguindo..."],
      });
    }

    // Processo de Login (POST)
    const resp = await fetchApp(
      "/obterToken",
      {
        method: "POST",
        body: JSON.stringify({
          codUsuarioCPF: cpfLimpo,
          desSenha: senha,
        }),
      },
      false,
    );

    if (resp && resp.token) {
      // PADRONIZAÇÃO: Salva no storage antes de atualizar o estado global
      localStorage.setItem("@App:token", resp.token);

      const dadosCompletos = await fetchApp("/loginAcessoUsuario");
      if (dadosCompletos) {
        acoes.setUsuario(dadosCompletos); // Isso preenche o 'backend' e o 'menu'
      }
      console.log("Dados completos de Login", dadosCompletos);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        {/* Cabeçalho do Card */}
        <div className="flex items-center justify-center mb-6 relative">
          {usuarioValido && (
            <button
              type="button"
              className="absolute left-0 flex items-center text-gray-600 hover:text-blue-600 transition"
              onClick={() => {
                setUsuarioValido(null);
                setSenha("");
                setConfirmarSenha("");
              }}
            >
              <ArrowLeft size={22} />
            </button>
          )}
          <h2 className="text-2xl font-semibold text-center flex-1">
            Acessar Sistema
          </h2>
        </div>
        {/* --- FORMULÁRIO 1: CPF --- */}
        {!usuarioValido ? (
          <form className="flex flex-col gap-4" onSubmit={verificarCpf}>
            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              maxLength={11}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Avançar
            </button>
           
          </form>
        ) : (
          /* --- FORMULÁRIO 2: SENHA --- */
          <form className="flex flex-col gap-4" onSubmit={verificarSenha}>
            <div className="text-center text-gray-700 mb-2">
              <span className="text-sm">Bem-vindo,</span>
              <p className="text-lg font-semibold">
                {usuarioValido.nomUsuario}
              </p>
            </div>

            {/* Campos de Senha (Novo ou Existente) */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={senhaVisivel ? "text" : "password"}
                  placeholder={
                    !usuarioValido.idtTemSenha ? "Criar nova senha" : "Senha"
                  }
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={toggleSenhaVisivel}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {senhaVisivel ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {!usuarioValido.idtTemSenha && (
                <div className="relative">
                  <input
                    type={senhaVisivel ? "text" : "password"}
                    placeholder="Confirmar senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 mt-2"
            >
              {!usuarioValido.idtTemSenha
                ? "Cadastrar Senha e Entrar"
                : "Entrar"}
            </button>
            <div className="mt-2 flex flex-col items-center gap-2 border-t pt-6">
              <button
                onClick={handleEsqueceuSenha}
                className="text-blue-600 hover:underline text-sm"
              >
                Esqueceu a senha?
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
