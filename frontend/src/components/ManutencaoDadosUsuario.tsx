import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { IAdministrador } from "../Types/cadastro"; 
import { useUsuario } from "../contexts/UsuarioContext";
import Botao from "./Botao";
import { Eye, EyeOff } from "lucide-react";
import { useMensagem } from "../contexts/MensagemContext";
interface DadosUsuario {
  desEmail: string;
  nomUsuario: string;
  desSenhaAtual?: string;
  desSenhaNova?: string;
}
const ManutencaoDadosUsuario = () => {
  const { estado, backend, setManutencaoUsuarioAberto } = useUsuario();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [emailCarregado, setEmailCarregado] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [alterarSenha, setAlterarSenha] = useState(false);
  const [dados, setDados] = useState<IAdministrador>({
    codUsuarioCPF: backend?.codUsuarioCPF || "",
    desEmail: "",
    nomUsuario: backend?.nomUsuario || "",
  });
  const { exibirMensagem } = useMensagem();
  const { fetchApp, loading } = useApi();
  useEffect(() => {
    setEmailCarregado(false);
    async function fetchEmail() {
      const data = await fetchApp(
        `/obterEmailUsuario/${backend?.codUsuarioCPF}`,
      );
      if (data) {
        setDados({
          ...dados,
          desEmail: data.desEmail,
        });
        setEmailCarregado(true);
      }
    }
    fetchEmail();
  }, [estado, backend]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDados({
      ...dados,
      [e.target.name]: e.target.value,
    });
  };

  const renderInputSenha = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    mostrar: boolean,
    setMostrar: (v: boolean) => void,
  ) => (
    <div className="mb-4">
      <label className="block mb-1">{label}:</label>

      <div className="flex items-center border rounded">
        <input
          type={mostrar ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="p-2 w-full outline-none"
        />

        <button
          type="button"
          onClick={() => setMostrar(!mostrar)}
          className="px-3 text-sm text-gray-600"
        >
          {mostrar ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if (novaSenha !== confirmarSenha) {
      exibirMensagem({
        tipo: "ERRO",
        mensagem: ["As senhas digitadas não coincidem."],
      });
      return;
    }
    let data: DadosUsuario = {
      nomUsuario: dados.nomUsuario,
      desEmail: dados.desEmail,
    };
    if (alterarSenha) {
      data = {
        ...data,
        desSenhaAtual: senhaAtual,
        desSenhaNova: novaSenha,
      };
    }
   
    const response = await fetchApp(
      `/usuario/${dados.codUsuarioCPF}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );

    if (response) {
      setManutencaoUsuarioAberto(false);
    }
  };

  return (
    emailCarregado && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Manutenção de Dados
          </h2>

          {/* ===================== DADOS DO USUÁRIO ===================== */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 border-b pb-1">
              Dados do Usuário
            </h3>

            {/* CPF */}
            <div className="mb-4">
              <label className="block mb-1 text-sm">CPF</label>
              <input
                type="text"
                name="codUsuarioCPF"
                value={dados.codUsuarioCPF}
                readOnly
                className="border p-2 w-full bg-gray-100 cursor-not-allowed rounded"
              />
            </div>

            {/* Nome */}
            <div className="mb-4">
              <label className="block mb-1 text-sm">Nome</label>
              <input
                type="text"
                name="nomUsuario"
                value={dados.nomUsuario}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                name="desEmail"
                value={dados.desEmail}
                onChange={handleChange}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* ===================== SENHA ===================== */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 border-b pb-1">
              Segurança
            </h3>

            {!alterarSenha ? (
              <p
                onClick={() => setAlterarSenha(true)}
                className="text-blue-600 cursor-pointer text-sm hover:underline w-fit"
              >
                Alterar senha
              </p>
            ) : (
              <>
                {renderInputSenha(
                  "Senha Atual",
                  senhaAtual,
                  setSenhaAtual,
                  mostrarSenhaAtual,
                  setMostrarSenhaAtual,
                )}

                {renderInputSenha(
                  "Nova Senha",
                  novaSenha,
                  setNovaSenha,
                  mostrarNovaSenha,
                  setMostrarNovaSenha,
                )}

                {renderInputSenha(
                  "Confirmar Nova Senha",
                  confirmarSenha,
                  setConfirmarSenha,
                  mostrarConfirmarSenha,
                  setMostrarConfirmarSenha,
                )}

                <button
                  type="button"
                  onClick={() => {
                    setAlterarSenha(false);
                    setSenhaAtual("");
                    setNovaSenha("");
                    setConfirmarSenha("");
                  }}
                  className="text-sm text-gray-500 hover:underline mt-1"
                >
                  Cancelar alteração de senha
                </button>
              </>
            )}
          </div>

          {/* ===================== AÇÕES ===================== */}
          <div className="flex justify-end gap-3 mt-4">
            <Botao
              titulo="Cancelar"
              variante="Cancelar"
              onClick={() => setManutencaoUsuarioAberto(false)}
            />
            <Botao
              titulo="Salvar Alterações"
              variante="Salvar"
              loading={loading}
              onClick={() => handleSubmit()}
            />
          </div>
        </div>
      </div>
    )
  );
};
export default ManutencaoDadosUsuario;
