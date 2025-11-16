/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Sistema de curtidas dos eventos
 */



/**
 * @swagger
 * /events/{id}/like:
 *   post:
 *     summary: Curtir ou descurtir evento
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Alterna o status de curtida do evento para o usuário autenticado.
 *
 *       - Se o usuário **ainda não curtiu**, a rota cria a curtida.
 *       - Se o usuário **já curtiu**, a rota remove a curtida (toggle).
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
 *         description: Retorna o novo status de curtida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Evento não encontrado
 */



/**
 * @swagger
 * /events/{id}/my-like:
 *   get:
 *     summary: Verificar se o usuário curtiu um evento
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna se o usuário logado curtiu ou não o evento.
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
 *         description: Status retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Evento não encontrado
 */
