import { ZodType, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

/**
 * Estrutura padrão de erro de validação
 */
export interface ValidationException {
  message: string;
  errors?: Record<string, string>;
  status: number;
}

/**
 * Middleware genérico de validação usando Zod.
 * Valida: body, query e params (quando definidos no schema).
 */
export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // O Zod faz o parsing e lança um erro se falhar
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Se passar, segue o fluxo
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails: Record<string, string> = {};

        // Monta objeto de erros campo -> mensagem
        error.issues.forEach((err) => {
          let field = err.path.join(".");

          // Remove prefixos body./query./params. para ficar só o nome do campo
          const prefixes = ["body.", "query.", "params."];
          for (const prefix of prefixes) {
            if (field.startsWith(prefix)) {
              field = field.substring(prefix.length);
              break;
            }
          }

          errorDetails[field] = err.message;
        });

        // Pega o primeiro erro para usar como mensagem principal
        const firstIssue = error.issues[0];
        let firstField = firstIssue.path.join(".");

        const prefixes = ["body.", "query.", "params."];
        for (const prefix of prefixes) {
          if (firstField.startsWith(prefix)) {
            firstField = firstField.substring(prefix.length);
            break;
          }
        }

        const validationError: ValidationException = {
          // ex: "nome: O campo deve ter no máximo 100 caracteres."
          message: `${firstField}: ${firstIssue.message}`,
          errors: errorDetails,
          status: 400,
        };

        return res.status(validationError.status).json(validationError);
      }

      // Se não for erro de validação, erro interno
      return res
        .status(500)
        .json({ message: "Erro interno do servidor." });
    }
  };
