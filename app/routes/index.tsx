import { Navbar } from "~/components/Navbar";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { groupReceitasAgrupadas, ReceitasMes } from "~/utils/receitas.server";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  totDespesas,
  DespesasMes,
  totTipoDespesas,
} from "../utils/despesas.server";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import type { tipoRec, tipoDesp } from "~/utils/types.server";
import { Arrow } from "~/utils/icons";
import { Load } from "../utils/icons";
import {
  groupSalario,
  groupSalarioAreas,
  SalarioAreas,
} from "~/utils/folha.server";
import _ from "lodash";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

export const loader: LoaderFunction = async ({ request, params }) => {
  const dataAtual = format(new Date(), "MMM-yyyy", { locale: pt });
  const url = new URL(request.url);
  const par = url.searchParams.get("rec");
  const parametro = par ? par : dataAtual;

  const totReceitas = await groupReceitasAgrupadas(String(parametro));
  const ReceitasM = await ReceitasMes(String(parametro));
  const DespesasM = await DespesasMes(String(parametro));
  const TotDespesas = await totDespesas(String(parametro));
  const TotSalarios = await groupSalario();
  const TotSalMes = _.filter(TotSalarios, ["_id", parametro]);
  const salAreas = await groupSalarioAreas(parametro);
  const totTipoDesp = await totTipoDespesas(parametro);
  const areas = await SalarioAreas();

  return json({
    totReceitas,
    TotDespesas,
    ReceitasM,
    DespesasM,
    TotSalarios,
    TotSalMes,
    salAreas,
    totTipoDesp,
    areas,
  });
};

export default function Index() {
  const rec = useFetcher();
  const {
    totReceitas,
    TotSalarios,
    ReceitasM,
    TotDespesas,
    DespesasM,
    TotSalMes,
    salAreas,
    areas,
  } = useLoaderData();
  const totalRec = rec.data?.totReceitas ? rec.data.totReceitas : totReceitas;
  const recMes = rec.data?.ReceitasM ? rec.data.ReceitasM : ReceitasM;
  const totalDesp = rec.data?.TotDespesas ? rec.data.TotDespesas : TotDespesas;
  const despMes = rec.data?.DespesasM ? rec.data.DespesasM : DespesasM;
  const TotSalarioMes = rec.data?.TotSalMes ? rec.data.TotSalMes : TotSalMes;
  const TotSalAreas = rec.data?.salAreas ? rec.data.salAreas : salAreas;

  const DespesasFixas = _.filter(despMes, ["tipo", "fixa"]);
  const DespesasVariaveis = _.filter(despMes, ["tipo", "variavel"]);
  const DespesasFixasTotal = _.sumBy(
    _.filter(despMes, ["tipo", "fixa"]),
    "valor"
  );
  const DespesasVariavelTotal = _.sumBy(
    _.filter(despMes, ["tipo", "variavel"]),
    "valor"
  );

  const SalDiretos = _.sumBy(
    _.filter(TotSalAreas, function (o) {
      return o.mod != "geral";
    }),
    "valor"
  );

  const PercentFixa = (
    (SalDiretos + DespesasFixasTotal) /
    totalRec._sum.valor
  ).toLocaleString("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
  });

  const PercentVariavel = (
    DespesasVariavelTotal / totalRec._sum.valor
  ).toLocaleString("pt-BR", {
    style: "percent",
    minimumFractionDigits: 2,
  });
  const Mensalidade = (SalDiretos + DespesasFixasTotal) / 1100;

  const Mensalidade6 =
    Mensalidade * (1 + DespesasVariavelTotal / totalRec._sum.valor) * 1.06;

  const previsao =
    Mensalidade *
    (1 + DespesasVariavelTotal / totalRec._sum.valor) *
    1.06 *
    1100;

  const Lucro =
    previsao -
    previsao * (DespesasVariavelTotal / totalRec._sum.valor) -
    DespesasFixasTotal -
    SalDiretos;

  const PontoEquilibrio =
    (DespesasFixasTotal + SalDiretos) / 1 -
    DespesasVariavelTotal / totalRec._sum.valor;

  const PontoEquilibrioQtd = PontoEquilibrio / Mensalidade6;
  const capitalize = (str: string) => {
    if (typeof str !== "string") {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.substr(1);
  };

  const TotalSalariosMes = TotSalarios.map((o: any) =>
    Object.assign(
      {},
      o,
      o._id === "jan-2023" && { mes: 1 },
      o._id === "fev-2023" && { mes: 2 },
      o._id === "mar-2023" && { mes: 3 },
      o._id === "abr-2023" && { mes: 4 },
      o._id === "mai-2023" && { mes: 5 },
      o._id === "jun-2023" && { mes: 6 },
      o._id === "jul-2023" && { mes: 7 },
      o._id === "ago-2023" && { mes: 8 },
      o._id === "set-2023" && { mes: 9 },
      o._id === "out-2023" && { mes: 10 },
      o._id === "nov-2023" && { mes: 11 },
      o._id === "dez-2023" && { mes: 12 }
    )
  );
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const optionsLine = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Total de Salários",
      },
    },
  };

  const optionsBar = {
    plugins: {
      title: {
        display: true,
        text: "Chart.js Bar Chart - Stacked",
      },
    },
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  const labels = _.orderBy(TotalSalariosMes, "mes").map((dt: any) => dt._id);

  const data = {
    labels,
    datasets: [
      {
        label: "Salários",
        data: _.orderBy(TotalSalariosMes, "mes").map((sal: any) => sal.salario),
        borderColor: "rgb(240, 96, 57)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      // {
      //   label: "Dataset 2",
      //   data: [1, 4, 44, 56, 33, 90, 56],
      //   borderColor: "rgb(53, 162, 235)",
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      // },
    ],
  };

  const dataBar = {
    labels,
    datasets: [
      {
        label: "Musculação",
        data: _.filter(areas, ["_id[1]", "musculacao"]).map(
          (m: any) => m.salario
        ),
        backgroundColor: "#293462",
        stack: "Stack 0",
      },
      {
        label: "Prime",
        data: _.filter(areas, ["_id[1]", "prime"]).map((m: any) => m.salario),
        backgroundColor: "#1CD6CE",
        stack: "Stack 0",
      },
      {
        label: "Geral",
        data: _.filter(areas, ["_id[1]", "geral"]).map((m: any) => m.salario),
        backgroundColor: "#FEDB39",
        stack: "Stack 0",
      },
      {
        label: "Judô",
        data: _.filter(areas, ["_id[1]", "judo"]).map((m: any) => m.salario),
        backgroundColor: "#D61C4E",
        stack: "Stack 0",
      },
      {
        label: "Pilates",
        data: _.filter(areas, ["_id[1]", "pilates"]).map((m: any) => m.salario),
        backgroundColor: "#781C68",
        stack: "Stack 0",
      },
      {
        label: "Natação",
        data: _.filter(areas, ["_id[1]", "natacao"]).map((m: any) => m.salario),
        backgroundColor: "#D36B00",
        stack: "Stack 0",
      },
      {
        label: "Boxe",
        data: _.filter(areas, ["_id[1]", "boxe"]).map((m: any) => m.salario),
        backgroundColor: "#224B0C",
        stack: "Stack 0",
      },
      {
        label: "MuaiThay",
        data: _.filter(areas, ["_id[1]", "muaithay"]).map(
          (m: any) => m.salario
        ),
        backgroundColor: "#EED180",
        stack: "Stack 0",
      },
      {
        label: "Ballet",
        data: _.filter(areas, ["_id[1]", "ballet"]).map((m: any) => m.salario),
        backgroundColor: "#CA4E79",
        stack: "Stack 0",
      },
      {
        label: "Aulas",
        data: _.filter(areas, ["_id[1]", "aulas"]).map((m: any) => m.salario),
        backgroundColor: "#F15412",
        stack: "Stack 0",
      },
    ],
  };

  return (
    <>
      <Navbar />

      <rec.Form method="get" action=".">
        <div className="flex justify-center items-center">
          <label className="mr-4 font-light   text-sm " htmlFor="rec">
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
            <option value="jul-2023">Julho - 2023</option>
            <option value="ago-2023">Agosto - 2023</option>
            <option value="set-2023">Setembro - 2023</option>
            <option value="out-2023">Outubro - 2023</option>
            <option value="nov-2023">Novembro - 2023</option>
            <option value="dez-2023">Dezembro - 2023</option>
          </select>
        </div>
      </rec.Form>
      <div className="container p-8 mx-auto">
        <div className=" grid grid-cols-3 gap-4">
          <div className="block shadow-md  rounded-md border border-gray-300 bg-gray text-center ">
            <div className="border-gray-300 py-2 text-white bg-slate-600 flex justify-between px-4">
              <p>Despesas Fixas</p>
              <p className="font-mono  ">
                {DespesasFixasTotal?.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="h-44 p-2 bg-white">
              <div className="overflow-y-auto  max-h-40 relative">
                <table className="text-sm w-full  text-left text-slate-500 ">
                  <tbody>
                    {DespesasFixas?.map((desp: tipoDesp) => (
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
            {/* <div className="border-t border-gray-300 p-2 text-gray-600">
            2 days ago
          </div> */}
          </div>
          <div className="block shadow-md  rounded-md border border-gray-300 bg-gray text-center ">
            <div className="border-gray-300 py-2 text-white bg-slate-600  flex justify-between px-4">
              <p>Despesas Variáveis</p>
              <p className="font-mono">
                {DespesasVariavelTotal?.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="h-44 p-2 bg-white">
              <div className="overflow-y-auto  max-h-56 relative">
                <table className="text-sm w-full  text-left text-slate-500 ">
                  <tbody>
                    {DespesasVariaveis?.map((desp: tipoDesp) => (
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
            {/* <div className="border-t border-gray-300 p-2 text-gray-600">
            2 days ago
          </div> */}
          </div>
          <div className="block shadow-md  rounded-md border border-gray-300 bg-gray text-center ">
            <div className="border-gray-300 py-2 text-white bg-slate-600 flex justify-between px-4">
              <p>Despesas</p>
              <p className="font-mono">
                {totalDesp._sum.valor?.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="h-44 p-2 bg-white">
              <div className="overflow-y-auto  max-h-40 relative">
                <table className="text-sm w-full text-left text-slate-500 ">
                  <tbody>
                    {despMes?.map((desp: tipoDesp) => (
                      <tr key={desp.id} className="bg-white border-b ">
                        <th className="py-2 px-1 w-40  font-medium text-slate-500 whitespace-nowrap ">
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
            {/* <div className="border-t border-gray-300 p-2 text-gray-600">
            2 days ago
          </div> */}
          </div>
          <div className="block shadow-md  rounded-md border border-gray-300 bg-gray text-center ">
            <div className="border-gray-300 py-2 text-white bg-sky-600 flex justify-between px-4">
              <p>Receitas</p>
              <p className="font-mono">
                {totalRec._sum.valor?.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="h-44 p-2 bg-white">
              <div className="overflow-y-auto  max-h-40 relative">
                <table className="text-sm w-full  text-left text-slate-500 ">
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
            {/* <div className="border-t border-gray-300 p-2 text-gray-600">
            2 days ago
          </div> */}
          </div>
          <div className="block shadow-md  rounded-md border border-gray-300 bg-gray text-center ">
            <div className="border-gray-300 py-2 text-white bg-sky-600  flex justify-between px-4">
              <p>Salários</p>
              <p className="font-mono">
                {TotSalarioMes.map(
                  (t: { salario: any }) => t.salario
                ).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="h-44 p-2 bg-white">
              <div className="overflow-y-auto  max-h-40 relative">
                <table className="text-sm w-full  text-left text-slate-500 ">
                  <tbody>
                    {TotSalAreas?.map((sal: any) => (
                      <tr key={sal.mod} className="bg-white border-b ">
                        <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                          {capitalize(sal.mod)}
                        </th>
                        <td className="py-2 px-6  font-mono text-right">
                          {sal.valor.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="block shadow-md  rounded-md border border-gray-300 bg-gray text-center ">
            <div className="border-gray-300 py-2 text-white bg-sky-600  flex justify-center items-center px-4">
              <p>Índices</p>
            </div>
            <div className="h-44 p-2 bg-white">
              <div className="overflow-y-auto  max-h-40 relative">
                <table className="text-sm w-full  text-left text-slate-500 ">
                  <tbody>
                    <tr className="bg-white border-b ">
                      <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                        Salários Diretos
                      </th>
                      <td className="py-2 px-6  font-mono text-right">
                        {SalDiretos?.toLocaleString("pt-br", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    <tr className="bg-white border-b ">
                      <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                        % Desp. Fixas
                      </th>
                      <td className="py-2 px-6  font-mono text-right">
                        <div className="text-slate-500 font-sm ">
                          {PercentFixa}
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-white border-b ">
                      <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                        % Variável
                      </th>
                      <td className="py-2 px-6  font-mono text-right">
                        <div className="text-slate-500 font-sm ">
                          {PercentVariavel}
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-white border-b ">
                      <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                        Ocupação
                      </th>
                      <td className="py-2 px-6  font-mono text-right">
                        <div className="text-slate-500 font-sm ">1.100</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="block shadow-md  rounded-md border border-gray-300 bg-gray text-center ">
            <div className="border-gray-300  py-2 text-white bg-emerald-600  flex justify-center items-center  px-4">
              <p>Previsão de Receitas</p>
            </div>
            <div className="h-44 p-2 bg-white">
              <div className="overflow-y-auto  max-h-40 relative">
                <table className="text-sm w-full  text-left text-slate-500 ">
                  <tbody>
                    <tr className="bg-white border-b ">
                      <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                        Previsão
                      </th>
                      <td className="py-2 px-6  font-mono text-right">
                        {previsao.toLocaleString("pt-br", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    <tr className="bg-white border-b ">
                      <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                        Lucro
                      </th>
                      <td className="py-2 px-6  font-mono text-right">
                        <div className="text-slate-500 font-sm ">
                          {Lucro.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-white border-b ">
                      <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                        Ponto de Equilíbrio
                      </th>
                      <td className="py-2 px-6  font-mono text-right">
                        <div className="text-slate-500 font-sm ">
                          {PontoEquilibrio.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </td>
                    </tr>
                    <tr className="bg-white border-b ">
                      <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                        Ponto de Equilíbrio Quantidade
                      </th>
                      <td className="py-2 px-6  font-mono text-right">
                        <div className="text-slate-500 font-sm ">
                          {PontoEquilibrioQtd.toLocaleString("pt-br", {
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="block shadow-md  rounded-md border border-gray-300 bg-gray text-center ">
            <div className="border-gray-300  py-2 text-white bg-emerald-600  flex justify-center items-center  px-4">
              <p>Mensalidades</p>
            </div>
            <div className="h-44 p-2 bg-white">
              <div className="overflow-y-auto  max-h-40 relative">
                <table className="text-sm w-full  text-left text-slate-500 ">
                  <tbody>
                    <tr className="bg-white border-b ">
                      <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                        Sem Lucro
                      </th>
                      <td className="py-2 px-6  font-mono text-right">
                        {Mensalidade.toLocaleString("pt-br", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                    <tr className="bg-white border-b ">
                      <th className="py-2 px-1 w-40  font-medium text-slate-900 whitespace-nowrap ">
                        Lucro de 6%
                      </th>
                      <td className="py-2 px-6  font-mono text-right">
                        <div className="text-slate-500 font-sm ">
                          {Mensalidade6.toLocaleString("pt-br", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Bar options={optionsBar} data={dataBar} />
          </div>
          <div>
            <Line options={optionsLine} data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
