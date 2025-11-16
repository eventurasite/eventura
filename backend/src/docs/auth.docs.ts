/**
 * @swagger
 * tags:
 *   name: Autenticacao
 *   description: Rotas relacionadas ao cadastro, login e gerenciamento de usuários
 */



/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Autenticacao]
 *     description: Cria um usuário comum no sistema com nome, e-mail e senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Lorena Silva"
 *               email:
 *                 type: string
 *                 example: "lorena@example.com"
 *               senha:
 *                 type: string
 *                 example: "SenhaFort3@"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       409:
 *         description: E-mail já cadastrado
 */



/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login com e-mail e senha
 *     tags: [Autenticacao]
 *     description: Gera um token JWT ao autenticar um usuário válido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: "lorena@example.com"
 *               senha:
 *                 type: string
 *                 example: "SenhaFort3@"
 *     responses:
 *       200:
 *         description: Login autorizado
 *       401:
 *         description: Credenciais incorretas
 *       404:
 *         description: Usuário não encontrado
 */



/**
 * @swagger
 * /auth/password/forgot:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     tags: [Autenticacao]
 *     description: Envia um e-mail com link para redefinição de senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "lorena@example.com"
 *     responses:
 *       200:
 *         description: E-mail enviado
 *       404:
 *         description: Usuário não encontrado
 */



/**
 * @swagger
 * /auth/password/reset:
 *   post:
 *     summary: Redefinir senha com token
 *     tags: [Autenticacao]
 *     description: Atualiza a senha do usuário após validação do token de recuperação.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - novaSenha
 *             properties:
 *               token:
 *                 type: string
 *               novaSenha:
 *                 type: string
 *                 example: "SenhaNova123@"
 *     responses:
 *       200:
 *         description: Senha atualizada
 *       400:
 *         description: Token inválido ou expirado
 */



/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Buscar dados do usuário autenticado
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna dados do usuário logado.
 *     responses:
 *       200:
 *         description: Dados do usuário retornados
 *       401:
 *         description: Token ausente ou inválido
 */



/**
 * @swagger
 * /auth/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     description: Atualiza o perfil do usuário autenticado.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               telefone:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil atualizado
 *       403:
 *         description: Usuário não pode modificar outro usuário
 */
