import prisma from "../../lib/prisma.js";

async function search(query, userId) {
  const res = await prisma.file.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { folder: { title: { contains: query, mode: "insensitive" } } },
      ],
      folder: {
        userId: parseInt(userId),
      },
    },
  });

  return res;
}

const searchDb = { search };

export default searchDb;
