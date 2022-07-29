import { Navbar } from "~/components/Navbar";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { groupReceitasAgrupadas, ReceitasMes } from "~/utils/receitas.server";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { totDespesas, DespesasMes } from "../utils/despesas.server";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import type { tipoRec, tipoDesp } from "~/utils/types.server";
import { Arrow } from "~/utils/icons";
import { Load } from "../utils/icons";
import { groupSalario, groupSalarioAreas } from "~/utils/folha.server";
import _ from "lodash";

export const loader: LoaderFunction = async ({ request, params }) => {
  const dataAtual = format(new Date(), "MMM-yyyy", { locale: pt });
  const url = new URL(request.url);
  const parametro = url.searchParams.get("rec");

  if (parametro) {
    const totReceitas = await groupReceitasAgrupadas(String(parametro));
    const ReceitasM = await ReceitasMes(String(parametro));
    const DespesasM = await DespesasMes(String(parametro));
    const TotDespesas = await totDespesas(String(parametro));
    const TotSalarios = await groupSalario();
    const TotSalMes = _.filter(TotSalarios, ["_id", parametro]);
    const salAreas = await groupSalarioAreas(parametro);

    return json({
      totReceitas,
      TotDespesas,
      ReceitasM,
      DespesasM,
      TotSalarios,
      TotSalMes,
      salAreas,
    });
  } else {
    const totReceitas = await groupReceitasAgrupadas(dataAtual);
    const ReceitasM = await ReceitasMes(dataAtual);
    const TotDespesas = await totDespesas(dataAtual);
    const DespesasM = await DespesasMes(dataAtual);
    const TotSalarios = await groupSalario();
    const TotSalMes = _.filter(TotSalarios, ["_id", dataAtual]);
    const salAreas = await groupSalarioAreas(dataAtual);
    console.log(salAreas);

    return json({
      totReceitas,
      TotDespesas,
      ReceitasM,
      DespesasM,
      TotSalarios,
      TotSalMes,
      salAreas,
    });
  }
};

export default function Index() {
  const rec = useFetcher();
  const {
    totReceitas,
    ReceitasM,
    TotDespesas,
    DespesasM,
    TotSalarios,
    TotSalMes,
    salAreas,
  } = useLoaderData();
  const totalRec = rec.data?.totReceitas ? rec.data.totReceitas : totReceitas;
  const recMes = rec.data?.ReceitasM ? rec.data.ReceitasM : ReceitasM;
  const totalDesp = rec.data?.TotDespesas ? rec.data.TotDespesas : TotDespesas;
  const despMes = rec.data?.DespesasM ? rec.data.DespesasM : DespesasM;
  const TotSalarioMes = rec.data?.TotSalMes ? rec.data.TotSalMes : TotSalMes;
  const TotSalAreas = rec.data?.salAreas ? rec.data.salAreas : salAreas;

  console.log(TotSalAreas);
  const capitalize = (str: string) => {
    if (typeof str !== "string") {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.substr(1);
  };
  return (
    <>
      <Navbar />

      <rec.Form method="get" action=".">
        <div className="flex justify-center items-center">
          <label
            className="mr-4 font-light text-slate-500  text-sm "
            htmlFor="rec"
          >
            MÊS E ANO DE REFERÊNCIA
          </label>
          {rec.state === "submitting" ? <Load /> : null}
          <Arrow />
          <select
            className="rounded text-blue-600 h-8  pl-5 pr-10 hover:border-gray-400 focus:outline-none "
            name="rec"
            defaultValue={format(new Date(), "MMM-yyyy", { locale: pt })}
            onChange={(event) => rec.submit(event.target.form)}
          >
            <option hidden={true} value="">
              Selecione mês e ano referencia
            </option>
            <option value="jan-2023">Janeiro - 2023</option>
            <option value="fev-2023">Fevereiro - 2023</option>
            <option value="mar-2023">Março - 2023</option>
            <option value="abr-2023">Abril - 2023</option>
            <option value="mai-2023">Maio - 2023</option>
            <option value="jun-2023">Junho - 2023</option>
            <option value="jul-2022">Julho - 2022</option>
            <option value="ago-2022">Agosto - 2022</option>
            <option value="set-2022">Setembro - 2022</option>
            <option value="out-2022">Outubro - 2022</option>
            <option value="nov-2022">Novembro - 2022</option>
            <option value="dez-2022">Dezembro - 2022</option>
          </select>
        </div>
      </rec.Form>
      <div className="flex justify-center space-x-10 m-4 flex-wrap">
        <div className=" ">
          <div className="mt-4 p-4 max-w-sm bg-stone-100 rounded-lg border shadow-md ">
            <div className="flex justify-between">
              <div className="text-blue-500  font-semibold">Receitas</div>
              <div className="text-blue-500 font-sm ">
                Total:{" "}
                {totalRec._sum.valor?.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="border-t mt-2">
              <div className="overflow-y-auto  max-h-56 relative">
                <table className="text-sm  text-left text-slate-500 ">
                  <tbody>
                    {recMes?.map((rec: tipoRec) => (
                      <tr key={rec.id} className="bg-white border-b ">
                        <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                          {rec.centro}
                        </th>
                        <td className="py-2 px-6 font-mono text-right">
                          {rec.valor.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className=" ">
          <div className="mt-4 p-4 max-w-sm bg-stone-100  rounded-lg border shadow-md ">
            <div className="flex justify-between">
              <div className="text-orange-500  font-semibold">Despesas</div>
              <div className="text-orange-500 font-sm ">
                Total:{" "}
                {totalDesp._sum.valor?.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="border-t mt-2">
              <div className="overflow-y-auto  max-h-56 relative">
                <table className="text-sm text-left text-slate-500 ">
                  <tbody>
                    {despMes?.map((desp: tipoDesp) => (
                      <tr key={desp.id} className="bg-white border-b ">
                        <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                          {desp.conta}
                        </th>
                        <td className="py-2 px-6 font-mono text-right">
                          {desp.valor.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className=" ">
          <div className="mt-4 p-4 max-w-sm bg-stone-100 rounded-lg border shadow-md ">
            <div className="flex justify-between">
              <div className="text-green-500  font-semibold">Salários</div>
              <div className="text-green-500 font-sm ">
                Total:{" "}
                {TotSalarioMes.map(
                  (t: { salario: any }) => t.salario
                ).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="border-t mt-2">
              <div className="overflow-y-auto  max-h-56 relative">
                <table className="text-sm text-left text-slate-500 ">
                  <tbody>
                    {TotSalAreas?.map((sal: any) => (
                      <tr key={sal.mod} className="bg-white border-b ">
                        <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                          {capitalize(sal.mod)}
                        </th>
                        <td className="py-2 px-6  font-mono text-right">
                          {sal.valor.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
