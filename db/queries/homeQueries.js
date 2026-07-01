import prisma from "../../lib/prisma.js";

async function getFolders(userId) {
  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
    },
    include: {
      files: true,
    },
  });

  return folders;
}

async function getFiles(userId) {
  const files = await prisma.file.findMany({
    where: {
      folder: {
        userId: userId,
      },
    },
  });

  return files;
}

const homeDb = { getFolders, getFiles };

export default homeDb;
