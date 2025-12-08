import { z } from "zod";
import * as msg from "./messages";

// =======================================================
// DEFINIÇÕES COMUNS
// =======================================================

// Regex: Senha forte (min. 8, 1 maiúscula, 1 minúscula, 1 número, 1 especial)
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Regex: Telefone (9 a 11 dígitos, para flexibilidade com ou sem DDD, sem pontuação)
const PHONE_REGEX = /^\d{9,11}$/;

// Schema Base de Senha
const BasePasswordSchema = z
  .string()
  .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
  .min(8, { message: msg.MIN_LENGTH(8) })
  .regex(PASSWORD_REGEX, { message: msg.PASSWORD_COMPLEXITY });

// =======================================================
// 1. SCHEMAS DE AUTENTICAÇÃO (MODELO: USUARIO)
// =======================================================

/**
 * Validação para o Cadastro de Usuário (POST /auth/register)
 */
export const UserRegisterSchema = z.object({
  body: z.object({
    // NOME (String) - Obrigatório + Não vazio
    nome: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .min(3, { message: msg.MIN_LENGTH(3) })
      .max(100, { message: msg.MAX_LENGTH(100) }),

    // EMAIL (String @unique) - Obrigatório + Não vazio
    email: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .email({ message: msg.INVALID_EMAIL }),

    // SENHA (String) - Obrigatório no registro
    senha: BasePasswordSchema,

    // TELEFONE (String?) - Opcional, permite string vazia
    telefone: z
      .string()
      .regex(PHONE_REGEX, { message: msg.INVALID_PHONE })
      .optional()
      .or(z.literal("")),

    // DESCRICAO (String?) - Opcional, permite string vazia
    descricao: z
      .string()
      .max(500, { message: msg.MAX_LENGTH(500) })
      .optional()
      .or(z.literal("")),
  }),
});

/**
 * Validação para E-mail (Usado em Forgot Password)
 */
export const EmailSchema = z.object({
  body: z.object({
    // EMAIL (String @unique) - Obrigatório + Não vazio
    email: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .email({ message: msg.INVALID_EMAIL }),
  }),
});

/**
 * Validação para o Login de Usuário (POST /auth/login)
 */
export const UserLoginSchema = z.object({
  body: z.object({
    // EMAIL - Obrigatório + Não vazio
    email: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .email({ message: msg.INVALID_EMAIL }),

    // SENHA - Obrigatório + Não vazio
    senha: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }), // <-- NÃO VAZIO
  }),
});

/**
 * Validação para Edição de Perfil (PUT /auth/:id)
 */
export const UserUpdateSchema = z.object({
  body: z.object({
    // NOME - Opcional, mas se enviado, não pode ser vazio e deve ser válido
    nome: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO (se presente)
      .min(3, { message: msg.MIN_LENGTH(3) })
      .max(100, { message: msg.MAX_LENGTH(100) })
      .optional(),

    // TELEFONE - Opcional, permite string vazia
    telefone: z
      .string()
      .regex(PHONE_REGEX, { message: msg.INVALID_PHONE })
      .optional()
      .or(z.literal("")),

    // DESCRICAO - Opcional, permite string vazia
    descricao: z
      .string()
      .max(500, { message: msg.MAX_LENGTH(500) })
      .optional()
      .or(z.literal("")),

    // EMAIL - Opcional, mas se enviado, não pode ser vazio e deve ser válido
    email: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO (se presente)
      .email({ message: msg.INVALID_EMAIL })
      .optional(),
  }).partial(),

  params: z.object({
    id: z.string().regex(/^\d+$/, { message: msg.INVALID_ID }),
  }),
});

/**
 * Validação para Redefinição de Senha (POST /auth/password/reset)
 */
export const PasswordResetSchema = z.object({
  body: z.object({
    token: z.string().min(1, { message: msg.REQUIRED_FIELD }), // <-- NÃO VAZIO
    password: BasePasswordSchema,
  }),
});

// =======================================================
// 2. SCHEMAS DE EVENTOS (MODELO: EVENTO)
// =======================================================

/**
 * Validação para Criação de Evento (POST /events)
 */
export const EventCreateSchema = z.object({
  body: z.object({
    // TITULO (String) - Obrigatório + Não vazio
    titulo: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .min(5, { message: msg.MIN_LENGTH(5) })
      .max(150, { message: msg.MAX_LENGTH(150) }),

    // DESCRICAO (String) - Obrigatório + Não vazio
    descricao: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .min(20, { message: msg.MIN_LENGTH(20) })
      .max(5000, { message: msg.MAX_LENGTH(5000) }),

    // DATA (DateTime) - Obrigatório
    data: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .datetime({ message: msg.INVALID_DATE_FORMAT })
      .refine(
        (val) => new Date(val).getTime() > Date.now(),
        { message: msg.FUTURE_DATE_REQUIRED }
      ),

    // LOCAL (String - Endereço) - Obrigatório + Não vazio
    local: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .min(5, { message: msg.MIN_LENGTH(5) })
      .max(255, { message: msg.MAX_LENGTH(255) }),

    // PRECO (Decimal) - Obrigatório
    preco: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .transform((val) => parseFloat(val))
      .refine(
        (val) => !isNaN(val) && val >= 0,
        { message: msg.POSITIVE_PRICE }
      ),

    // ID_CATEGORIA (Int) - Obrigatório
    id_categoria: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .regex(/^\d+$/, { message: msg.INVALID_ID })
      .transform((val) => parseInt(val, 10)),

    // URL_LINK_EXTERNO (String?) - Opcional, permite string vazia
    url_link_externo: z
      .string()
      .url({ message: msg.INVALID_URL })
      .optional()
      .or(z.literal("")),
  }),
});

/**
 * Validação para Edição de Evento (PUT /events/:id)
 */
export const EventUpdateSchema = z.object({
  body: z.object({
    // TITULO - Opcional, mas se enviado, não pode ser vazio
    titulo: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO (se presente)
      .min(5, { message: msg.MIN_LENGTH(5) })
      .max(150, { message: msg.MAX_LENGTH(150) })
      .optional(),

    // DESCRICAO - Opcional, mas se enviado, não pode ser vazio
    descricao: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO (se presente)
      .min(20, { message: msg.MIN_LENGTH(20) })
      .max(5000, { message: msg.MAX_LENGTH(5000) })
      .optional(),

    // DATA - Opcional, mas se enviado, não pode ser vazio
    data: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO (se presente)
      .datetime({ message: msg.INVALID_DATE_FORMAT })
      .optional(),

    // LOCAL - Opcional, mas se enviado, não pode ser vazio
    local: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO (se presente)
      .min(5, { message: msg.MIN_LENGTH(5) })
      .max(255, { message: msg.MAX_LENGTH(255) })
      .optional(),

    // PRECO - Opcional, mas se enviado, não pode ser vazio
    preco: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO (se presente)
      .transform((val) => parseFloat(val))
      .refine(
        (val) => !isNaN(val) && val >= 0,
        { message: msg.POSITIVE_PRICE }
      )
      .optional(),

    // ID_CATEGORIA - Opcional, mas se enviado, não pode ser vazio
    id_categoria: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO (se presente)
      .regex(/^\d+$/, { message: msg.INVALID_ID })
      .transform((val) => parseInt(val, 10))
      .optional(),

    // URL_LINK_EXTERNO - Opcional, permite string vazia
    url_link_externo: z
      .string()
      .url({ message: msg.INVALID_URL })
      .optional()
      .or(z.literal("")),
  }).partial(),

  params: z.object({
    id: z.string().regex(/^\d+$/, { message: msg.INVALID_ID }),
  }),
});

// =======================================================
// 3. SCHEMAS DE CONTEÚDO (COMENTÁRIO E DENÚNCIA)
// =======================================================

/**
 * Validação para Criação de Comentário (POST /events/:id/comments)
 */
export const CommentCreateSchema = z.object({
  body: z.object({
    // TEXTO - Obrigatório + Não vazio
    texto: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .min(3, { message: msg.MIN_LENGTH(3) })
      .max(500, { message: msg.MAX_LENGTH(500) }),
  }),
});

/**
 * Validação para Criação de Denúncia (POST /events/denounce)
 */
export const DenounceCreateSchema = z.object({
  body: z.object({
    // ID_EVENTO - Obrigatório
    id_evento: z
      .number()
      .int({ message: msg.INVALID_ID })
      .positive({ message: msg.INVALID_ID }),

    // MOTIVO - Obrigatório + Não vazio
    motivo: z
      .string()
      .min(1, { message: msg.REQUIRED_FIELD }) // <-- NÃO VAZIO
      .min(10, { message: msg.MIN_LENGTH(10) })
      .max(1000, { message: msg.MAX_LENGTH(1000) }),
  }),
});
