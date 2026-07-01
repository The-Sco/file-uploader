import prisma from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

async function signUp(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.createManyAndReturn({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  return user[0];
}

async function checkIfUserExists(username) {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  return user ? true : false;
}

const authDb = { signUp, checkIfUserExists };

export default authDb;
