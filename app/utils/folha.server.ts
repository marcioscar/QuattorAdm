import { prisma } from "./prisma.server";
import type { funcForm, ReceitaForm, salFrom } from "./types.server";
import { format, subMonths } from "date-fns";
import { pt } from "date-fns/locale";

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
      salarios: [],
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
  const referencia = format(subMonths(new Date(salario.data), 1), "MMM-yyyy", {
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
  // const newSalario = await prisma.folha.update({
  //   where: {
  //     id: salario.id,
  //   },
  //   data: {
  //     salarios: {
  //       push: {
  //         data: new Date(),
  //         valor: salario.valor,
  //         sal_id: Math.random().toString(36).slice(-5),
  //         pago: false,
  //         // referencia: referencia,
  //         fgts: salario.valor,
  //         ferias: salario.valor,
  //         decimo: salario.valor,
  //       },
  //     },
  //   },
  // });
  // return { newSalario };
};
