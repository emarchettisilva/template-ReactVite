import { Descendant } from "slate";

/**
 * Converte string JSON do Slate para objeto seguro
 */
export const parseSlateSafe = (value: string): Descendant[] => {
    try {
        return JSON.parse(value);
    } catch {
        return [];
    }
};

/**
 * Mapa padrão de variáveis (mock / preview)
 */
const VARIAVEIS_PADRAO: Record<string, string> = {
    Nome: "João da Silva",
    Data: "01 de Janeiro de 2026",
    Edital: "Edital Público 001/2026",
    Local: "Belo Horizonte - MG",
    Beneficiario: "Maria Oliveira",
    Imovel: "Fazenda Boa Esperança",
    Login: "usuario123",
    Senha: "********",
    ProcessoSEI: "00000.000000/2026-00"
};

/**
 * Filtra apenas variáveis permitidas pelo evento
 */
export const buildVariaveis = (codVariavel: string[] = []) => {
    return codVariavel.reduce((acc, key) => {
        if (VARIAVEIS_PADRAO[key]) {
            acc[key] = VARIAVEIS_PADRAO[key];
        }
        return acc;
    }, {} as Record<string, string>);
};