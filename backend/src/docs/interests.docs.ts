/**
 * @swagger
 * tags:
 *   name: Interesses
 *   description: Sistema de interesses e notificacoes dos eventos
 */



/**
 * @swagger
 * /events/{id}/interest:
 *   post:
 *     summary: Marcar interesse em um evento
 *     tags: [Interesses]
 *     security:
 *       - bearerAuth: []
 *     description: Marca o evento como de interesse para o usuario autenticado.
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
 *       201:
 *         description: Interesse registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 interested:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Evento nao encontrado
 */



/**
 * @swagger
 * /events/{id}/interest:
 *   delete:
 *     summary: Remover interesse do evento
 *     tags: [Interesses]
 *     security:
 *       - bearerAuth: []
 *     description: Remove o interesse do usuario no evento informado.
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
 *         description: Interesse removido
 *       404:
 *         description: Interesse inexistente
 */



/**
 * @swagger
 * /events/{id}/my-interest:
 *   get:
 *     summary: Verificar interesse do usuario no evento
 *     tags: [Interesses]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna se o usuario autenticado marcou interesse nesse evento.
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
 *         description: Status retornado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 interested:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Evento nao encontrado
 */



/**
 * @swagger
 * /events/my-interests:
 *   get:
 *     summary: Listar eventos marcados como interesse
 *     tags: [Interesses]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna todos os eventos que o usuario marcou como interesse.
 *
 *     responses:
 *       200:
 *         description: Lista de eventos de interesse retornada
 */
