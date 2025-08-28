import { Routes } from '@angular/router';
import { Login } from './usuario/login/login';
import { Cliente } from './cliente/cliente';
import { Form } from './cliente/form/form';
import { authGuard } from './usuario/login/authguard-guard';
import { Factura } from './factura/factura'; 

export const routes: Routes = [
    { path: 'clientes', component: Cliente, canActivate: [authGuard] },
    { path: 'clientes/form', component: Form, canActivate: [authGuard] },
    { path: 'clientes/form/:id', component: Form, canActivate: [authGuard] },
    { path: 'facturas/form/:clienteId', component: Factura, canActivate: [authGuard] },
    { path: 'facturas/:id', component: Factura, canActivate: [authGuard] },
    {path:'login',component:Login}
];
