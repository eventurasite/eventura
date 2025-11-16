/**
 * @swagger
 * tags:
 *   name: Comentarios
 *   description: Sistema de comentários dos eventos
 */



/**
 * @swagger
 * /events/{id}/comments:
 *   post:
 *     summary: Criar um comentário em um evento
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     description: Adiciona um comentário ao evento informado.
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: integer
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - texto
 *             properties:
 *               texto:
 *                 type: string
 *                 example: "Excelente evento!"
 *
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 *       400:
 *         description: Texto do comentário vazio
 *       404:
 *         description: Evento não encontrado
 */



/**
 * @swagger
 * /events/{id}/comments:
 *   get:
 *     summary: Listar comentários de um evento
 *     tags: [Comentarios]
 *     description: Retorna todos os comentários feitos no evento.
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Lista de comentários retornada
 *       404:
 *         description: Evento não encontrado
 */



/**
 * @swagger
 * /events/comments/{commentId}:
 *   delete:
 *     summary: Excluir comentário
 *     tags: [Comentarios]
 *     security:
 *       - bearerAuth: []
 *     description: Remove um comentário. Apenas o autor ou um administrador pode deletar.
 *
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: ID do comentário
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Comentário excluído
 *       403:
 *         description: Usuário não possui permissão
 *       404:
 *         description: Comentário inexistente
 */
