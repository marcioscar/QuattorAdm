import { prisma } from "./prisma.server";
import type { DespesaForm } from "./types.server";

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

export const createDespesa = async (despesa: DespesaForm) => {
  const dt = new Date(despesa.data);
  const dataAtual = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);

  const newDespesa = await prisma.despesas.create({
    data: {
      conta: despesa.conta,
      data: dataAtual,
      tipo: despesa.tipo,
      valor: parseFloat(despesa.valor.replace(".", "").replace(",", ".")),
    },
  });
  return { newDespesa };
};
export const updateDespesa = async (despesa: DespesaForm) => {
  const dt = new Date(despesa.data);
  const dataAtual = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);

  const newDespesa = await prisma.despesas.update({
    where: {
      id: despesa.id,
    },
    data: {
      conta: despesa.conta,
      data: dataAtual,
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
