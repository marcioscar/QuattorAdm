import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { Navbar } from "~/components/Navbar";
import { getReceita, updateReceita } from "~/utils/receitas.server";
import { Form, useTransition } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteReceita } from "../../utils/receitas.server";
import Modal from "~/components/Modal";

import { RiCloseCircleFill } from "react-icons/ri";

export const loader: LoaderFunction = async ({ request, params }) => {
  const receita = await getReceita(params.receita as string);
  return json({ receita });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  let values = Object.fromEntries(form);
  const action = form.get("_action");

  if (action === "save") {
    // @ts-ignore
    await updateReceita(values);
  } else {
    // @ts-ignore
    await deleteReceita(values);
  }

  return redirect("/receitas");
};

export default function Receita() {
  const navigate = useNavigate();
  const transition = useTransition();
  function closeHandler() {
    navigate("..");
  }
  const { receita } = useLoaderData();

  return (
    <Modal onClose={closeHandler}>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-extrabold text-slate-700">
            Alterar de Receita
          </h2>
          <Link to=".." className="">
            <RiCloseCircleFill className=" text-red-500  w-8 h-8 " />
          </Link>
        </div>

        <Form method="post" className="rounded-2xl bg-gray-200 p-6 w-96">
          <input hidden type="text" name="id" defaultValue={receita?.id} />
          <label htmlFor="conta" className="text-blue-600 font-semibold">
            Centro
          </label>
          <input
            type="text"
            id="centro"
            name="centro"
            defaultValue={receita?.centro}
            className="w-full p-2 rounded-xl my-2"
          />
          <label htmlFor="valor" className="text-blue-600 font-semibold">
            Valor
          </label>
          <input
            className="w-full p-2 rounded-xl my-2"
            placeholder="Valor"
            name="valor"
            defaultValue={(receita?.valor).toLocaleString()}
          />

          <label htmlFor="password" className="text-blue-600 font-semibold">
            Data
          </label>
          <input
            type="date"
            id="data"
            name="data"
            className="w-full p-2 rounded-xl my-2"
            defaultValue={new Date(receita?.data)
              .toISOString()
              .substring(0, 10)}
          />

          <div className="w-full text-center space-x-5">
            <button
              type="submit"
              className="rounded-xl mt-2 bg-blue-500 text-white px-3 py-2 font-semibold transition duration-300 ease-in-out hover:bg-blue-700 hover:-translate-y-1"
              name="_action"
              value="save"
            >
              {transition.state === "submitting"
                ? "Cadastrando..."
                : "Cadastrar"}
            </button>
            <button
              type="submit"
              className="rounded-xl mt-2 bg-red-500 text-white px-3 py-2 font-semibold transition duration-300 ease-in-out hover:bg-red-700 hover:-translate-y-1"
              name="_action"
              value="delete"
            >
              {transition.state === "submitting" ? "Apagando..." : "Apagar"}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
