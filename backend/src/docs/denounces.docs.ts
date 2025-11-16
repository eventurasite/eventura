/**
 * @swagger
 * tags:
 *   name: Denuncias
 *   description: Sistema de denuncias dos eventos, incluindo moderacao
 */



/**
 * @swagger
 * /events/denounces:
 *   post:
 *     summary: Criar denuncia sobre um evento
 *     tags: [Denuncias]
 *     security:
 *       - bearerAuth: []
 *     description: Cria uma denuncia de um evento existente. Qualquer usuario autenticado pode denunciar.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_evento
 *               - motivo
 *             properties:
 *               id_evento:
 *                 type: integer
 *                 example: 12
 *               motivo:
 *                 type: string
 *                 example: "Conteudo inapropriado"
 *
 *     responses:
 *       201:
 *         description: Denuncia criada com sucesso
 *       400:
 *         description: Motivo obrigatorio
 *       404:
 *         description: Evento nao encontrado
 */



/**
 * @swagger
 * /events/admin/denounces:
 *   get:
 *     summary: Listar denuncias pendentes (somente administradores)
 *     tags: [Denuncias]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna todas as denuncias pendentes para revisao.
 *
 *     responses:
 *       200:
 *         description: Lista de denuncias retornada
 *       403:
 *         description: Acesso negado
 */



/**
 * @swagger
 * /events/admin/denounces/{id}:
 *   put:
 *     summary: Atualizar status da denuncia
 *     tags: [Denuncias]
 *     security:
 *       - bearerAuth: []
 *     description: Atualiza o status da denuncia para pendente, revisada ou rejeitada.
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da denuncia
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, revisada, rejeitada]
 *                 example: "revisada"
 *
 *     responses:
 *       200:
 *         description: Denuncia atualizada
 *       400:
 *         description: Status invalido
 *       404:
 *         description: Denuncia nao encontrada
 *
 *
 *   delete:
 *     summary: Excluir denuncia
 *     tags: [Denuncias]
 *     security:
 *       - bearerAuth: []
 *     description: Exclui uma denuncia do sistema.
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID da denuncia
 *         schema:
 *           type: integer
 *
 *     responses:
 *       200:
 *         description: Denuncia removida
 *       404:
 *         description: Denuncia inexistente
 */
