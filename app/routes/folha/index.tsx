import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Navbar } from "~/components/Navbar";
import { getFuncionarios } from "~/utils/folha.server";
import { Edit, Money } from "~/utils/icons";
import type { tipoFunc } from "~/utils/types.server";

export const loader: LoaderFunction = async ({ request }) => {
  const funcionarios = await getFuncionarios();
  return json({ funcionarios });
};

export default function Folha() {
  const { funcionarios } = useLoaderData();
  const [filtrar, setFiltrar] = useState("");
  const funcFilter = funcionarios?.filter((funcionarios: { nome: string }) =>
    funcionarios.nome.toLowerCase().includes(filtrar.toLowerCase())
  );
  return (
    <>
      <Navbar />
      <h1 className="flex  justify-center font-bold text-slate-500 text-xl">
        FOLHA DE PAGAMENTO
      </h1>
      <div className="flex justify-around items-center">
        <div className="relative w-1/4">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="search"
            value={filtrar}
            onChange={(e) => setFiltrar(e.target.value)}
            placeholder="Procurar"
            className="block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300  "
          />
        </div>

        <NavLink
          className=" flex mr-4  focus:outline-none text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-yellow-300  rounded-lg text-sm px-5 py-2.5  mb-2 dark:focus:ring-yellow-900"
          to="new"
        >
          Nova
        </NavLink>
      </div>

      <div className="bg-slate-100 flex justify-center ">
        <table className="w-3/4 mt-4 text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase  ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Função
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Modalidade
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Pago
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Editar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {funcFilter.map((func: tipoFunc) => (
              <tr
                key={func.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6  font-medium text-gray-900 dark:text-white whitespace-nowrap"
                >
                  {func.nome}
                </th>
                <td className="px-6 py-3 ">{func.funcao}</td>
                <td className="px-6 py-3 ">{func.modalidade}</td>
                <td className="px-6 py-3 text-center ">
                  <input
                    type="checkbox"
                    readOnly
                    checked={!!func.salarios.map((s) => s.pago).pop()}
                  ></input>
                </td>

                <td className="px-2 py-3 text-right">
                  <NavLink
                    to={`salario/${func.id}`}
                    className="font-medium text-green-600 dark:text-blue-500 hover:underline"
                  >
                    <Money />
                  </NavLink>
                </td>
                <td className="px-4  py-3 text-right">
                  <NavLink
                    to={`${func.id}`}
                    className="font-medium text-stone-500 "
                  >
                    <Edit />
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
