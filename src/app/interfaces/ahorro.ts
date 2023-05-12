export interface Ahorro {
    id?: string;
    progreso?: number;
    monto: number;
    fechaLimite: Date;
    recaudado: number;
    meta: number;
    tipoAhorro:TipoAhorro;
}

export interface TipoAhorro {
    id: number;
    descripcion: string;
    img: string;
}
