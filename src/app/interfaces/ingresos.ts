export interface Ingreso {
    id: number;
    desc: string;
    fijar: boolean;
    tipo: number;
    dia: number;
    mes: number;
    anio: number;
    montoReal: number;
    montoPlanificado: number;
}