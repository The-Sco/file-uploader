import express from "express";
import path from "path";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import passport from "passport";
import * as passport_local from "passport-local";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import errorHandler from "./middlewares/errorHandler.js";

import authRouter from "./routes/authRoute.js";
import homeRouter from "./routes/homeRoute.js";
import folderRoute from "./routes/folderRoute.js";
import fileRoute from "./routes/fileRoute.js";
import searchRoute from "./routes/searchRoute.js";

const app = express();
const port = 3000;
const pgSession = ConnectPgSimple(session);
const LocalStrategy = passport_local.Strategy;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
    }),
    secret: process.env.SESSION_SECRET || "your_brand_new_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return done(null, false, {
          username: { msg: "Incorrect username" },
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, {
          password: { msg: "Incorrect password" },
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        folders: {
          include: {
            files: true,
          },
        },
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.folders = req.user?.folders || [];
  next();
});

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.use("/auth", authRouter);
app.use("/home", homeRouter);
app.use("/folder", folderRoute);
app.use("/file", fileRoute);
app.use("/search", searchRoute);
app.use(errorHandler);
