export interface Ahorro {
    id?: number;
    progreso?: number;
    meta: number;
    fecha_limite:Date;
    recaudado: number;
    tipo_ahorro:TipoAhorro;
}

export interface TipoAhorro {
    id: number;
    descripcion: string;
    img: string;
}
