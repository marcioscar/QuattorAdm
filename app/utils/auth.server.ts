// @ts-nocheck
import { prisma } from "./prisma.server";
import { createCookieSessionStorage, redirect, json } from "@remix-run/node";
import { hash, compare } from "bcryptjs";

const SESSION_SECRET = process.env.SESSION_SECRET;
const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    maxAge: 20 * 24 * 24 * 60 * 60, //20 dias
    httpOnly: true,
  },
});

async function createUserSession(userId, redirectPath) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}
export async function destroyUserSession(request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/auth", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function requireUserSession(request) {
  const userId = await getUserFromSession(request);
  if (!userId) {
    throw redirect("/auth");
  }
}

export async function getUserFromSession(request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");
  if (!userId) {
    return null;
  }
  return userId;
}

export async function signup({ email, password }) {
  console.log(email, password);
  const usuarioExiste = await prisma.user.findFirst({ where: { email } });
  if (usuarioExiste) {
    const error = new Error("Usuário ja existe");
    error.status = 422;
    throw error;
  }
  const passwordHash = await hash(password, 12);
  console.log(passwordHash);
  const user = await prisma.user.create({
    data: { email: email, password: passwordHash },
  });
  return createUserSession(user.id, "/");
}

export async function login({ email, password }) {
  const usuarioExiste = await prisma.user.findFirst({ where: { email } });
  if (!usuarioExiste) {
    const errors = {};
    errors.email = "Nome ou senha Inválidos !!!";

    // const error = new Error("Usuário não existe");
    console.log(errors);

    return json(errors, { status: 401 });
  }
  const passwordCorrect = await compare(password, usuarioExiste.password);
  if (!passwordCorrect) {
    const errors = {};
    errors.email = "Nome ou senha Inválidos !!!";

    // const error = new Error("Usuário não existe");
    console.log(errors);

    return json(errors, { status: 401 });
  }
  console.log(usuarioExiste.id);
  return createUserSession(usuarioExiste.id, "/");
}
