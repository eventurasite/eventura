/**
 * @swagger
 * tags:
 *   name: Autenticacao
 *   description: Rotas relacionadas ao cadastro, login e gerenciamento de usuários
 */

/* -------------------------------------------------------------------------- */
/*                                  REGISTER                                   */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Autenticacao]
 *     description: >
 *       Cria um usuário comum no sistema e envia um e-mail contendo um link de verificação.
 *       A conta só pode fazer login após confirmar o e-mail.
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
 *         description: Usuário criado — verifique seu e-mail para ativar a conta.
 *       409:
 *         description: E-mail já cadastrado
 */

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                    */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login com e-mail e senha
 *     tags: [Autenticacao]
 *     description: >
 *       Autentica o usuário e retorna um token JWT.
 *       Apenas usuários com e-mail confirmado podem fazer login.
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
 *       400:
 *         description: E-mail não verificado
 *       404:
 *         description: Usuário não encontrado
 *       401:
 *         description: Senha incorreta
 */

/* -------------------------------------------------------------------------- */
/*                              VERIFY EMAIL                                   */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /auth/verify-email:
 *   get:
 *     summary: Confirmar e-mail do usuário
 *     tags: [Autenticacao]
 *     description: >
 *       Valida o token enviado por e-mail e ativa a conta do usuário.
 *       <br>
 *       Exemplo: <code>/auth/verify-email?token=SEU_TOKEN</code>.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: E-mail verificado com sucesso.
 *       400:
 *         description: Token inválido ou expirado.
 *       500:
 *         description: Erro interno ao verificar e-mail.
 */

/* -------------------------------------------------------------------------- */
/*                              FORGOT PASSWORD                                */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /auth/password/forgot:
 *   post:
 *     summary: Solicitar recuperação de senha
 *     tags: [Autenticacao]
 *     description: >
 *       Envia um e-mail com link para redefinição de senha.
 *       Não revela se o usuário existe (boa prática de segurança).
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
 *         description: Se o e-mail existir, enviaremos um link para redefinir.
 */

/* -------------------------------------------------------------------------- */
/*                               RESET PASSWORD                                */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /auth/password/reset:
 *   post:
 *     summary: Redefinir senha com token
 *     tags: [Autenticacao]
 *     description: Atualiza a senha do usuário após validação do token recebido por e-mail.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               password:
 *                 type: string
 *                 example: "NovaSenha123@"
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso.
 *       400:
 *         description: Token inválido, expirado ou senha inválida.
 */

/* -------------------------------------------------------------------------- */
/*                                     ME                                      */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Dados do usuário autenticado
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     description: Retorna as informações do usuário logado.
 *     responses:
 *       200:
 *         description: Dados retornados
 *       401:
 *         description: Token inválido ou ausente
 */

/* -------------------------------------------------------------------------- */
/*                                UPDATE USER                                  */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /auth/{id}:
 *   put:
 *     summary: Atualizar dados do usuário
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Usuários podem alterar seu próprio perfil.
 *       Administradores podem alterar qualquer usuário.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
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
 *         description: Usuário atualizado
 *       403:
 *         description: Sem permissão
 */

/* -------------------------------------------------------------------------- */
/*                               DELETE USER                                   */
/* -------------------------------------------------------------------------- */

/**
 * @swagger
 * /auth/{id}:
 *   delete:
 *     summary: Excluir usuário
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     description: >
 *       Usuários podem excluir a si mesmos.
 *       Administradores podem excluir qualquer usuário.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso.
 *       403:
 *         description: Sem permissão.
 */
