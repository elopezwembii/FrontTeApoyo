export interface Gasto {
  id: number;
  desc: string;
  recurrente: boolean;
  tipo: number;
  subtipo: number;
  dia: number;
  mes: number;
  anio: number;
  monto: number;
}
