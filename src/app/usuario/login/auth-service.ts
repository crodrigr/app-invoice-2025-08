import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario.model';
import { environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario | null = null;
  private _token: string | null = null;

  constructor(private readonly http: HttpClient) { }

  login(usuario: Usuario): Observable<any> {
    const urlEndpoint = `${environment.apiUrl}/oauth/token`;
    const credenciales = btoa('frontendapp:12345');

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });

    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);

    // Imprimir cómo se va la petición
    console.log('🟢 Enviando petición POST a:', urlEndpoint);
    console.log('🔐 Headers:', httpHeaders.keys().map(key => `${key}: ${httpHeaders.get(key)}`));
    console.log('📦 Cuerpo (x-www-form-urlencoded):', params.toString());

    return this.http.post<any>(urlEndpoint, params.toString(), { headers: httpHeaders });
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken) {
      try {
        return JSON.parse(atob(accessToken.split('.')[1]));
      } catch (error) {
        console.error('Error al decodificar el token JWT:', error);
        return null;
      }
    }
    return null;
  }

  guardarUsuario(accessToken: string): void {
    const payload = this.obtenerDatosToken(accessToken);
    if (payload) {
      this._usuario = new Usuario();
      this._usuario.nombre = payload.nombre;
      this._usuario.apellido = payload.apellido;
      this._usuario.email = payload.email;
      this._usuario.username = payload.user_name;
      this._usuario.roles = payload.authorities || [];
      sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
    }
  }

  public get usuario(): Usuario {
    if (this._usuario) return this._usuario;

    const usuarioString = sessionStorage.getItem('usuario');
    if (usuarioString) {
      this._usuario = JSON.parse(usuarioString) as Usuario;
      return this._usuario;
    }

    return new Usuario(); // fallback
  }

  public get token(): string {
    if (this._token) return this._token;

    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      this._token = storedToken;
      return storedToken;
    }

    return '';
  }

  guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  isAuthenticated(): boolean {
    const payload = this.obtenerDatosToken(this.token);
    return !!(payload && payload.user_name && payload.user_name.length > 0);
  }

  hasRole(role: string): boolean {
    return this.usuario.roles.includes(role);
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
  }

  
}
