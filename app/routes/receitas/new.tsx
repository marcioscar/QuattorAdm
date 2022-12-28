// app/routes/login.tsx

import { Navbar } from "~/components/Navbar";
import Cleave from "cleave.js/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createReceita } from "~/utils/receitas.server";
import { Form, Link, useNavigate, useTransition } from "@remix-run/react";
import Modal from "~/components/Modal";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  let values = Object.fromEntries(form);
  // @ts-ignore
  await createReceita(values);
  return redirect("/receitas");
};
export default function New() {
  const navigate = useNavigate();
  const transition = useTransition();
  function closeHandler() {
    navigate("..");
  }
  return (
    <Modal onClose={closeHandler}>
      {/* <Navbar /> */}
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <h2 className="text-2xl font-extrabold text-slate-700">
          Cadastro de Receitas
        </h2>

        <Form method="post" className="rounded-2xl bg-gray-200 p-6 w-96">
          <label htmlFor="conta" className="text-blue-600 font-semibold">
            Centro
          </label>
          <input
            type="text"
            id="centro"
            name="centro"
            className="w-full p-2 rounded-xl my-2"
          />
          <label htmlFor="valor" className="text-blue-600 font-semibold">
            Valor
          </label>
          <Cleave
            className="w-full p-2 rounded-xl my-2"
            placeholder="Valor"
            name="valor"
            options={{ numeral: true, numeralDecimalMark: ",", delimiter: "." }}
          />

          <label htmlFor="password" className="text-blue-600 font-semibold">
            Data
          </label>
          <input
            type="date"
            id="data"
            name="data"
            className="w-full p-2 rounded-xl my-2"
            defaultValue={new Date().toISOString().substring(0, 10)}
          />

          <div className="w-full space-x-4 text-center">
            <button
              type="submit"
              className="rounded-xl mt-2 bg-blue-500 text-white px-3 py-2 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
              value="Cadastrar"
            >
              {transition.state === "submitting"
                ? "Cadastrando..."
                : "Cadastrar"}
            </button>
            <Link to=".." className="rounded-xl mt-2 bg-yellow-500  px-3 py-2 ">
              Cancelar
            </Link>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
