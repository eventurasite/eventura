import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log("Iniciando o processo de seed...");

    await prisma.imagemEvento.deleteMany({});
    await prisma.evento.deleteMany({});
    console.log('Eventos e imagens antigos foram apagados para garantir um estado limpo.');

    // Criação do utilizador administrador
    const salt = await bcrypt.genSalt(10);
    const adminSenhaHash = await bcrypt.hash('admin123', salt);

    const admin = await prisma.usuario.upsert({
        where: {email: 'admin@eventura.com'},
        update: {},
        create: {
            nome: 'Administrador Eventura',
            email: 'admin@eventura.com',
            senha: adminSenhaHash,
            tipo: 'administrador',
            url_foto_perfil: '/assets/imagens/admin_logo.jpg',
            telefone: '999999999',
            descricao: 'Perfil administrativo',
        },
    });
    console.log(`Utilizador Administrador criado/verificado: ${admin.email}`);
    
    // Criação das categorias
    const categorias = [
        {nome: 'Música'},
        {nome: 'Esportes'},
        { nome: 'Tecnologia' },
        { nome: 'Arte e Cultura' },
        { nome: 'Gastronomia' },
        { nome: 'Comédia' },
    ];

    await prisma.categoria.createMany({
        data: categorias,
        skipDuplicates: true,
    });
    console.log('Categorias iniciais criadas/verificadas com sucesso.');

    // Buscando os ids das categorias
    const categoriaArte = await prisma.categoria.findUnique({where: {nome: 'Arte e Cultura'}});
    const categoriaGastronomia = await prisma.categoria.findUnique({where: {nome: 'Gastronomia'}});
    const categoriaTecnologia = await prisma.categoria.findUnique({where: {nome: 'Tecnologia'}});
    const categoriaEsportes = await prisma.categoria.findUnique({where: {nome: 'Esportes'}});
    console.log('Ids das categorias recuperados');

    // --- CRIAÇÃO DE TODOS OS 6 EVENTOS DO CARROSSEL ---

    // 1. Festival Uberaba Games
    await prisma.evento.create({
        data: {
            titulo: 'Festival Uberaba Games',
            descricao: 'O maior encontro de gamers da região! Campeonatos, lançamentos, cosplays e muita diversão para os amantes de videojogos.',
            data: new Date('2025-11-05T10:00:00Z'),
            local: 'Centro de Eventos CDL',
            preco: 50.00,
            id_organizador: admin.id_usuario,
            id_categoria: categoriaTecnologia.id_categoria,
            imagemEvento: { create: [{ url: '/assets/imagens/foto_evento - games.webp' }] }
        }
    });

    // 2. Festival do Queijo & Zebu
    await prisma.evento.create({
        data: {
            titulo: 'Festival do Queijo & Zebu',
            descricao: 'Uma deliciosa celebração dos sabores locais, com os melhores queijos da região, pratos típicos e a tradicional exposição de gado Zebu.',
            data: new Date('2025-10-20T11:00:00Z'),
            local: 'ABCZ - Associação Brasileira de Criadores de Zebu',
            preco: 25.50,
            id_organizador: admin.id_usuario,
            id_categoria: categoriaGastronomia.id_categoria,
            imagemEvento: { create: [{ url: '/assets/imagens/foto_evento - festival de queijo.jpeg' }] }
        }
    });

    // 3. Noite Astronômica no Parque
    await prisma.evento.create({
        data: {
            titulo: 'Noite Astronômica no Parque',
            descricao: 'Venha observar as estrelas e aprender sobre o cosmos com telescópios profissionais e guias especializados.',
            data: new Date('2025-09-15T19:00:00Z'),
            local: 'Parque das Acácias (Piscinão)',
            preco: 10.00,
            id_organizador: admin.id_usuario,
            id_categoria: categoriaArte.id_categoria,
            imagemEvento: { create: [{ url: '/assets/imagens/foto_evento - noite astronomica.jpg' }] }
        }
    });

    // 4. Feira de Artesanato Local
    await prisma.evento.create({
        data: {
            titulo: 'Feira de Artesanato Local',
            descricao: 'Descubra o talento dos artesãos de Uberaba e região. Peças únicas, comidas típicas e música ao vivo.',
            data: new Date('2025-09-28T09:00:00Z'),
            local: 'Praça Rui Barbosa',
            preco: 0.00,
            id_organizador: admin.id_usuario,
            id_categoria: categoriaArte.id_categoria,
            imagemEvento: { create: [{ url: '/assets/imagens/eventos-4.jpg' }] }
        }
    });

    // 5. Encontro de Carros Antigos
    await prisma.evento.create({
        data: {
            titulo: 'Encontro de Carros Antigos',
            descricao: 'Uma viagem no tempo sobre rodas! Exposição de carros clássicos e raros que marcaram época.',
            data: new Date('2025-10-12T08:00:00Z'),
            local: 'Estacionamento do Shopping Uberaba',
            preco: 5.00,
            id_organizador: admin.id_usuario,
            id_categoria: categoriaTecnologia.id_categoria,
            imagemEvento: { create: [{ url: '/assets/imagens/eventos-5.jpg' }] }
        }
    });

    // 6. Caminhada Ecológica
    await prisma.evento.create({
        data: {
            titulo: 'Caminhada Ecológica',
            descricao: 'Conecte-se com a natureza numa caminhada guiada pela mata do Ipê. Traga sua garrafa de água e venha respirar ar puro.',
            data: new Date('2025-11-16T07:30:00Z'),
            local: 'Universidade Federal do Triângulo Mineiro (UFTM)',
            preco: 0.00,
            id_organizador: admin.id_usuario,
            id_categoria: categoriaEsportes.id_categoria,
            imagemEvento: { create: [{ url: '/assets/imagens/eventos-6.jpg' }] }
        }
    });


    console.log('Todos os 6 eventos de exemplo foram criados com sucesso.');
    console.log('Processo de seed finalizado.');
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o processo de seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });