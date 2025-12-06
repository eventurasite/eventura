import { ZodType, ZodError } from "zod"; // <-- ALTERADO AQUI
import { Request, Response, NextFunction } from "express";

/**
 * Interface para a Estrutura de Erro de Validação
 */
export interface ValidationException {
  message: string;
  errors?: Record<string, string>;
  status: number;
}

/**
 * Middleware para validar o corpo da requisição usando um schema Zod.
 *
 * @param schema O schema Zod a ser utilizado na validação.
 * @returns Um middleware de Express.
 */
export const validate = (schema: ZodType) => // 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // O Zod faz o parsing e lança um erro se falhar
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Se tudo estiver OK, continua
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Mapeia os erros para um formato mais limpo
        const errorDetails: Record<string, string> = {};
        error.issues.forEach((err) => {
          // O Zod usa um caminho (path) para o campo
          const path = err.path.join(".");
          // Ignoramos o prefixo 'body.' ou 'query.'
          const field = path.startsWith("body.") ? path.substring(5) : path;
          errorDetails[field] = err.message;
        });

        // Lança a exceção formatada (status 400 Bad Request)
        const validationError: ValidationException = {
          message: "Falha na validação dos dados.",
          errors: errorDetails,
          status: 400,
        };

        // Passa o erro para o próximo middleware de erro (se houver)
        return res.status(validationError.status).json(validationError);
      }

      // Se for outro tipo de erro, retorna 500
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  };