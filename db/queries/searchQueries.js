import prisma from "../../lib/prisma.js";

async function search(query) {
  const res = await prisma.file.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { folder: { title: { contains: query, mode: "insensitive" } } },
      ],
    },
  });

  return res;
}

const searchDb = { search };

export default searchDb;
