import {
  DadosUsuarioBackend,
  PapeisUsuario,
  Menu,
  MenuItem,
} from "../Types/usuarioContext";

import funcionalidadesJSON from "../../public/Funcionalidades.json";
import acessosJSON from "../../public/FuncionalidadesAcesso.json";

/**
 * Normaliza o JSON de acessos para evitar erros de importação
 */
const listaAcessos = Array.isArray(acessosJSON)
  ? acessosJSON
  : (acessosJSON as any).default || [];

/**
 * 1. Busca a descrição do Papel no arquivo JSON local de papéis
 */
export function resolverDesPapel(
  idPapel: number,
  papeis: PapeisUsuario[],
): string {
  return (
    papeis.find((p) => p.idPapel === idPapel)?.desPapel || "Papel não definido"
  );
}

/**
 * 2. Resolve o idPapel vindo diretamente do backend
 */
export function resolverIdPapel(backend: DadosUsuarioBackend): number {
  // Retorna o idPapel do backend convertido para número. Padrão -1 se não existir.
  return backend.idPapel ? Number(backend.idPapel) : -1;
}

/**
 * 3. Resolve o Menu e Permissões baseando-se apenas no idPapel
 */
export function obterMenuPorPapel(idPapel: number): Menu {
  console.log(`--- MONTAGEM DE MENU PARA PAPEL: ${idPapel} ---`);

  // Localiza a regra de acesso no JSON pelo idPapel
  const acesso = listaAcessos.find(
    (a: any) => Number(a.idPapel) === Number(idPapel),
  );

  if (!acesso) {
    console.error(`ERRO: Papel ${idPapel} não encontrado no mapeamento de acessos.`);
    return { itens: [], codFuncionalidade: [] };
  }

  // Garante que os códigos de funcionalidade sejam uma lista de números
  const codsPermitidos = (acesso.codFuncionalidade || []).map((c: any) => Number(c));

  // Filtra as funcionalidades que o papel tem permissão de visualizar
  const itens: MenuItem[] = funcionalidadesJSON
    .filter((f) => codsPermitidos.includes(Number(f.codFuncionalidade)))
    .map((f) => ({
      rota: f.rota,
      label: f.label,
    }));

  return {
    itens,
    codFuncionalidade: codsPermitidos,
  };
}
export function calcularEstadoInterface(
  backend: DadosUsuarioBackend,
  papeis: PapeisUsuario[]
) {
  const idPapel = resolverIdPapel(backend);
  const desPapel = resolverDesPapel(idPapel, papeis);
  const menuConfig = obterMenuPorPapel(idPapel);

  return {
    idPapel,
    desPapel,
    menu: menuConfig.itens,
    codsFuncionalidade: menuConfig.codFuncionalidade,
    tituloPagina: "", 
  };
}
/**
 * 4. Função Principal (Orquestradora)
 * Use esta função para transformar os dados brutos do backend no estado do usuário
 */
export function processarDadosUsuario(
  backend: DadosUsuarioBackend,
  papeis: PapeisUsuario[]
) {
  // Resolve o ID e a Descrição
  const idPapel = resolverIdPapel(backend);
  const desPapel = resolverDesPapel(idPapel, papeis);

  // Busca menu e permissões
  const menuConfig = obterMenuPorPapel(idPapel);

  return {
    idPapel,
    desPapel,
    menu: menuConfig.itens,
    codsFuncionalidade: menuConfig.codFuncionalidade,
    tituloPagina: "", 
  };
}