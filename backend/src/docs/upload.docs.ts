/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Rotas de upload e remoção de imagem de perfil do usuário
 */



/**
 * @swagger
 * /auth/upload/{id}:
 *   post:
 *     summary: Upload de foto de perfil
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     description: Envia uma imagem e atualiza a foto de perfil do usuário.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo da imagem
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url_foto_perfil:
 *                   type: string
 *                   example: "/uploads/minha_foto.png"
 *       400:
 *         description: Nenhuma imagem enviada
 *       403:
 *         description: Usuário tentando alterar o perfil de outro usuário
 */



/**
 * @swagger
 * /auth/upload/{id}:
 *   delete:
 *     summary: Remover foto de perfil
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     description: Remove o arquivo da foto de perfil do usuário e limpa o campo no banco.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Foto removida com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       403:
 *         description: Usuário tentando remover foto de outro usuário
 */
