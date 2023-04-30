export interface Presupuesto {
    id:number,
    categoria:string,
    categoriaId?:string,
    mes:number,
    year:number,
    monto:number
}

export interface Categoria {
    id: string;
    descripcion: string;
    img:string,
}
