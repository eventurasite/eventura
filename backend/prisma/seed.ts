import { PrismaClient, Categoria, Usuario } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o processo de seed...");

  // Limpa tabelas dependentes
  await prisma.imagemEvento.deleteMany({});
  await prisma.evento.deleteMany({});
  console.log("Eventos e imagens antigos foram apagados para garantir um estado limpo.");

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
  console.log("IDs das categorias recuperados.");

  // --- Criar eventos de exemplo ---
  await prisma.evento.create({
    data: {
      titulo: "Festival Uberaba Games",
      descricao: "O maior encontro de gamers da região! Campeonatos, lançamentos, cosplays e muita diversão.",
      data: new Date("2025-11-05T10:00:00Z"),
      local: "Centro de Eventos CDL",
      preco: 50.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaTecnologia!.id_categoria,
      imagemEvento: { create: [{ url: "/assets/imagens/foto_evento - games.webp" }] }
    },
  });

  await prisma.evento.create({
    data: {
      titulo: "Festival do Queijo & Zebu",
      descricao: "Uma deliciosa celebração dos sabores locais com pratos típicos e a tradicional exposição de gado Zebu.",
      data: new Date("2025-10-20T11:00:00Z"),
      local: "ABCZ - Associação Brasileira de Criadores de Zebu",
      preco: 25.5,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaGastronomia!.id_categoria,
      imagemEvento: { create: [{ url: "/assets/imagens/foto_evento - festival de queijo.jpeg" }] }
    },
  });

  await prisma.evento.create({
    data: {
      titulo: "Noite Astronômica no Parque",
      descricao: "Observar as estrelas com telescópios profissionais e guias especializados.",
      data: new Date("2025-09-15T19:00:00Z"),
      local: "Parque das Acácias (Piscinão)",
      preco: 10.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaArte!.id_categoria,
      imagemEvento: { create: [{ url: "/assets/imagens/foto_evento - noite astronomica.jpg" }] }
    },
  });

  await prisma.evento.create({
    data: {
      titulo: "Feira de Artesanato Local",
      descricao: "Peças únicas, comidas típicas e música ao vivo com artesãos de Uberaba.",
      data: new Date("2025-09-28T09:00:00Z"),
      local: "Praça Rui Barbosa",
      preco: 0.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaArte!.id_categoria,
      imagemEvento: { create: [{ url: "/assets/imagens/eventos-4.jpg" }] }
    },
  });

  await prisma.evento.create({
    data: {
      titulo: "Encontro de Carros Antigos",
      descricao: "Exposição de carros clássicos e raros que marcaram época.",
      data: new Date("2025-10-12T08:00:00Z"),
      local: "Estacionamento do Shopping Uberaba",
      preco: 5.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaTecnologia!.id_categoria,
      imagemEvento: { create: [{ url: "/assets/imagens/eventos-5.jpg" }] }
    },
  });

  await prisma.evento.create({
    data: {
      titulo: "Caminhada Ecológica",
      descricao: "Conecte-se com a natureza numa caminhada guiada pela mata do Ipê.",
      data: new Date("2025-11-16T07:30:00Z"),
      local: "Universidade Federal do Triângulo Mineiro (UFTM)",
      preco: 0.0,
      id_organizador: admin.id_usuario,
      id_categoria: categoriaEsportes!.id_categoria,
      imagemEvento: { create: [{ url: "/assets/imagens/eventos-6.jpg" }] }
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
