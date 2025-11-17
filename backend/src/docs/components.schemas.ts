/**
 * @swagger
 * components:
 *   schemas:
 *
 *     Usuario:
 *       type: object
 *       properties:
 *         id_usuario:
 *           type: integer
 *         nome:
 *           type: string
 *         email:
 *           type: string
 *         telefone:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [comum, administrador]
 *         descricao:
 *           type: string
 *         url_foto_perfil:
 *           type: string
 *         authProvider:
 *           type: string
 *           enum: [local, google]
 *         data_criacao:
 *           type: string
 *         data_modificacao:
 *           type: string
 *
 *
 *     Categoria:
 *       type: object
 *       properties:
 *         id_categoria:
 *           type: integer
 *         nome:
 *           type: string
 *
 *
 *     ImagemEvento:
 *       type: object
 *       properties:
 *         id_imagem:
 *           type: integer
 *         url:
 *           type: string
 *         id_evento:
 *           type: integer
 *
 *
 *     Comentario:
 *       type: object
 *       properties:
 *         id_comentario:
 *           type: integer
 *         texto:
 *           type: string
 *         data_criacao:
 *           type: string
 *         id_usuario:
 *           type: integer
 *         id_evento:
 *           type: integer
 *
 *
 *     Curtida:
 *       type: object
 *       properties:
 *         id_curtida:
 *           type: integer
 *         id_usuario:
 *           type: integer
 *         id_evento:
 *           type: integer
 *         data_criacao:
 *           type: string
 *
 *
 *     Interesse:
 *       type: object
 *       properties:
 *         id_interesse:
 *           type: integer
 *         id_usuario:
 *           type: integer
 *         id_evento:
 *           type: integer
 *         data_criacao:
 *           type: string
 *         notificacoes_ativas:
 *           type: boolean
 *
 *
 *     Denuncia:
 *       type: object
 *       properties:
 *         id_denuncia:
 *           type: integer
 *         id_usuario:
 *           type: integer
 *         id_evento:
 *           type: integer
 *         motivo:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pendente, revisada, rejeitada]
 *         data_criacao:
 *           type: string
 *
 *
 *     Evento:
 *       type: object
 *       properties:
 *         id_evento:
 *           type: integer
 *         titulo:
 *           type: string
 *         descricao:
 *           type: string
 *         data:
 *           type: string
 *         local:
 *           type: string
 *         preco:
 *           type: string
 *         status:
 *           type: string
 *           enum: [ativo, cancelado, encerrado]
 *         id_organizador:
 *           type: integer
 *         id_categoria:
 *           type: integer
 *         data_criacao:
 *           type: string
 *         data_modificacao:
 *           type: string
 *         url_link_externo:
 *           type: string
 *         imagens:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/ImagemEvento"
 */
