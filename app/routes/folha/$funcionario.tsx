import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useTransition,
} from "@remix-run/react";
import { Navbar } from "~/components/Navbar";
import Modal from "~/components/Modal";
import {
  getFuncionario,
  updateFuncionario,
  deleteFuncionario,
} from "~/utils/folha.server";
import { RiCloseCircleFill } from "react-icons/ri";

export const loader: LoaderFunction = async ({ request, params }) => {
  const funcionario = await getFuncionario(params.funcionario as string);
  return json({ funcionario });
};
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  let values = Object.fromEntries(form);
  const action = form.get("_action");

  if (action === "save") {
    // @ts-ignore
    await updateFuncionario(values);
  } else {
    // @ts-ignore
    await deleteFuncionario(values);
  }

  return redirect("/folha");
};
export default function Receita() {
  const navigate = useNavigate();
  const transition = useTransition();
  function closeHandler() {
    navigate("..");
  }
  const { funcionario } = useLoaderData();
  return (
    <Modal onClose={closeHandler}>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-extrabold text-slate-700">
            Funcionario
          </h2>
          <Link to=".." className="">
            <RiCloseCircleFill className=" text-red-500  w-8 h-8 " />
          </Link>
        </div>
        <Form method="post" className="rounded-2xl bg-stone-200 p-6 w-96">
          <input hidden type="text" name="id" defaultValue={funcionario?.id} />
          <label htmlFor="nome" className="text-blue-600 font-semibold">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            className="w-full p-2 rounded-xl my-2"
            defaultValue={funcionario?.nome}
          />
          <label htmlFor="funcao" className="text-blue-600 font-semibold">
            Função
          </label>
          <select
            className="w-full p-2 rounded-xl my-2"
            name="funcao"
            defaultValue={funcionario?.funcao}
            id="funcao"
          >
            <option hidden={true}>Selecione a Função</option>
            <option value="contrato">Contrato</option>
            <option value="adm">Administrativo</option>
            <option value="coordenador">Coordenador</option>
            <option value="estagiario">Estagiário</option>
            <option value="professor">Professor</option>
          </select>
          <label htmlFor="modalidade" className="text-blue-600 font-semibold">
            Modalidade
          </label>
          <select
            className="w-full p-2 rounded-xl my-2"
            name="modalidade"
            defaultValue={funcionario?.modalidade}
            id="modalidade"
          >
            <option hidden={true}>Selecione a Modalidade</option>
            <option value="judo">Judô</option>
            <option value="musculacao">Musculação</option>
            <option value="pilates">Pilates</option>
            <option value="natacao">Natação</option>
            <option value="ballet">Ballet</option>
            <option value="aulas">Aulas</option>
            <option value="geral">Geral</option>
            <option value="boxe">Boxe</option>
            <option value="muaithay">Muaithay</option>
            <option value="prime">Prime</option>
          </select>

          <label htmlFor="conta" className="text-blue-600 font-semibold">
            Conta
          </label>
          <input
            placeholder="PIX, CC, C. Salario"
            type="string"
            id="conta"
            name="conta"
            defaultValue={funcionario?.conta}
            className="w-full p-2 rounded-xl my-2"
          />

          <div className="w-full text-center space-x-5">
            <button
              type="submit"
              className="rounded-xl mt-2 bg-blue-500 text-white px-3 py-2 font-semibold transition duration-300 ease-in-out hover:bg-blue-700 hover:-translate-y-1"
              name="_action"
              value="save"
            >
              {transition.state === "submitting" ? "Salvando..." : "Salvar"}
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
