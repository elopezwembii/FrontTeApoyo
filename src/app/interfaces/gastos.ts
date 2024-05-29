export interface Gasto {
    id: number;
    desc: string;
    fijar: number;
    tipo_gasto: number;
    subtipo_gasto: number;
    dia: number;
    mes: number;
    anio: number;
    monto: number;
    get_sub_tipo?: {nombre?: string};
}
