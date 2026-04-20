// Interface para o Usuario Adm
export interface IAdministrador {
  codUsuarioCPF: string;
  nomUsuario: string;
  desEmail: string;
}

export interface ICargo {
  codCargo: number;
  nomCargo: string;
}


export interface IUnidFed {
  sglUF: string;
  nomEstado: string;
}
