import jwt, { SignOptions } from "jsonwebtoken";

/**
 * Gera um JWT com base no payload informado.
 */
export function generateToken(payload: object): string {
  const secret: string = process.env.JWT_SECRET || "default-secret";

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as SignOptions["expiresIn"],
  });
}

/**
 * Verifica e decodifica um JWT.
 * Retorna o payload se válido, ou null se inválido.
 */
export function verifyToken(token: string): any | null {
  try {
    const secret: string = process.env.JWT_SECRET || "default-secret";
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}
