export interface Cupones {
    id?: number;
    codigo: string;
    descripcion: string;
    descuento: number;
    registro:string;
    fecha_inicio:string;
    fecha_fin:string;
    tipo: string;
    estado: number;
    created_at?: string;
    update_at?: string;
}
