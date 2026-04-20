// src/utils/utils.ts

/**
 * Formata uma string de data (YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY).
 * Adiciona 'T00:00:00' para garantir que a data seja interpretada no início do dia e evitar problemas de fuso horário.
 *
 * @param dataString A string de data no formato YYYY-MM-DD.
 * @returns A data formatada como DD/MM/YYYY ou a string original se inválida/vazia.
 */
export const formatarDataParaExibicao = (dataString: string): string => {
  if (!dataString) return "";
  try {
    // Adiciona 'T00:00:00' para garantir que a data seja interpretada no início do dia
    // no fuso horário local e evitar potenciais problemas de deslocamento para o dia anterior.
    const date = new Date(dataString + 'T00:00:00');
    if (isNaN(date.getTime())) {
      return dataString; // Retorna a string original se não for uma data válida
    }
    return date.toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY
  } catch (e) {
    // Em caso de qualquer erro inesperado na formatação, retorna a string original
    console.error("Erro ao formatar data:", e);
    return dataString;
  }
};
