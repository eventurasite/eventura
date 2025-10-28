import { PrismaClient, Categoria, Usuario } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o processo de seed...");

  // Limpa tabelas dependentes (em ordem)
  await prisma.imagemEvento.deleteMany({});
  await prisma.curtida.deleteMany({});      // <-- ADICIONADO
  await prisma.comentario.deleteMany({});   // <-- ADICIONADO
  await prisma.denuncia.deleteMany({});     // <-- ADICIONADO
  await prisma.inscricao.deleteMany({});    // <-- ADICIONADO
  console.log("Dependências (curtidas, comentários, etc.) apagadas.");

  // Agora pode apagar os Eventos
  await prisma.evento.deleteMany({});
  console.log("Eventos antigos foram apagados para garantir um estado limpo.");

  // Criar usuário administrador
  const adminSenhaHash = await bcrypt.hash("admin123", 10);

  const admin: Usuario = await prisma.usuario.upsert({
    where: { email: "admin@eventura.com" },
    update: {},
    create: {
      nome: "Administrador Eventura",
      email: "admin@eventura.com",
      senha: adminSenhaHash,
      tipo: "administrador",
      url_foto_perfil: "/assets/imagens/admin_logo.jpg",
      telefone: "999999999",
      descricao: "Perfil administrativo"
    },
  });
  console.log(`Usuário administrador criado/verificado: ${admin.email}`);

  // Criar categorias iniciais
  const categorias = [
    { nome: "Música" },
    { nome: "Esportes" },
    { nome: "Tecnologia" },
    { nome: "Arte e Cultura" },
    { nome: "Gastronomia" },
    { nome: "Comédia" },
    { nome: "Universitário" },
  ];

  await prisma.categoria.createMany({
    data: categorias,
    skipDuplicates: true,
  });
  console.log("🏷️ Categorias iniciais criadas/verificadas com sucesso.");

  // Buscar categorias
  const categoriaArte = await prisma.categoria.findUnique({ where: { nome: "Arte e Cultura" } });
  const categoriaGastronomia = await prisma.categoria.findUnique({ where: { nome: "Gastronomia" } });
  const categoriaTecnologia = await prisma.categoria.findUnique({ where: { nome: "Tecnologia" } });
  const categoriaEsportes = await prisma.categoria.findUnique({ where: { nome: "Esportes" } });
  const categoriaUniversitario = await prisma.categoria.findUnique({ where: { nome: "Universitário" } });
  console.log("IDs das categorias recuperados.");

  // --- Criar eventos de exemplo ---
  

  await prisma.evento.create({
    data: {
      titulo: "Ideathon UbyAgro & ABCZ",
      descricao: 'Um Ideathon é um evento colaborativo e intensivo, onde participantes se reúnem para gerar ideias inovadoras e criativas em um curto período de tempo. O termo combina as palavras "ideia" e "marathon" (maratona), e é similar a um hackathon, mas com um foco maior na geração de conceitos e propostas do que no desenvolvimento técnico ou codificação.',
      data: new Date("2025-11-07T20:00:00Z"),
      local: `FAZU - Faculdades Associadas de Uberaba
      Avenida Tutunas, 720. Vila Celeste | Uberaba - Minas Gerais`,
      preco: 0.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaTecnologia!.id_categoria,
      imagemEvento: { create: [{ url: "https://images.sympla.com.br/6900f9d61ea49-lg.png" }] }
    },
  });

  await prisma.evento.create({
    data: {
      titulo: "Corridas Unimed Uberaba",
      descricao: `🏃 Serão 5 km de energia e superação — e a alegria da Corridinha Kids pra toda família participar! 👧🧒 
      Chama os amigos, prepara o tênis e vem viver esse momento de saúde e diversão com a gente!`,
      data: new Date("2025-11-09T10:30:00Z"),
      local: "Avenida Nossa Senhora do Desterro, 300",
      preco: 0.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaEsportes!.id_categoria,
      imagemEvento: { create: [{ url: "https://static.wixstatic.com/media/b04a79_53c83948f0d94320b60649dd77dd171d~mv2.png/v1/fill/w_959,h_478,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/b04a79_53c83948f0d94320b60649dd77dd171d~mv2.png" }] }
    },
  });

  await prisma.evento.create({
    data: {
      titulo: "Encontros Musicais apresenta: Black Pantera",
      descricao: "O projeto Encontros Musicais, uma iniciativa do Sesi Cultura MG, chega em 2025 para celebrar a música autoral brasileira e aproximar o público de grandes artistas contemporâneos. No dia 21 de dezembro, o Teatro SESIMINAS Uberaba (MG) será o palco de um espetáculo único e imperdível: a apresentação da banda Black Pantera, com o projeto Desplugado, às 20h.",
      data: new Date("2025-12-21T23:00:00Z"),
      local: "Teatro SESIMINAS Uberaba - Praça Frei Eugênio, 231, Uberaba - MG  ",
      preco: 80.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaArte!.id_categoria,
      imagemEvento: { create: [{ url: "https://assets.bileto.sympla.com.br/eventmanager/production/3dgv3heskkfkgjeaqibqikmn3tb2pgkhp9t8hame7gn6vslt2emmiu5vgcj8s0k9jk6cfin8oqq8d6fb98jaidt6a3rp5lq857d62fn.webp" }] }
    },
  });

  await prisma.evento.create({
    data: {
      titulo: "Magnólia: A Festa do Sim",
      descricao: "Seu Halloween não precisa mais ser sozinho: A Festa do Sim é um convite pra quem quer reviver aquele beijo e uma segunda chance pra quem demorou demais na hora de tomar iniciativa.",
      data: new Date("2025-10-31T23:00:00Z"),
      local: "RUA SEGISMUNDO MENDES, 390. CENTRO, UBERABA-MG",
      preco: 10.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaUniversitario!.id_categoria,
      imagemEvento: { create: [{ url: "https://imagedelivery.net/O7_Y6XDx1JJ1t21C0rdfjQ/79364e4f-34a0-41c6-db81-26c9ecb56000/perfil" }] }
    },
  });

  await prisma.evento.create({
    data: {
      titulo: "O Rei do Show",
      descricao: "Inspirado no filme O Rei do Show, a adaptação do Musical 2025 traz uma narrativa emocionante sobre sonhos, desafios e superação. No palco, a história de um homem que reúne talentos extraordinários para formar um espetáculo inesquecível, e descobre, no caminho, a força da amizade e da persistência.",
      data: new Date("2025-10-28T23:00:00Z"),
      local: "Teatro SESIMINAS Uberaba - Praça Frei Eugênio, 231, Uberaba - Minas Gerais",
      preco: 40.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaArte!.id_categoria,
      imagemEvento: { create: [{ url: "https://assets.bileto.sympla.com.br/eventmanager/production/2kilaqh76uq9n82neadtolh83fk0t2ohprdvom666fvk3vn0a0h5ct6n1rus0p9shkcuglp640tjiqs3d9gvd33ngeqtoia3pvd6j03.webp" }] }
    },
  });

  await prisma.evento.create({
    data: {
      titulo: "Karaokê Lab",
      descricao: `Ei, bora soltar o Gogó no palco do Lab? Dia 26 nossa casinha recebe vocês pra dar aquele show!

                  Somando na noite tem promo Caipirinha de Limão por apenas R$15 🙌🏽

                  KARAOKÊ LAB • Como funciona?
                  ✹ Só pode pedir uma música por vez, após cantar a música você pode pedir outra.
                  ✹ Respeite a pessoa que vai cantar; favor não subir no palco se não for a sua vez.
                  ✹ A apresentadora chama ao microfone o seu nome e anuncia o artista que você vai cantar. Se você não estiver na área, perderá a vez.
                  ✹ Temos o limite de 40 canções por noite, a partir dai só na próxima edição.
                  ✹ Ao final da música ganha uma dose de cachaça!
                  ✹ Só pode cantar 2 pessoas por vez
                  ✹ É cobrada uma taxa de R$ 2,00
                  ✹ Você escolhe uma música da lista disponível no evento e passa para nossa equipe`,
      data: new Date("2025-10-31T23:00:00Z"),
      local: "Praça Comendador Quintino, 144 - Estados Unidos, Uberaba - MG, 38015-410, Brasil",
      preco: 10.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaUniversitario!.id_categoria,
      imagemEvento: { create: [{ url: "https://res.cloudinary.com/shotgun/image/upload/c_limit,ar_16:9,w_750/fl_lossy/f_auto/q_auto/c_limit,f_auto,fl_lossy,q_auto,w_1920/v1761581682/production/artworks/Artboard_11-100_mrmyln" }] }
    },
  });

  console.log("Todos os 6 eventos foram criados com sucesso.");
  console.log("Processo de seed finalizado.");
}

main()
  .catch((e) => {
    console.error("Ocorreu um erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
