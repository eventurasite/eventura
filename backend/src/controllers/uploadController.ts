import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function uploadProfileImage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    }

    const url_foto_perfil = `/uploads/${file.filename}`;

    await prisma.usuario.update({
      where: { id_usuario: Number(id) },
      data: { url_foto_perfil },
    });

    return res.status(200).json({ url_foto_perfil });

  } catch (error) {
    console.error("Erro no upload da imagem:", error);
    return res.status(500).json({ message: 'Erro interno ao processar o upload.' });
  }
}
export async function removeProfileImage(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = await prisma.usuario.findUnique({
      where: { id_usuario: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se existe uma foto para remover
    if (user.url_foto_perfil) {
      const filename = path.basename(user.url_foto_perfil);
      const filePath = path.resolve(__dirname, '..', '..', 'uploads', filename);
      
      // Deleta o arquivo físico do servidor, se ele existir
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Atualiza o banco de dados, removendo a referência da foto
      await prisma.usuario.update({
        where: { id_usuario: Number(id) },
        data: { url_foto_perfil: null },
      });
    }

    return res.status(200).json({ message: 'Foto de perfil removida com sucesso.' });

  } catch (error) {
    console.error("Erro ao remover a imagem:", error);
    return res.status(500).json({ message: 'Erro interno ao remover a imagem.' });
  }
}