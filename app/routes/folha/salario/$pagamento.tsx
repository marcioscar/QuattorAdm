import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useTransition } from "@remix-run/react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { useEffect, useRef } from "react";
import { Navbar } from "~/components/Navbar";
import { getFuncionario, createSalario } from "~/utils/folha.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  let values = Object.fromEntries(form);

  // @ts-ignore
  const salario = await createSalario(values);
  console.log(salario);
  return redirect(`folha/salario/${salario.id}`);
};
export const loader: LoaderFunction = async ({ request, params }) => {
  const funcionario = await getFuncionario(params.pagamento as string);
  return json({ funcionario });
};

export default function Pagamento() {
  const transition = useTransition();
  let isAdding = transition.state === "submitting";
  let formRef = useRef();
  useEffect(() => {
    if (!isAdding) {
      // @ts-ignore
      formRef.current?.reset();
    }
  }, [isAdding]);
  const { funcionario } = useLoaderData();

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
          className=" bg-stone-200 p-6 container mt-4 mx-auto px-10"
        >
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <input
              hidden
              type="text"
              name="id"
              defaultValue={funcionario?.id}
            />
            <div>
              <label
                htmlFor="valor"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Valor
              </label>
              <input
                type="float"
                className="w-full p-2 rounded-xl my-2"
                placeholder="Valor"
                name="valor"
              />
            </div>
            <div>
              <label
                htmlFor="data"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Data
              </label>
              <input
                type="date"
                id="data"
                name="data"
                className="w-full p-2 rounded-xl my-2"
                placeholder="Data"
                required
              />
            </div>
          </div>
          <div className="w-full text-center">
            <button
              type="submit"
              className="rounded-xl mt-2 bg-blue-500 text-white px-3 py-2 font-semibold transition duration-300 ease-in-out hover:bg-blue-700 hover:-translate-y-1"
              value="Cadastrar"
            >
              {transition.state === "submitting"
                ? "Cadastrando..."
                : "Cadastrar"}
            </button>
          </div>
        </Form>

        <div className=" flex mt-2 justify-center ">
          <table className="w-3/4 text-sm text-left text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
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
              {funcionario.salarios.map((sal: any) => (
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
                  <td className="px-6 py-3 text-center ">
                    <input type="checkbox" readOnly checked={sal.pago}></input>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
