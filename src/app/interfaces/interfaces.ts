export interface IMenu {
    icon: string;
    nombre: string;
    pagina: string;
}

export interface IProducto {
    id_producto?: number;
    nombre_producto: string;
    foto_producto: string;
    descripcion: string;
    precio: number;
    nombreCat?: string;
}

export interface IPedido {
    cantidad: number;
    producto: IProducto;
    total: number;
}