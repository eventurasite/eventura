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
    include: {
      imagemEvento: true,
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
    });
    return event;
  } catch (error: any) {
    throw new Error(`Erro ao buscar evento: ${error.message}`);
  }
};
