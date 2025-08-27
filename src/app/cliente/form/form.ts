import { Component, OnInit } from '@angular/core';
import { ClienteModel } from '../cliente.model';
import { Region } from '../region.model';
import { ClienteService } from '../cliente-service';
import { Router, ActivatedRoute,RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-form',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, RouterModule
  ],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form implements OnInit {

  titulo: string = "Crear Cliente";

  cliente: ClienteModel = {};
  regiones: Region[] = [];
  errores: string[] = [];

  constructor(private readonly clienteService: ClienteService,
    private readonly router: Router,
    private readonly activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.getRegiones();
    this.getCargarCliente();
  }

  getRegiones(): void {
    this.clienteService.getRegiones().subscribe(respuesta => {
      this.regiones = respuesta;
    }
    )
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe({
      next: (cliente: ClienteModel) => {
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        this.errores = [];
        if (err.error.errors) {
          this.errores = err.error.errors as string[];
        } else if (err.error.error) {
          this.errores.push(err.error.mensaje);
          console.error(err.error.error);

        }
        console.error('Código del error desde el backend: ' + err.status);

      }
    });
  }

  getCargarCliente(): void {
    this.activatedRouter.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id) {
        this.clienteService.getCliente(Number(id)).subscribe(cliente => {
          this.cliente = cliente
        })
      }
    })

  }

  compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe({
      next: (cliente) => {
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        this.errores = [];
        if (err.error.errors) {
          this.errores = err.error.errors as string[];
        } else if (err.error.error) {
          this.errores.push(err.error.mensaje);
          console.error(err.error.error);
        }
        console.error('Código del error desde el backend: ' + err.status);
      }
    });
  }
 


}
