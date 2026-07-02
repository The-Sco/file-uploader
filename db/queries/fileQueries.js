import prisma from "../../lib/prisma.js";

async function uploadFile(
  name,
  link,
  extension,
  trueExtension,
  size,
  folderId,
) {
  await prisma.file.create({
    data: {
      name,
      link,
      extension,
      trueExtension,
      size,
      folderId,
    },
  });

  return;
}

async function getFile(id) {
  const file = await prisma.file.findFirst({
    where: {
      id: parseInt(id),
    },
    include: {
      folder: true,
    },
  });

  return file;
}

async function deleteFile(fileId) {
  await prisma.file.delete({
    where: {
      id: parseInt(fileId),
    },
  });

  return;
}

const fileDb = { uploadFile, getFile, deleteFile };

export default fileDb;
