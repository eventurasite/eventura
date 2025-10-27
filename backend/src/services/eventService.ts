// backend/src/services/eventService.ts
import { Evento, PrismaClient, Prisma } from "@prisma/client"; // Importar Prisma

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
      preco, // Prisma aceita number aqui
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
    orderBy: {
      data_criacao: "desc",
    },
    include: {
      imagemEvento: true,
      categoria: true,
    },
  });
}

/**
 * Listar os 3 eventos mais recentes
 */
export async function findLatestEvents() {
  return prisma.evento.findMany({
    orderBy: {
      data_criacao: "desc",
    },
    take: 3,
    include: {
      imagemEvento: true,
    },
  });
}

/**
 * Buscar evento por ID
 */
export const getEventById = async (id: number): Promise<Evento | null> => {
  try {
    const event = await prisma.evento.findUnique({
      where: { id_evento: id },
      include: {
        imagemEvento: true,
        categoria: true,
        organizador: {
          select: {
            id_usuario: true,
            nome: true,
          },
        },
      },
    });
    // Retorna o evento completo (com tipo Decimal para preco)
    // @ts-ignore Prisma retorna Decimal, mas para compatibilidade JS podemos converter se necessário
    return event ? { ...event, preco: event.preco ? Number(event.preco) : 0 } : null;
    // Ou apenas: return event; se o frontend não precisar de number
     // return event; // <- Mantenha assim se o frontend já lida com Decimal (ou string)
  } catch (error: any) {
    throw new Error(`Erro ao buscar evento: ${error.message}`);
  }
};


/**
 * Buscar eventos por organizador
 */
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

/**
 * Filtrar Eventos
 */
export const getFilteredEvents = async (filtros: any) => {
  const where: Prisma.EventoWhereInput = {}; // Usar tipo Prisma para melhor autocompletar

  // Categoria
  if (filtros.categoria) {
    where.categoria = {
      nome: { contains: filtros.categoria, mode: "insensitive" },
    };
  }

  // Mês (range de datas)
  if (filtros.mes) {
    const year = new Date().getFullYear(); // Considerar eventos de anos futuros?
    const month = parseInt(filtros.mes);
    if (!isNaN(month) && month >= 1 && month <= 12) {
        const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)); // Mês é 0-indexed
        const endDate = new Date(Date.UTC(year, month, 1, 0, 0, 0)); // Início do próximo mês

        where.data = {
          gte: startDate,
          lt: endDate,
        };
    }
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


/**
 * Excluir um evento, verificando a propriedade.
 */
export async function deleteEvent(eventId: number, userId: number): Promise<void> {
  // 1. Busca o evento para verificar o proprietário
  const event = await prisma.evento.findUnique({
    where: { id_evento: eventId },
    select: { id_organizador: true },
  });

  // 2. Verifica se o evento existe
  if (!event) {
    throw new Error('NOT_FOUND');
  }

  // 3. Verifica se o usuário logado é o organizador
  if (event.id_organizador !== userId) {
    throw new Error('FORBIDDEN');
  }

  // 4. Exclui o evento e suas imagens relacionadas (em uma transação)
  try {
    await prisma.$transaction([
      prisma.imagemEvento.deleteMany({
        where: { id_evento: eventId },
      }),
      // Adicione aqui a exclusão de outros dados relacionados se necessário (Comentarios, Curtidas, Denuncias, Inscricoes)
      // prisma.comentario.deleteMany({ where: { id_evento: eventId } }),
      // prisma.curtida.deleteMany({ where: { id_evento: eventId } }),
      // prisma.denuncia.deleteMany({ where: { id_evento: eventId } }),
      // prisma.inscricao.deleteMany({ where: { id_evento: eventId } }),

      prisma.evento.delete({ // Deleta o evento principal por último
        where: { id_evento: eventId },
      }),
    ]);
  } catch (dbError: any) {
    console.error("Erro na transação de exclusão:", dbError);
    throw new Error("Erro no banco de dados ao tentar excluir o evento.");
  }
}

/**
 * Atualizar um evento existente, verificando propriedade.
 */
export async function updateEvent(
  eventId: number,
  userId: number,
  data: { // Define o tipo de 'data' explicitamente aqui
    titulo?: string;
    descricao?: string;
    data?: Date;
    local?: string;
    preco?: number; // Aceita number | undefined
    id_categoria?: number;
  }
) {
  // 1. Busca o evento para verificar o proprietário
  const event = await prisma.evento.findUnique({
    where: { id_evento: eventId },
    select: { id_organizador: true },
  });

  // 2. Verifica se o evento existe
  if (!event) {
    throw new Error('NOT_FOUND');
  }

  // 3. Verifica se o usuário logado é o organizador
  if (event.id_organizador !== userId) {
    throw new Error('FORBIDDEN');
  }

  // 4. Validação básica
  if (!data.titulo && !data.descricao && !data.data && !data.local && data.preco === undefined && !data.id_categoria) {
      throw new Error('BAD_REQUEST');
  }

  // 5. Atualiza o evento no banco de dados
  try {
    // Cria um objeto de dados limpo apenas com os campos fornecidos
    const dataToUpdate: Prisma.EventoUpdateInput = {};
    if (data.titulo !== undefined) dataToUpdate.titulo = data.titulo;
    if (data.descricao !== undefined) dataToUpdate.descricao = data.descricao;
    if (data.data !== undefined) dataToUpdate.data = data.data;
    if (data.local !== undefined) dataToUpdate.local = data.local;
    if (data.preco !== undefined) dataToUpdate.preco = data.preco; // Passa 'number' diretamente
    if (data.id_categoria !== undefined) {
         // Precisa conectar a categoria pelo ID
        dataToUpdate.categoria = { connect: { id_categoria: data.id_categoria } };
    }


    const eventoAtualizado = await prisma.evento.update({
      where: { id_evento: eventId },
      data: dataToUpdate, // Usa o objeto limpo
      include: { // Mantém a inclusão de dados relacionados
        imagemEvento: true,
        categoria: true,
        organizador: { select: { id_usuario: true, nome: true } },
      },
    });
    // @ts-ignore Converte o Decimal retornado para number antes de enviar ao frontend, se necessário
    return eventoAtualizado ? { ...eventoAtualizado, preco: eventoAtualizado.preco ? Number(eventoAtualizado.preco) : 0 } : null;
     // Ou apenas: return eventoAtualizado; se o frontend lida com Decimal

  } catch (dbError: any) {
    console.error("Erro no DB ao atualizar evento:", dbError);
    if (dbError instanceof Prisma.PrismaClientValidationError) {
        console.error("Erro de validação do Prisma:", dbError.message);
        throw new Error('BAD_REQUEST');
    }
    throw new Error("Erro no banco de dados ao tentar atualizar o evento.");
  }
}

/**
 * Buscar todos os comentários de um evento
 */
export async function getCommentsByEventId(eventId: number) {
  return prisma.comentario.findMany({
    where: { id_evento: eventId },
    include: {
      // Incluímos o 'usuario' para sabermos quem comentou
      usuario: {
        select: {
          id_usuario: true,
          nome: true,
          url_foto_perfil: true, // Se quisermos exibir a foto no futuro
        },
      },
    },
    orderBy: {
      data_criacao: 'asc', // Do mais antigo para o mais novo
    },
  });
}

/**
 * Criar um novo comentário
 */
export async function createComment(
  eventId: number,
  userId: number,
  texto: string
) {
  if (!texto || texto.trim() === "") {
    throw new Error("O texto do comentário não pode estar vazio.");
  }

  return prisma.comentario.create({
    data: {
      id_evento: eventId,
      id_usuario: userId,
      texto: texto,
    },
    include: {
      // Retorna o comentário criado com os dados do usuário
      usuario: {
        select: {
          id_usuario: true,
          nome: true,
          url_foto_perfil: true,
        },
      },
    },
  });
}