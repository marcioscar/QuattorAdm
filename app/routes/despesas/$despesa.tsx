import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

import { getDespesa, updateDespesa } from "~/utils/despesas.server";

import { Form, useTransition } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteDespesa } from "../../utils/despesas.server";
import Modal from "~/components/Modal";
import { RiCloseCircleFill } from "react-icons/ri";

export const loader: LoaderFunction = async ({ request, params }) => {
  const despesa = await getDespesa(params.despesa as string);
  console.log("Despesa:" + despesa?.valor);
  return json({ despesa });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  let values = Object.fromEntries(form);
  const action = form.get("_action");

  if (action === "save") {
    // @ts-ignore
    await updateDespesa(values);
  } else {
    // @ts-ignore
    await deleteDespesa(values);
  }

  return redirect("/despesas");
};

export default function Despesa() {
  const navigate = useNavigate();
  const transition = useTransition();
  function closeHandler() {
    navigate("..");
  }
  const { despesa } = useLoaderData();

  return (
    <Modal onClose={closeHandler}>
      {/* <Navbar /> */}
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-extrabold text-slate-700">
            Alterar de Despesas
          </h2>
          <Link to=".." className="">
            <RiCloseCircleFill className=" text-red-500  w-8 h-8 " />
          </Link>
        </div>

        <Form
          reloadDocument
          method="post"
          className="rounded-2xl bg-gray-200 p-6 w-96"
        >
          <input hidden type="text" name="id" defaultValue={despesa?.id} />
          <label htmlFor="conta" className="text-blue-600 font-semibold">
            Conta
          </label>
          <input
            type="text"
            id="conta"
            name="conta"
            defaultValue={despesa?.conta}
            className="w-full p-2 rounded-xl my-2"
          />
          <label htmlFor="valor" className="text-blue-600 font-semibold">
            Valor
          </label>
          <input
            className="w-full p-2 rounded-xl my-2"
            placeholder="Valor"
            name="valor"
            defaultValue={(despesa?.valor).toLocaleString()}
          />

          <label htmlFor="password" className="text-blue-600 font-semibold">
            Data
          </label>
          <input
            type="date"
            id="data"
            name="data"
            className="w-full p-2 rounded-xl my-2"
            defaultValue={new Date(despesa?.data)
              .toISOString()
              .substring(0, 10)}
          />
          <label htmlFor="tipo" className="text-blue-600 font-semibold">
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            defaultValue={despesa?.tipo}
            className="bg-gray-50 border p-2 my-2 border-gray-300 text-gray-900 mb-6  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="fixa">Fixa</option>
            <option value="variavel">Variável</option>
          </select>

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
