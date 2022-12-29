import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";
import { Navbar } from "~/components/Navbar";
import {
  getFuncionario,
  createSalario,
  deleteSalario,
  pagarSalario,
} from "~/utils/folha.server";
import { Pagar } from "~/utils/icons";
import { Delete } from "~/utils/icons";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  let values = Object.fromEntries(form);
  const action = form.get("_action");

  if (action === "cadastrar") {
    const salario = await createSalario(values);
    return redirect(`folha`);
    // return redirect(`folha/salario/${salario.id}`);
  } else if (action === "delete") {
    await deleteSalario(values);
    return redirect(`folha`);
  } else if (action === "pagar") {
    await pagarSalario(values);
    return redirect(`folha`);
  }
};
export const loader: LoaderFunction = async ({ request, params }) => {
  const funcionario = await getFuncionario(params.pagamento as string);
  return json({ funcionario });
};

export default function Pagamento() {
  const transition = useTransition();
  let isAdding = transition.state === "submitting";
  let formRef = useRef();
  const [salId, setSalId] = useState("");
  useEffect(() => {
    if (!isAdding) {
      // @ts-ignore
      formRef.current?.reset();
    }
  }, [isAdding]);
  const { funcionario } = useLoaderData();

  const PagFechado = funcionario.salarios.map((s: any) => s.pago).pop();
  console.log(!PagFechado);

  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="  p-6 bg-white border-b-2 border-stone-300 text-center">
          <h3 className="text-2xl font-bold">{funcionario.nome}</h3>
          <div className=" space-x-4">
            <span className="text-sm uppercase text-gray-500">
              {funcionario.funcao}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-sm uppercase text-gray-500">
              {funcionario.modalidade}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-sm uppercase text-gray-500">
              {funcionario.conta}
            </span>
          </div>
        </div>

        <Form
          // @ts-ignore
          ref={formRef}
          method="post"
          className=" bg-stone-100 p-6 container mt-4 mx-auto px-10"
        >
          <div className="grid gap-6 mb-2 ml-80 mr-80 ">
            <input
              hidden
              type="text"
              name="id"
              defaultValue={funcionario?.id}
            />
            <input hidden type="text" name="sal_id" defaultValue={salId} />
            {PagFechado && (
              <div className="">
                <label
                  htmlFor="valor"
                  className="block mb-2  text-sm font-medium text-gray-900 "
                >
                  Valor
                </label>
                <input
                  type="float"
                  className="w-full p-2 rounded-xl my-2"
                  placeholder="Valor"
                  name="valor"
                />
                <label
                  htmlFor="data"
                  className="block mb-2 text-sm font-medium  dark:text-gray-300"
                >
                  Data
                </label>
                <input
                  type="date"
                  id="data"
                  name="data"
                  className="w-full p-2 rounded-xl my-2 "
                />
                <div className="w-full text-right">
                  <button
                    type="submit"
                    className="rounded-xl  bg-blue-500 text-white px-3 py-2 font-semibold transition duration-300 ease-in-out hover:bg-blue-700 hover:-translate-y-1"
                    name="_action"
                    value="cadastrar"
                  >
                    {transition.state === "submitting"
                      ? "Cadastrando..."
                      : "Cadastrar"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className=" flex mt-2 justify-center ">
            <table className="w-3/4 text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase  ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Data
                  </th>
                  <th scope="col" className="px-6 text-right py-3">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left">
                    Referência
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Pago
                  </th>
                </tr>
              </thead>
              <tbody>
                {_.orderBy(funcionario.salarios, ["data"], ["desc"]).map(
                  (sal: any) => (
                    <tr
                      key={sal.sal_id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="px-6   font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      >
                        {format(new Date(sal.data), "dd-MMM", { locale: pt })}
                      </th>
                      <td className="px-6 py-3 text-right ">
                        {sal.valor.toLocaleString("pt-br", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-3 ">{sal.referencia}</td>

                      <td className=" py-3 text-center ">
                        <input
                          type="checkbox"
                          readOnly
                          checked={sal.pago}
                        ></input>
                      </td>
                      <td>
                        <button
                          className="text-orange-400 mr-2 "
                          type="submit"
                          name="_action"
                          value="pagar"
                          onClick={() => setSalId(sal.sal_id)}
                        >
                          <Pagar />
                        </button>
                      </td>
                      <td>
                        <button
                          className="text-red-500 mr-2 "
                          type="submit"
                          name="_action"
                          value="delete"
                          onClick={() => setSalId(sal.sal_id)}
                        >
                          <Delete />
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </Form>
      </div>
    </>
  );
}
