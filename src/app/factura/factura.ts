import { Component, OnInit } from '@angular/core';
import { FormControl,NgForm,FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { FacturaModel } from './factura.model';
import { ClienteService } from '../cliente/cliente-service';
import { ActivatedRoute, Router,RouterModule } from '@angular/router';
import { FacturaServices } from './factura-services';
import { Producto } from './producto.model';
import { ItemFactura } from './item-factura.model'
import swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-factura',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    RouterModule
  ],
  templateUrl: './factura.html',
  styleUrl: './factura.css'
})
export class Factura implements OnInit  {

  titulo: string = 'Nueva Factura';
  factura: FacturaModel = new FacturaModel();
  autocompleteControl = new FormControl();
  productosFiltrados!: Observable<Producto[]>;
  esVisualizacion: boolean = false;

  constructor(
    private readonly clienteService: ClienteService,
    private readonly facturaService: FacturaServices,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const facturaIdParam = params.get('id');
      const clienteIdParam = params.get('clienteId');

      if (facturaIdParam) {
        const id = +facturaIdParam;
        this.facturaService.getFactura(id).subscribe(factura => {
          this.factura = factura;
          this.titulo = `Factura #${factura.id}`;
          this.esVisualizacion = true;

          if (this.factura.items) {
            console.log(`La factura tiene ${this.factura.items.length} ítem(s).`);

            // Opción 1: si existe calcularGranTotal()
            if (typeof this.factura.calcularGranTotal === 'function') {
              console.log(`La factura total: ${this.factura.calcularGranTotal()} .`);
            }

            // Opción 2: cálculo manual
            let total = 0;
            this.factura.items.forEach(item => {
              total += item.calcularImporte();
            });
            console.log(`La factura total2: ${total} .`);
          }
        });

      } else if (clienteIdParam) {
        const clienteId = +clienteIdParam;
        this.clienteService.getCliente(clienteId).subscribe(cliente => {
          this.factura.cliente = cliente;
          this.titulo = 'Nueva Factura';
          this.esVisualizacion = false;
        });
      } else {
        console.warn('Ni id de factura ni cliente encontrados en la ruta.');
      }
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value.nombre),
      mergeMap(value => value ? this._filter(value) : [])
    );
  }


  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string {
    return producto ? producto.nombre : '';
  }

  seleccionarProducto(value: any): void {
    const producto = value as Producto;
    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      const nuevoItem = new ItemFactura(producto);
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    this.autocompleteControl.setValue('');
  }

  existeItem(id: number): boolean {
    return this.factura.items.some(item => item.producto.id === id);
  }

  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map(item => {
      if (item.producto.id === id) {
        item.cantidad++;
      }
      return item;
    });
  }

  actualizarCantidad(id: number, event: any): void {
    const cantidad: number = +event.target.value;
    if (cantidad === 0) {
      this.eliminarItemFactura(id);
    } else {
      this.factura.items = this.factura.items.map(item => {
        if (item.producto.id === id) {
          item.cantidad = cantidad;
        }
        return item;
      });
    }
  }

  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter(item => item.producto.id !== id);
  }

  create(facturaForm: NgForm): void {
    if (this.esVisualizacion) return;

    if (this.factura.items.length === 0) {
      this.autocompleteControl.setErrors({ 'invalid': true });
    }

    if (facturaForm.valid && this.factura.items.length > 0) {
      this.facturaService.create(this.factura).subscribe(factura => {
        swal.fire(this.titulo, `Factura "${factura.descripcion}" creada con éxito`, 'success');
        this.router.navigate(['/clientes']);
      });
    }
  }

  getGranTotal(): number {
    return this.factura.items.reduce((total, item) => {
      const precio = item.producto?.precio ?? 0;
      const cantidad = item.cantidad ?? 0;
      return total + (precio * cantidad);
    }, 0);
  }


}
