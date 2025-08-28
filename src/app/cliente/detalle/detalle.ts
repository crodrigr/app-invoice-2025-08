import { Component, OnInit, Input } from '@angular/core';
import { ClienteModel } from '../cliente.model';
import { ClienteService } from '../cliente-service';
import { ModalService } from './modal-servcie';
import swal from 'sweetalert2';
import { FacturaModel } from '../../factura/factura.model';
import { FacturaServices} from '../../factura/factura-services';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-detalle',
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css'
})
export class Detalle {

  @Input() cliente!: ClienteModel;

  titulo: string = "Detalle del cliente";

  constructor(
    private readonly clienteService: ClienteService,
    public  readonly modalService: ModalService,
    private readonly facturaService: FacturaServices
  ) {}

  ngOnInit(): void {
      this.cliente.facturas = this.cliente.facturas ?? [];
  }

  cerrarModal(): void {
    this.modalService.cerrarModal();
  }

  delete(factura: FacturaModel): void {
    swal.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar la factura: ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(() => {
          this.cliente.facturas = this.cliente.facturas?.filter(f => f !== factura) ?? [];
          swal.fire(
            'Factura Eliminada!',
            `Factura ${factura.descripcion} eliminada con éxito.`,
            'success'
          );
        });
      }
    });
  }

}
