export type DespesaForm = {
  conta: string;
  data: Date;
  tipo: string;
  valor: string;
  id?: string;
};

export type tipoDesp = {
  id: string;
  conta: string;
  data: Date;
  tipo: string;
  valor: number;
};

export type ReceitaForm = {
  centro: string;
  data: Date;
  valor: string;
  id?: string;
};

export type tipoRec = {
  id: string;
  centro: string;
  data: Date;
  valor: number;
};
