/**
 * @swagger
 * tags:
 *   name: Filtros
 *   description: Filtros avançados de busca de eventos
 */





/**
 * @swagger
 * /events/filter:
 *   get:
 *     summary: Filtrar eventos por categoria, mês, preço ou busca textual
 *     tags: [Filtros]
 *     description: |
 *       Permite aplicar diversos filtros combinados:
 *       
 *       - **categoria**: texto (nome da categoria)
 *       - **mes**: formato YYYY-MM (ex: 2025-04)
 *       - **preco**: valor máximo (string ou número)
 *       - **busca**: texto contido no título/descrição
 *
 *       Todos os filtros são opcionais e podem ser usados juntos.
 *     parameters:
 *       - name: categoria
 *         in: query
 *         description: "Nome da categoria (ex: show, teatro, curso)"
 *         schema:
 *           type: string
 *         example: show
 *
 *       - name: mes
 *         in: query
 *         description: Mês no formato YYYY-MM
 *         schema:
 *           type: string
 *         example: "2025-04"
 *
 *       - name: preco
 *         in: query
 *         description: Preço máximo do evento
 *         schema:
 *           type: string
 *         example: "100"
 *
 *       - name: busca
 *         in: query
 *         description: Busca textual no título/descrição do evento
 *         schema:
 *           type: string
 *         example: djavan
 *
 *     responses:
 *       200:
 *         description: Lista filtrada de eventos
 *       400:
 *         description: Filtro inválido
 */
