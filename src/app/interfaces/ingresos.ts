export interface Ingreso {
    id: number;
    desc: string;
    fijar: number;
    tipo_ingreso: number;
    dia?: number;
    mes?: number;
    anio?: number;
    monto_real: number;
    montoPlanificado?: number;
    created_at?: string;
    id_usuario?: number;
    update_at?: string;
}
