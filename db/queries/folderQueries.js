import prisma from "../../lib/prisma.js";

async function getFolder(id) {
  const numberId = parseInt(id);
  const folder = await prisma.folder.findUnique({
    where: {
      id: numberId,
    },
    include: {
      files: true,
    },
  });

  return folder;
}

async function checkIfFolderExists(title, userId) {
  const folder = await prisma.folder.findFirst({
    where: {
      // AND: [{ title: title }, { userId: parseInt(userId) }],
      title: title,
      userId: parseInt(userId),
    },
  });
  return folder ? true : false;
}

async function createFolder(title, userId) {
  await prisma.folder.create({
    data: {
      title: title,
      userId: parseInt(userId),
    },
  });

  return;
}

async function deleteFolder(folderId, userId) {
  const intId = parseInt(folderId);
  const intUser = parseInt(userId);

  await prisma.file.deleteMany({
    where: {
      folder: {
        userId: intUser,
        id: intId,
      },
    },
  });

  await prisma.folder.delete({
    where: {
      id: intId,
      userId: intUser,
    },
  });

  return;
}

async function createShareFolder(folderId, expiresAt) {
  const res = await prisma.folderShare.createManyAndReturn({
    data: {
      folderId: parseInt(folderId),
      expiresAt: expiresAt,
    },
  });

  return res[0];
}

async function getShareFolder(shareId) {
  const res = await prisma.folderShare.findUnique({
    where: {
      id: shareId,
    },
    include: {
      folder: {
        include: {
          files: true,
        },
      },
    },
  });

  return res;
}

const folderDb = {
  getFolder,
  checkIfFolderExists,
  createFolder,
  deleteFolder,
  createShareFolder,
  getShareFolder,
};

export default folderDb;
