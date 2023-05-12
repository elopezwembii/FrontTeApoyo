export interface ItemPresupuesto {
    id?: number;
    id_presupuesto?:number,
    monto?: number;
    tipo_gasto?: number;
}

export interface Presupuesto {
    id?: number;
    mes?: number;
    anio?: number;
    fijado?: number;
    presupuesto?: number,
    get_items?: ItemPresupuesto[];
}

export interface Categoria {
    id: number;
    descripcion: string;
    img: string;
}
