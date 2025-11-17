// backend/src/services/eventService.ts
import { PrismaClient, Prisma, TipoUsuario } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Criar evento
 * (permissão garantida pelo middleware)
 */
export async function createEvent(data: {
  titulo: string;
  descricao: string;
  data: Date;
  local: string;
  preco: number;
  id_categoria: number;
  id_organizador: number;
  imagens: string[]; // URLs das imagens
  url_link_externo?: string;
}) {
  return prisma.evento.create({
    data: {
      titulo: data.titulo,
      descricao: data.descricao,
      data: data.data,
      local: data.local,
      preco: data.preco,
      id_categoria: data.id_categoria,
      id_organizador: data.id_organizador,
      url_link_externo: data.url_link_externo,

      imagemEvento: {
        create: data.imagens.map((url) => ({ url })),
      },
    },
    include: {
      imagemEvento: true,
    },
  });
}

/**
 * Categorias
 */
export function findAllCategories() {
  return prisma.categoria.findMany();
}

/**
 * Listar todos os eventos
 */
export function findAllEvents() {
  return prisma.evento.findMany({
    orderBy: { data_criacao: "desc" },
    include: {
      imagemEvento: true,
      categoria: true,
    },
  });
}

/**
 * Últimos 3 eventos
 */
export function findLatestEvents() {
  return prisma.evento.findMany({
    orderBy: { data_criacao: "desc" },
    take: 3,
    include: {
      imagemEvento: true,
    },
  });
}

/**
 * Buscar evento por ID
 */
export async function getEventById(id: number) {
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

  if (!event) return null;

  return {
    ...event,
    preco: Number(event.preco),
  };
}

/**
 * Eventos criados por um organizador
 */
export function findEventsByOrganizer(organizerId: number) {
  return prisma.evento.findMany({
    where: { id_organizador: organizerId },
    include: {
      imagemEvento: true,
      categoria: true,
    },
    orderBy: { data: "desc" },
  });
}

/**
 * Filtro avançado
 */
export async function getFilteredEvents(filtros: any) {
  const where: Prisma.EventoWhereInput = {};

  // Categoria
  if (filtros.categoria) {
    where.categoria = {
      nome: { contains: filtros.categoria, mode: "insensitive" },
    };
  }

  // Mês
  if (filtros.mes) {
    const year = new Date().getFullYear();
    const month = parseInt(filtros.mes);

    if (month >= 1 && month <= 12) {
      where.data = {
        gte: new Date(Date.UTC(year, month - 1, 1)),
        lt: new Date(Date.UTC(year, month, 1)),
      };
    }
  }

  // Preço
  if (filtros.preco === "gratuito") where.preco = 0;
  else if (filtros.preco === "pago") where.preco = { gt: 0 };

  // Busca geral
  if (filtros.busca) {
    where.OR = [
      { titulo: { contains: filtros.busca, mode: "insensitive" } },
      { local: { contains: filtros.busca, mode: "insensitive" } },
    ];
  }

  return prisma.evento.findMany({
    where,
    include: {
      categoria: true,
      imagemEvento: true,
    },
    orderBy: { data: "asc" },
  });
}

/**
 * Excluir um evento
 * (REGRA DE NEGÓCIO — owner ou admin podem excluir)
 */
export async function deleteEvent(
  eventId: number,
  userId: number,
  userType: TipoUsuario
) {
  const event = await prisma.evento.findUnique({
    where: { id_evento: eventId },
    select: { id_organizador: true },
  });

  if (!event) {
    throw new Error("NOT_FOUND");
  }

  const isOwner = event.id_organizador === userId;
  const isAdmin = userType === "administrador";

  if (!isOwner && !isAdmin) {
    throw new Error("FORBIDDEN");
  }

  await prisma.$transaction([
    prisma.comentario.deleteMany({ where: { id_evento: eventId } }),
    prisma.curtida.deleteMany({ where: { id_evento: eventId } }),
    prisma.denuncia.deleteMany({ where: { id_evento: eventId } }),
    prisma.interesse.deleteMany({ where: { id_evento: eventId } }),
    prisma.imagemEvento.deleteMany({ where: { id_evento: eventId } }),
    prisma.evento.delete({ where: { id_evento: eventId } }),
  ]);
}

/**
 * Atualizar evento
 * (permissão garantida pelo middleware)
 */
export async function updateEvent(
  eventId: number,
  userId: number,
  data: {
    titulo?: string;
    descricao?: string;
    data?: Date;
    local?: string;
    preco?: number;
    id_categoria?: number;
    url_link_externo?: string;
  }
) {
  const exists = await prisma.evento.findUnique({
    where: { id_evento: eventId },
  });

  if (!exists) {
    throw new Error("NOT_FOUND");
  }

  const updateData: Prisma.EventoUpdateInput = {};

  if (data.titulo) updateData.titulo = data.titulo;
  if (data.descricao) updateData.descricao = data.descricao;
  if (data.data) updateData.data = data.data;
  if (data.local) updateData.local = data.local;
  if (data.preco !== undefined) updateData.preco = data.preco;
  if (data.url_link_externo !== undefined) updateData.url_link_externo = data.url_link_externo;
  if (data.id_categoria !== undefined) {
    updateData.categoria = { connect: { id_categoria: data.id_categoria } };
  }

  const updated = await prisma.evento.update({
    where: { id_evento: eventId },
    data: updateData,
    include: {
      imagemEvento: true,
      categoria: true,
      organizador: {
        select: { id_usuario: true, nome: true },
      },
    },
  });

  return {
    ...updated,
    preco: Number(updated.preco),
  };
}

/**
 * Comentários
 */
export function getCommentsByEventId(eventId: number) {
  return prisma.comentario.findMany({
    where: { id_evento: eventId },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          nome: true,
          url_foto_perfil: true,
        },
      },
    },
    orderBy: { data_criacao: "asc" },
  });
}

export async function createComment(eventId: number, userId: number, texto: string) {
  if (!texto || texto.trim() === "") {
    throw new Error("O texto do comentário não pode estar vazio.");
  }

  return prisma.comentario.create({
    data: {
      id_evento: eventId,
      id_usuario: userId,
      texto,
    },
    include: {
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

/**
 * Excluir comentário
 * (REGRA DE NEGÓCIO — owner ou admin podem excluir)
 */
export async function deleteComment(
  commentId: number,
  userId: number,
  userType: TipoUsuario
) {
  const comment = await prisma.comentario.findUnique({
    where: { id_comentario: commentId },
  });

  if (!comment) {
    throw new Error("NOT_FOUND");
  }

  const isOwner = comment.id_usuario === userId;
  const isAdmin = userType === "administrador";

  if (!isOwner && !isAdmin) {
    throw new Error("FORBIDDEN");
  }

  await prisma.comentario.delete({
    where: { id_comentario: commentId },
  });

  return { message: "Comentário excluído com sucesso." };
}

/**
 * Curtidas
 */
export function getTotalLikes(eventId: number) {
  return prisma.curtida.count({
    where: { id_evento: eventId },
  });
}

export async function getUserLikeStatus(eventId: number, userId: number) {
  const like = await prisma.curtida.findUnique({
    where: {
      id_usuario_id_evento: { id_usuario: userId, id_evento: eventId },
    },
  });

  return { userHasLiked: !!like };
}

export async function toggleLike(eventId: number, userId: number) {
  const exists = await prisma.curtida.findUnique({
    where: {
      id_usuario_id_evento: { id_usuario: userId, id_evento: eventId },
    },
  });

  if (exists) {
    await prisma.curtida.delete({ where: { id_curtida: exists.id_curtida } });
  } else {
    await prisma.curtida.create({
      data: { id_evento: eventId, id_usuario: userId },
    });
  }

  const totalLikes = await getTotalLikes(eventId);

  return {
    totalLikes,
    userHasLiked: !exists,
  };
}

/**
 * Interesses
 */
export function getTotalInterests(eventId: number) {
  return prisma.interesse.count({
    where: { id_evento: eventId },
  });
}

export async function getUserInterestStatus(eventId: number, userId: number) {
  const interest = await prisma.interesse.findUnique({
    where: {
      id_evento_id_usuario: { id_evento: eventId, id_usuario: userId },
    },
  });

  return { userHasInterested: !!interest };
}

export async function toggleInteresse(eventId: number, userId: number) {
  const exists = await prisma.interesse.findUnique({
    where: {
      id_evento_id_usuario: { id_evento: eventId, id_usuario: userId },
    },
  });

  if (exists) {
    await prisma.interesse.delete({ where: { id_interesse: exists.id_interesse } });
  } else {
    await prisma.interesse.create({
      data: { id_evento: eventId, id_usuario: userId },
    });
  }

  const total = await getTotalInterests(eventId);

  return {
    totalInterests: total,
    userHasInterested: !exists,
  };
}

export async function buscarEventosPorInteresse(id_usuario: number) {
  const interesses = await prisma.interesse.findMany({
    where: { id_usuario },
    include: {
      evento: {
        include: {
          categoria: true,
          organizador: true,
          imagemEvento: true,
        },
      },
    },
  });

  return interesses.map(i => i.evento);
}

/**
 * Denúncias
 */
export function createDenounce(eventId: number, userId: number, motivo: string) {
  return prisma.denuncia.create({
    data: {
      id_evento: eventId,
      id_usuario: userId,
      motivo,
    },
  });
}

export function getAllPendingDenounces() {
  return prisma.denuncia.findMany({
    where: { status: "pendente" },
    include: {
      evento: {
        select: { id_evento: true, titulo: true, data: true, local: true },
      },
      usuario: {
        select: { id_usuario: true, nome: true, email: true },
      },
    },
    orderBy: { data_criacao: "asc" },
  });
}

export function updateDenounceStatus(
  denounceId: number,
  status: "revisada" | "rejeitada"
) {
  return prisma.denuncia.update({
    where: { id_denuncia: denounceId },
    data: { status },
  });
}

export function deleteDenounce(denounceId: number) {
  return prisma.denuncia.delete({
    where: { id_denuncia: denounceId },
  });
}
