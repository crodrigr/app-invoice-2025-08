import { Producto } from "./producto.model";

export class ItemFactura {
  constructor(
    public producto: Producto,
    public cantidad: number = 1
  ) {}

  public calcularImporte(): number {
    return this.cantidad * this.producto.precio;
  }

  get importe(): number {
    return this.calcularImporte();
  }
}
