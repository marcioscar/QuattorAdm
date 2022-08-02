import { prisma } from "./prisma.server";
import type { DespesaForm } from "./types.server";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export const getDespesas = async () => {
  return prisma.despesas.findMany({
    orderBy: {
      data: "desc",
    },
  });
};

export const getDespesa = async (despesaId: string) => {
  return prisma.despesas.findUnique({
    where: {
      id: despesaId,
    },
  });
};

export const totDespesas = async (ref: string) => {
  return prisma.despesas.aggregate({
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
export const DespesasMes = async (ref: string) => {
  return prisma.despesas.findMany({
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
export const DespesasFixas = async (ref: string) => {
  return prisma.despesas.findMany({
    where: {
      referencia: {
        equals: ref,
      },
      tipo: {
        equals: "fixa",
      },
    },
    orderBy: {
      valor: "desc",
    },
  });
};

export const totTipoDespesas = async (ref: string) => {
  const despesasTipo = await prisma.despesas.groupBy({
    by: ["tipo"],
    _sum: {
      valor: true,
    },
    where: {
      referencia: {
        equals: ref,
      },
    },
  });
  return despesasTipo;
};

export const createDespesa = async (despesa: DespesaForm) => {
  const dt = new Date(despesa.data);
  const dataAtual = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
  const referencia = format(dataAtual, "MMM-yyyy", { locale: pt });
  const newDespesa = await prisma.despesas.create({
    data: {
      conta: despesa.conta,
      data: dataAtual,
      referencia: referencia,
      tipo: despesa.tipo,
      valor: parseFloat(despesa.valor.replace(".", "").replace(",", ".")),
    },
  });
  return { newDespesa };
};
export const updateDespesa = async (despesa: DespesaForm) => {
  const dt = new Date(despesa.data);
  const dataAtual = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
  const referencia = format(dataAtual, "MMM-yyyy", { locale: pt });
  const newDespesa = await prisma.despesas.update({
    where: {
      id: despesa.id,
    },
    data: {
      conta: despesa.conta,
      data: dataAtual,
      referencia: referencia,
      tipo: despesa.tipo,
      valor: parseFloat(despesa.valor.replace(".", "").replace(",", ".")),
    },
  });
  return { newDespesa };
};

export const deleteDespesa = async (despesa: DespesaForm) => {
  await prisma.despesas.delete({
    where: {
      id: despesa.id,
    },
  });
};
