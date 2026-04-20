import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";

import { IAdministrador } from "../Types/cadastro";

interface CadastroAdminProps {
  buscaRealizada: boolean;
  setBuscaRealizada: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirma: (dados: IAdministrador) => void;
  initialData?: IAdministrador;
}

const CadastroAdministrador: React.FC<CadastroAdminProps> = ({
  buscaRealizada,
  setBuscaRealizada,
  onConfirma,
  initialData
}) => {
  const [formData, setFormData] = useState<IAdministrador>(
    initialData || { codUsuarioCPF: "", nomUsuario: "", desEmail: "" },
  );

  const { fetchApp } = useApi();

  useEffect(() => {
    const cpfNumerico = formData.codUsuarioCPF.replace(/\D/g, "");
    if (cpfNumerico.length === 11) {
      buscarUsuarioPorCpf(cpfNumerico);
    }
  }, [formData.codUsuarioCPF]);

  const buscarUsuarioPorCpf = async (cpf: string) => {
    const res = await fetchApp(`/obterUsuarioPorCPF/${cpf}`, {}, false);
    if (res) {
      setFormData((prev) => ({
        ...prev,
        nomUsuario: res.nomUsuario,
        desEmail: res.desEmail,
      }));
      setBuscaRealizada(true);
    }
    
  };

 
  // Altere apenas a função handleChange para avisar o pai em tempo real
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const novoValor = name === "codUsuarioCPF" ? formatarCPF(value) : value;
    
    const novosDados = { ...formData, [name]: novoValor };
    setFormData(novosDados);
    
    // IMPORTANTE: Chame o onConfirma (ou um onChange) para atualizar o estado no Pai
    onConfirma(novosDados); 
  };

  return (
    <div className="space-y-6">
      <fieldset className="border rounded-lg p-6 bg-white shadow-sm">
        <legend className="text-lg font-semibold px-2 text-blue-800">
          Dados do Usuário Administrador
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF *
            </label>
            <input
              type="text"
              name="codUsuarioCPF"
              value={formData.codUsuarioCPF}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              name="nomUsuario"
              value={formData.nomUsuario}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail *
            </label>
            <input
              type="email"
              name="desEmail"
              value={formData.desEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default CadastroAdministrador;
