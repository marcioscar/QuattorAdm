import { prisma } from "./prisma.server";
import type { ReceitaForm } from "./types.server";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export const getReceitas = async () => {
  return prisma.receitas.findMany({
    orderBy: {
      data: "desc",
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
// export const groupReceitasAgrupadas = async (ref: string) => {
//   return prisma.receitas.aggregate({
//     _sum: {
//       valor: true,
//     },
//     where: {
//       referencia: {
//         contains: ref,
//       },
//     },
//   });
// };
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
  const referencia = format(dataAtual, "MMM-yyyy", { locale: pt });
  const newReceita = await prisma.receitas.create({
    data: {
      referencia: referencia,
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
  const referencia = format(dataAtual, "MMM-yyyy", { locale: pt });
  const newReceita = await prisma.receitas.update({
    where: {
      id: receita.id,
    },
    data: {
      centro: receita.centro,
      data: dataAtual,
      referencia: referencia,
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
