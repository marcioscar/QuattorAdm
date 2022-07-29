import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, useLoaderData } from "@remix-run/react";
import { Navbar } from "~/components/Navbar";
import { getDespesas } from "~/utils/despesas.server";
import { format } from "date-fns";
import type { tipoDesp } from "~/utils/types.server";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const despesas = await getDespesas();
  return json({ despesas });
};

export default function Despesas() {
  const { despesas } = useLoaderData();
  const [filtrar, setFiltrar] = useState("");
  const despesaFilter = despesas?.filter((despesas: { conta: string }) =>
    despesas.conta.toLowerCase().includes(filtrar.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <h1 className="flex  justify-center font-bold text-slate-500 text-xl">
        DESPESAS
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
          className=" flex mr-4  focus:outline-none text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:ring-yellow-300  rounded-lg text-sm px-5 py-2.5  mb-2 dark:focus:ring-yellow-900"
          to="new"
        >
          Nova
        </NavLink>
      </div>

      <div className="flex mt-4 justify-center ">
        <table className="w-3/4 text-sm text-left border-l-2 border-r-2 border-slate-100 text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-stone-100 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                Conta
              </th>
              <th scope="col" className="px-6 py-3">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Valor
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Editar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {despesaFilter.map((desp: tipoDesp) => (
              <tr
                key={desp.id}
                className="bg-white border-b  hover:bg-gray-50 "
              >
                <th
                  scope="row"
                  className="px-6  font-medium text-gray-900 whitespace-nowrap"
                >
                  {desp.conta}
                </th>
                <td className="px-6 py-3 ">{desp.referencia}</td>
                <td className="px-6  text-right">{desp.tipo}</td>
                <td className="px-6  text-right ">
                  {desp.valor.toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6  py-3 text-right">
                  <NavLink
                    to={`${desp.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.424 12.282l4.402 4.399-5.826 1.319 1.424-5.718zm15.576-6.748l-9.689 9.804-4.536-4.536 9.689-9.802 4.536 4.534zm-6 8.916v6.55h-16v-12h6.743l1.978-3h-10.721v16h20v-10.573l-2 2.023z" />
                    </svg>
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
