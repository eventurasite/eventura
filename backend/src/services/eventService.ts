// backend/src/services/eventService.ts
import { Evento, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Criar um novo evento.
 */
export async function createEvent(eventData: { 
  titulo: string;
  descricao: string;
  data: Date;
  local: string;
  preco: number;
  id_categoria: number;
  id_organizador: number;
  imagens: { url: string }[];
}) {
  const { titulo, descricao, data, local, preco, id_categoria, id_organizador, imagens } = eventData;

  // Cria o evento e as imagens associadas em uma única transação
  return prisma.evento.create({
    data: {
      titulo,
      descricao,
      data,
      local,
      preco,
      id_organizador,
      id_categoria,
      imagemEvento: {
        create: imagens,
      },
    },
    include: {
      imagemEvento: true, // Retorna as imagens criadas
    },
  });
}

/**
 * Listar todas as categorias de eventos.
 */
export async function findAllCategories() {
  return prisma.categoria.findMany();
}


/**
 * Listar todos os eventos com suas imagens
 */
export async function findAllEvents() {
  return prisma.evento.findMany({
    // ADICIONADO: Ordena os resultados pela data de criação, em ordem decrescente
    orderBy: {
      data_criacao: "desc",
    },
    include: {
      imagemEvento: true,
      categoria: true, // Mantém a inclusão da categoria
    },
  });
}

/**
 * Listar os 3 eventos mais recentes
 */
export async function findLatestEvents() {
  return prisma.evento.findMany({
    orderBy: {
      data_criacao: "desc", // Ordena pela data de criação, do mais novo para o mais antigo
    },
    take: 3, // Limita o resultado a 3 eventos
    include: {
      imagemEvento: true, // Inclui as imagens associadas
    },
  });
}
//buscar por id
export const getEventById = async (id: number): Promise<Evento | null> => {
  try {
    const event = await prisma.evento.findUnique({
      where: { id_evento: id },
      // ADIÇÃO: Inclui os dados relacionados que o frontend precisa
      include: {
        imagemEvento: true, // Para mostrar as imagens
        categoria: true,    // Para mostrar o nome da categoria
        organizador: {      // Para mostrar o nome do organizador
          select: {
            id_usuario: true, // <-- CORREÇÃO AQUI: Precisamos do ID do organizador
            nome: true,
          },
        },
      },
    });
    return event;
  } catch (error: any) {
    throw new Error(`Erro ao buscar evento: ${error.message}`);
  }
};

export async function findEventsByOrganizer(organizerId: number) {
  return prisma.evento.findMany({
    where: {
      id_organizador: organizerId,
    },
    include: {
      imagemEvento: true,
      categoria: true,
    },
    orderBy: {
      data: 'desc', 
    },
  });
}

// FUNÇÃO DE FILTRAGEM
export const getFilteredEvents = async (filtros: any) => {
  const where: any = {};

  // Categoria
  if (filtros.categoria) {
    where.categoria = {
      nome: { contains: filtros.categoria, mode: "insensitive" },
    };
  }

  // Mês (range de datas)
  if (filtros.mes) {
    const year = new Date().getFullYear();
    const month = parseInt(filtros.mes);
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    where.data = {
      gte: new Date(`${year}-${String(month).padStart(2, "0")}-01T00:00:00Z`),
      lt: new Date(`${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00Z`),
    };
  }

  // Preço (gratuito/pago)
  if (filtros.preco === "gratuito") where.preco = 0;
  else if (filtros.preco === "pago") where.preco = { gt: 0 };

  // Busca por nome ou local
  if (filtros.busca) {
    where.OR = [
      { titulo: { contains: filtros.busca, mode: "insensitive" } },
      { local: { contains: filtros.busca, mode: "insensitive" } },
    ];
  }

  return prisma.evento.findMany({
    where,
    include: { categoria: true, imagemEvento: true },
    orderBy: { data: "asc" },
  });
};
