import { Region } from "./region.model";
import { FacturaModel } from "../factura/factura.model";

export interface ClienteModel {
  id?: number;
  nombre?: string;
  apellido?: string;
  createAt?: string;
  email?: string;
  region?: Region;
  facturas?: FacturaModel[];
}
