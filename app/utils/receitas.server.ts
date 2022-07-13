import { prisma } from "./prisma.server";
import type { ReceitaForm } from "./types.server";

export const getReceitas = async () => {
  return prisma.receitas.findMany({
    orderBy: {
      data: "desc",
    },
  });
};

export const getReceita = async (receitaId: string) => {
  return prisma.receitas.findUnique({
    where: {
      id: receitaId,
    },
  });
};

export const createReceita = async (receita: ReceitaForm) => {
  const dt = new Date(receita.data);
  const dataAtual = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);

  const newReceita = await prisma.receitas.create({
    data: {
      centro: receita.centro,
      data: dataAtual,
      valor: parseFloat(receita.valor.replace(".", "").replace(",", ".")),
    },
  });
  return { newReceita };
};
export const updateReceita = async (receita: ReceitaForm) => {
  const dt = new Date(receita.data);
  const dataAtual = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
  const newReceita = await prisma.receitas.update({
    where: {
      id: receita.id,
    },
    data: {
      centro: receita.centro,
      data: dataAtual,

      valor: parseFloat(receita.valor.replace(".", "").replace(",", ".")),
    },
  });
  return { newReceita };
};

export const deleteReceita = async (receita: ReceitaForm) => {
  await prisma.receitas.delete({
    where: {
      id: receita.id,
    },
  });
};
