import { Region } from "./region.model";

export interface ClienteModel {
  id?: number;
  nombre?: string;
  apellido?: string;
  createAt?: string;
  email?: string;
  region?: Region;
}
