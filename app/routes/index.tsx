import { Navbar } from "~/components/Navbar";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getReceitas } from "~/utils/receitas.server";
import { useLoaderData } from "@remix-run/react";
import { getDespesas } from "../utils/despesas.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const receitas = await getReceitas();
  const despesas = await getDespesas();
  return json({ receitas, despesas });
};
export default function Index() {
  const { receitas } = useLoaderData();
  const { despesas } = useLoaderData();

  return (
    <>
      <Navbar />
      <div className="h-screen bg-slate-300 flex justify-center items-center">
        <h2 className="text-slate-800 font-extrabold text-3xl">
          Quattor Academia
        </h2>
      </div>
    </>
  );
}
