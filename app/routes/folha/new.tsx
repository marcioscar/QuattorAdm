import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useNavigate, useTransition } from "@remix-run/react";
import { Navbar } from "~/components/Navbar";
import { createFuncionario } from "~/utils/folha.server";
import Modal from "~/components/Modal";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  let values = Object.fromEntries(form);
  // @ts-ignore
  await createFuncionario(values);
  return redirect("/folha");
};
export default function New() {
  const navigate = useNavigate();
  const transition = useTransition();
  function closeHandler() {
    navigate("..");
  }
  return (
    <Modal onClose={closeHandler}>
      <div className="h-full justify-center items-center flex flex-col gap-y-4">
        <h2 className="text-2xl font-extrabold text-stone-700">
          Cadastro de Funcionários
        </h2>

        <Form method="post" className="rounded-2xl bg-stone-200 p-6 w-96">
          <label htmlFor="nome" className="text-blue-600 font-semibold">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            className="w-full p-2 rounded-xl my-2"
          />
          <label htmlFor="funcao" className="text-blue-600 font-semibold">
            Função
          </label>
          <select
            className="w-full p-2 rounded-xl my-2"
            name="funcao"
            // onChange={(event) => event.target.form}
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
            // onChange={(event) => event.target.form}
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
            className="w-full p-2 rounded-xl my-2"
          />

          <div className="w-full text-center space-x-4">
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
