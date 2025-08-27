import { Component, OnInit } from '@angular/core';
import { ClienteService } from './cliente-service';
import { ClienteModel } from './cliente.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css'
})
export class Cliente implements OnInit {

  title = 'Cliente';
  clientes: ClienteModel[] = [];
  

  constructor(private readonly clienteService: ClienteService) { }

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe(response => {
      this.clientes = response;
    });
  }

  delete(cliente: ClienteModel): void {
    if (cliente.id == null) {
      console.error('Cliente ID es undefined o null');
      return;
    }

    swal.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id!).subscribe({
          next: () => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swal.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito.`,
              'success'
            );
          }
        });
      }
    });
  }


}
