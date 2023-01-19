import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Navbar } from "~/components/Navbar";
import type { tipoRec } from "~/utils/types.server";
// import { format } from "date-fns";
import { getReceitas } from "~/utils/receitas.server";
import { requireUserSession } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserSession(request);
  const receitas = await getReceitas();
  return json({ receitas });
};
export default function Receitas() {
  const { receitas } = useLoaderData();
  const [filtrar, setFiltrar] = useState("");
  const receitaFilter = receitas?.filter((receitas: { centro: string }) =>
    receitas.centro.toLowerCase().includes(filtrar.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <Outlet />
      <h1 className="flex  justify-center font-bold text-slate-500 text-xl">
        RECEITAS
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

      <div className="flex justify-center ">
        <table className="w-3/4 text-sm text-left mt-4 text-gray-500 border-l-2 border-r-2 border-slate-100">
          <thead className="text-xs text-gray-700 uppercase bg-stone-100 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Centro
              </th>
              <th scope="col" className="px-6 py-3">
                Referência
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
            {receitaFilter.map((rec: tipoRec) => (
              <tr
                key={rec.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6  font-medium text-gray-900 dark:text-white whitespace-nowrap"
                >
                  {rec.centro}
                </th>
                <td className="px-6 py-3 ">
                  {rec.referencia}
                  {/* {format(new Date(rec.data), "dd-MMM")} */}
                </td>

                <td className="px-6  text-right ">
                  {rec.valor.toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6  py-3 text-right">
                  <NavLink
                    to={`${rec.id}`}
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
