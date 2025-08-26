import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { AuthService } from '../usuario/login/auth-service';
import { RouterModule,Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  title: string = 'Invoice';

  constructor(public authService: AuthService, private readonly router: Router) {}

  logout(): void {    
    let username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire('Logout', `Hola ${username}, has cerrado sesión con éxito!`, 'success');
    this.router.navigate(['/login']);
  }

}
