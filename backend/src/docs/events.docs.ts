/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: Rotas de criação, consulta, atualização e exclusão de eventos
 */



/**
 * @swagger
 * /events:
 *   post:
 *     summary: Criar um novo evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       Cria um evento com título, descrição, data, local, preço, categoria e imagens.
 *       É obrigatório enviar ao menos **uma imagem** no campo `imagens`.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descricao
 *               - data
 *               - local
 *               - preco
 *               - id_categoria
 *               - imagens
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Show Djavan"
 *               descricao:
 *                 type: string
 *                 example: "Show ao vivo com banda completa"
 *               data:
 *                 type: string
 *                 example: "2025-04-10"
 *               local:
 *                 type: string
 *                 example: "Teatro Municipal"
 *               preco:
 *                 type: string
 *                 example: "150.00"
 *               id_categoria:
 *                 type: integer
 *                 example: 1
 *               imagens:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       400:
 *         description: Dados inválidos ou imagens ausentes
 */



/**
 * @swagger
 * /events:
 *   get:
 *     summary: Listar todos os eventos
 *     tags: [Eventos]
 *     description: Retorna todos os eventos cadastrados.
 *     responses:
 *       200:
 *         description: Lista completa de eventos
 */



/**
 * @swagger
 * /events/latest:
 *   get:
 *     summary: Listar os últimos 3 eventos criados
 *     tags: [Eventos]
 *     description: Retorna apenas os 3 eventos mais recentes.
 *     responses:
 *       200:
 *         description: Lista dos últimos eventos
 */



/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Buscar evento por ID
 *     tags: [Eventos]
 *     description: Retorna os dados de um evento específico.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Evento não encontrado
 */



/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualizar informações de um evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     description: Atualiza os dados de um evento criado pelo organizador autenticado.
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
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *               data:
 *                 type: string
 *               local:
 *                 type: string
 *               preco:
 *                 type: string
 *               id_categoria:
 *                 type: integer
 *
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       400:
 *         description: Nenhum dado enviado ou preço inválido
 *       403:
 *         description: Usuário não é o criador do evento
 *       404:
 *         description: Evento não encontrado
 */



/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Excluir evento
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     description: Remove um evento criado pelo usuário autenticado.
 *
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do evento
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento excluído
 *       403:
 *         description: Usuário não pode excluir eventos de outros
 *       404:
 *         description: Evento não encontrado
 */



/**
 * @swagger
 * /events/my-events:
 *   get:
 *     summary: Listar eventos criados pelo organizador
 *     tags: [Eventos]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna todos os eventos criados pelo usuário autenticado.
 *     responses:
 *       200:
 *         description: Lista de eventos do organizador
 */



/**
 * @swagger
 * /events/categories:
 *   get:
 *     summary: Listar categorias de eventos
 *     tags: [Eventos]
 *     description: Retorna todas as categorias cadastradas.
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
