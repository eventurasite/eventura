# 🎟️ Eventura

Uma plataforma web completa para gestão, divulgação e engajamento de eventos locais e online. O Eventura permite que organizadores criem e gerenciem seus eventos, enquanto os usuários podem explorar, demonstrar interesse, comentar e interagir com a comunidade.

## 💻 Sobre o Projeto

O Eventura é uma plataforma web que centraliza eventos da cidade de Uberaba, permitindo que moradores descubram novas experiências e organizadores divulguem suas iniciativas de forma prática e acessível. Nosso objetivo é conectar pessoas, valorizar a cultura local e fortalecer o sentimento de comunidade tornando os eventos experiências compartilhadas.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando uma arquitetura moderna baseada em microsserviços (Front/Back) e conteinerização.

**Frontend:**
* React.js (Vite)
* React Router DOM (Roteamento protegido)
* Axios (Consumo da API)
* CSS puro para estilização global e de componentes

**Backend:**
* Node.js com Express
* Prisma ORM (Modelagem e migrações do banco de dados)
* PostgreSQL (Banco de Dados Relacional)
* JWT (JSON Web Tokens) para Autenticação e Autorização
* Multer (Upload de arquivos e imagens)
* Nodemailer (Envio de e-mails de verificação e recuperação de senha)
* Swagger (Documentação interativa da API)
* Docker & Docker Compose (Ambiente de desenvolvimento)

## ✨ Principais Funcionalidades

* **Autenticação e Segurança:** Login, cadastro, verificação de e-mail e recuperação de senha com tokens seguros. Controle de rotas protegidas e permissões baseadas em roles (User/Admin).
* **Gestão de Eventos:** Operações completas de CRUD (Criar, Ler, Atualizar, Deletar) para eventos, incluindo upload de imagens.
* **Interação Social:** Sistema de comentários, likes em eventos e lista de interesses ("Minha Agenda").
* **Moderação:** Painel administrativo para gerenciar usuários e visualizar/processar denúncias de eventos ou comentários.
* **Notificações:** Jobs em background que enviam lembretes de eventos para os usuários interessados.


## Como clonar o projeto

**Pré-requisitos**

- Git instalado e configurado.

- Visual Studio Code (ou outro editor/IDE de sua preferência).

Siga os passos abaixo para clonar e abrir o projeto em seu VSCode:

1. **Abra o terminal Git Bash no VSCode**.  
    Você também pode usar outro terminal de sua preferência.

2. **Crie ou entre na pasta onde deseja armazenar seus repositórios Git**:
    ```bash
    mkdir git
    cd git

3. **Clone o repositório**:
    ```bash
    git clone https://github.com/eventurasite/eventura.git

4. **Entre na pasta do rpojeto e abra no VSCode**:
    ```bash
    cd eventura 
    code .

