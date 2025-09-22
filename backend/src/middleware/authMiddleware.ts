// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';


export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato "Bearer TOKEN"

  if (token == null) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  try {
    const userPayload = verifyToken(token);

    if (!userPayload) {
      // O verifyToken retorna null se for inválido
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
  
    // Anexamos o payload decodificado do nosso JWT à requisição.
    req.user = userPayload; 
  
    next(); // Passa para a próxima função (o controlador)

  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
}