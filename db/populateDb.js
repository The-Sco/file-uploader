import prisma from "../lib/prisma.js";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.log("Please provide a database url inside your .env file");
  process.exit(1);
}

async function main() {
  console.log("Connecting to database and seeding fresh project...");

  try {
    console.log("Clearing old data...");
    await prisma.$transaction([
      prisma.file.deleteMany(),
      prisma.folder.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    console.log("Hashing passwords...");
    const hashedPassword1 = await bcrypt.hash("potter123", 10);
    const hashedPassword2 = await bcrypt.hash("granger123", 10);

    console.log("Inserting users along with their folders and nested files...");

    await prisma.user.create({
      data: {
        username: "harry_potter",
        password: hashedPassword1,
        folders: {
          create: {
            title: "Hogwarts Documents",
            files: {
              create: [
                {
                  name: "spells_list.png",
                  extension: "png",
                  trueExtension: "png",
                  link: "https://res.cloudinary.com/dbbpyppam/image/upload/v1781203089/plushie_store/bcxed1h2nberi2ca0i0t.png",
                  size: 2048576, // ~2 MB
                },
                {
                  name: "marauders_map_scan.png",
                  extension: "png",
                  trueExtension: "png",
                  link: "https://res.cloudinary.com/dbbpyppam/image/upload/v1781203089/plushie_store/bcxed1h2nberi2ca0i0t.png",
                  size: 5120000, // ~5 MB
                },
              ],
            },
          },
        },
      },
    });

    await prisma.user.create({
      data: {
        username: "hermione_g",
        password: hashedPassword2,
        folders: {
          create: {
            title: "Arithmancy Notes",
            files: {
              create: [
                {
                  name: "essay_draft_v1.png",
                  extension: "png",
                  trueExtension: "png",
                  link: "https://res.cloudinary.com/dbbpyppam/image/upload/v1781203089/plushie_store/bcxed1h2nberi2ca0i0t.png",
                  size: 102400, // ~100 KB
                },
              ],
            },
          },
        },
      },
    });

    console.log("Done! Project database successfully seeded with data.");
  } catch (err) {
    console.error("Error populating database:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
