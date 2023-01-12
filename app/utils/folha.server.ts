import { prisma } from "./prisma.server";
import type { funcForm } from "./types.server";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import _ from "lodash";

//sal_id: Math.random().toString(36).slice(-5),

export const getFuncionarios = async () => {
  return prisma.folha.findMany({
    orderBy: {
      nome: "asc",
    },
  });
};

export const groupReceitasAgrupadas = async (ref: string) => {
  return prisma.receitas.aggregate({
    _sum: {
      valor: true,
    },
    where: {
      referencia: {
        equals: ref,
      },
    },
  });
};

export const groupSalarioAreas = async (ref: string) => {
  const sal = await prisma.folha.aggregateRaw({
    pipeline: [{ $unwind: "$salarios" }],
  });
  const salFilter = _.filter(sal, ["salarios.referencia", ref]);
  let total = _(salFilter)
    .groupBy("modalidade")
    .map((objs, key) => {
      return {
        mod: key,
        valor: _.sumBy(objs, "salarios.valor"),
      };
    })
    .value();
  return _.orderBy(total, ["valor"], ["desc"]);
};
export const SalarioAreas = async () => {
  const modalidade = await prisma.folha.aggregateRaw({
    pipeline: [
      { $unwind: "$salarios" },
      {
        $group: {
          _id: ["$salarios.referencia", "$modalidade"],
          salario: { $sum: "$salarios.valor" },
        },
      },
    ],
  });
  // @ts-ignore
  const modal = modalidade.map((o: any) =>
    Object.assign(
      {},
      o,
      o._id[0] === "jan-2023" && { mes: 1 },
      o._id[0] === "fev-2023" && { mes: 2 },
      o._id[0] === "mar-2023" && { mes: 3 },
      o._id[0] === "abr-2023" && { mes: 4 },
      o._id[0] === "mai-2023" && { mes: 5 },
      o._id[0] === "jun-2023" && { mes: 6 },
      o._id[0] === "jul-2023" && { mes: 7 },
      o._id[0] === "ago-2023" && { mes: 8 },
      o._id[0] === "set-2023" && { mes: 9 },
      o._id[0] === "out-2023" && { mes: 10 },
      o._id[0] === "nov-2023" && { mes: 11 },
      o._id[0] === "dez-2023" && { mes: 12 }
    )
  );
  return _.orderBy(modal, ["mes"]);
};

export const groupSalario = async () => {
  return prisma.folha.aggregateRaw({
    pipeline: [
      { $unwind: "$salarios" },
      {
        $group: {
          _id: "$salarios.referencia",
          salario: { $sum: "$salarios.valor" },
        },
      },
    ],
  });
};

export const ReceitasMes = async (ref: string) => {
  return prisma.receitas.findMany({
    where: {
      referencia: {
        equals: ref,
      },
    },
    orderBy: {
      valor: "desc",
    },
  });
};

export const getFuncionario = async (funcionarioId: string) => {
  return prisma.folha.findUnique({
    where: {
      id: funcionarioId,
    },
  });
};

export const createFuncionario = async (funcionario: funcForm) => {
  const newFuncionario = await prisma.folha.create({
    data: {
      nome: funcionario.nome,
      funcao: funcionario.funcao,
      modalidade: funcionario.modalidade,
      conta: funcionario.conta,
      salarios: [
        {
          valor: 0,
          fgts: 0,
          ferias: 0,
          decimo: 0,
          pago: true,
        },
      ],
    },
  });
  return { newFuncionario };
};
export const updateFuncionario = async (funcionario: funcForm) => {
  const newFuncionario = await prisma.folha.update({
    where: {
      id: funcionario.id,
    },
    data: {
      nome: funcionario.nome,
      funcao: funcionario.funcao,
      modalidade: funcionario.modalidade,
      conta: funcionario.conta,
    },
  });
  return { newFuncionario };
};

export const deleteFuncionario = async (funcionario: funcForm) => {
  await prisma.folha.delete({
    where: {
      id: funcionario.id,
    },
  });
};

export const createSalario = async (salario: any) => {
  const dt = new Date(salario.data);
  const dataAtual = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
  const referencia = format(new Date(salario.data), "MMM-yyyy", {
    locale: pt,
  });
  const valor = parseFloat(salario.valor.replace(".", "").replace(",", "."));
  const id = Math.random().toString(36).slice(-5);
  return prisma.folha.update({
    where: {
      id: salario.id,
    },
    data: {
      salarios: {
        push: {
          valor: valor,
          data: dataAtual,
          sal_id: id,
          fgts: valor * 0.08,
          ferias: valor / 12,
          decimo: valor / 12,
          referencia: referencia,
          pago: false,
        },
      },
    },
  });
};
export const deleteSalario = async (salario: any) => {
  console.log(salario);
  return prisma.folha.update({
    where: {
      id: salario.id,
    },
    data: {
      salarios: {
        deleteMany: {
          where: {
            sal_id: salario.sal_id,
          },
        },
      },
    },
  });
};
export const pagarSalario = async (salario: any) => {
  console.log(salario);
  return prisma.folha.update({
    where: {
      id: salario.id,
    },
    data: {
      salarios: {
        updateMany: {
          where: {
            sal_id: salario.sal_id,
          },
          data: {
            pago: true,
          },
        },
      },
    },
  });
};
