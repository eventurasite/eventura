/**
 * Mensagens padronizadas para validação com Zod.
 * Centraliza as mensagens de erro em português.
 */

// Mensagens Gerais
export const REQUIRED_FIELD = "Este campo é obrigatório.";
export const INVALID_TYPE = "Formato inválido. Tipo esperado: ";
export const MIN_LENGTH = (min: number) =>
  `O campo deve ter no mínimo ${min} caracteres.`;
export const MAX_LENGTH = (max: number) =>
  `O campo deve ter no máximo ${max} caracteres.`;
export const INVALID_ENUM = (options: string[]) =>
  `Valor inválido. Opções permitidas: ${options.join(", ")}.`;

// Mensagens Específicas
export const INVALID_EMAIL = "Formato de e-mail inválido.";

export const INVALID_PHONE = "Formato de telefone inválido. Use 999999999. São 9 caracteres no total";

export const PASSWORD_COMPLEXITY =
  "A senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial (@$!%*?&).";

export const INVALID_DATE_FORMAT = "Formato de data e hora inválido.";

export const FUTURE_DATE_REQUIRED = "A data do evento deve ser futura.";

export const POSITIVE_PRICE = "O preço deve ser um número não negativo (0 para gratuito).";

export const INVALID_ID = "ID inválido (deve ser um número inteiro positivo).";

export const INVALID_URL = "Formato de URL inválido.";

// frontend/src/validation/messages.ts

// ... (Outras mensagens)

// CORREÇÃO: Estrutura explícita para evitar erros de tipagem/runtime
export const MAX_VALUE = (max: number): string => {
  // Garantimos que o número é tratado como um number com duas casas decimais
  const formattedValue = max.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2
  });
  
  return `O valor máximo permitido é ${formattedValue}.`;
};