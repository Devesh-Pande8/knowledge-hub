import { prisma } from "@/lib/prisma";

export const createKnowledgeItem = async ({
  title,
  content,
  tags,
  fileUrl,
  userId,
}: {
  title: string;
  content: string;
  tags?: string[];
  fileUrl?: string;
  userId: string;
}) => {
  return prisma.knowledgeItem.create({
    data: {
      title,
      content,
      fileUrl,
      userId,
      tags: {
        create: tags?.map((tag) => ({
          tag: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag },
            },
          },
        })) ?? [],
      },
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

export const getKnowledgeItems = async ({
  userId,
  page = 1,
  limit = 10,
  search = "",
  tag,
}: {
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
}) => {
  const skip = (page - 1) * limit;

const filter: any = {
  userId,
}

  if (search) {
    filter.AND = [
      ...(filter.AND ?? []),
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (tag) {
    filter.AND = [
      ...(filter.AND ?? []),
      {
        tags: {
          some: {
            tag: {
              name: tag,
            },
          },
        },
      },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.knowledgeItem.findMany({
      skip,
      take: limit,
      where: filter,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.knowledgeItem.count({
      where: filter,
    }),
  ]);

  return {
    items,
    total,
    page,
    limit,
  };
};

export const getKnowledgeItemById = async (
  id: string,
  userId: string
) => {
  return prisma.knowledgeItem.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

export const updateKnowledgeItem = async (
  id: string,
  userId: string,
  data: {
    title: string;
    content: string;
    tags?: string[];
    fileUrl?: string;
  }
) => {
  const item = await prisma.knowledgeItem.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!item) {
    throw new Error("Knowledge item not found");
  }

  return prisma.knowledgeItem.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      fileUrl: data.fileUrl,
      tags: {
        deleteMany: {},
        create:
          data.tags?.map((tag) => ({
            tag: {
              connectOrCreate: {
                where: { name: tag },
                create: { name: tag },
              },
            },
          })) ?? [],
      },
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
};

export const deleteKnowledgeItem = async (
  id: string,
  userId: string
) => {
  const item = await prisma.knowledgeItem.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!item) {
    throw new Error("Knowledge item not found");
  }

  await prisma.knowledgeTag.deleteMany({
    where: {
      knowledgeItemId: id,
    },
  });

  return prisma.knowledgeItem.delete({
    where: { id },
  });
};

export const getTags = async () => {
  return prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });
};