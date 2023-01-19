// @ts-nocheck
import { json } from "@remix-run/node";
import { destroyUserSession } from "~/utils/auth.server";
export function action({ request }) {
  if (request.method !== "POST") {
    throw json({ message: "Método Inválido" }, { status: 400 });
  }

  return destroyUserSession(request);
}
