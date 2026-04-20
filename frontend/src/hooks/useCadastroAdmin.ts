import { useState } from "react";
import { IAdministrador } from "../Types/cadastro";

// Interface para os erros (agora com os nomes corretos)
interface ErrosAdmin {
  codUsuarioCPF: string;
  nomUsuario: string;
  desEmail: string;
  arquivo: string; // Erro de validação de anexos
}

export function useCadastroAdmin() {
  const [formDataAdministrador, setFormDataAdministrador] = useState<IAdministrador>({
    codUsuarioCPF: "",
    nomUsuario: "",
    desEmail: "",
  });

  const [errosCadastroAdministrador, setErrosCadastroAdministrador] = useState<ErrosAdmin>({
    codUsuarioCPF: "",
    nomUsuario: "",
    desEmail: "",
    arquivo: "",
  });

  const [buscaRealizada, setBuscaRealizada] = useState<boolean>(false);

  // Validação simples: campos preenchidos e sem mensagens de erro
  const isFormularioAdminValido =
    Object.values(formDataAdministrador).every((valor) =>
      typeof valor === "string" ? valor.trim() !== "" : true
    ) &&
    Object.values(errosCadastroAdministrador).every(
      (valor) => valor.trim() === ""
    );

  return {
    formDataAdministrador,
    setFormDataAdministrador,
    errosCadastroAdministrador,
    setErrosCadastroAdministrador,
    buscaRealizada,
    setBuscaRealizada,
    isFormularioAdminValido,
  };
}