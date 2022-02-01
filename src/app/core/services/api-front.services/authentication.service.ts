import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@environments/environment';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  subscriptions: Subscription[] = [];

  constructor(private readonly http: HttpClient,
    private readonly jwt: JwtHelperService,
    private readonly handler: HttpBackend) {
    this.http = new HttpClient(this.handler);
  }

  /**
   * @description Se encarga de solicitar un nuevo token de acceso.
   * @return Observale correspondiente a la solicitud del nuevo token de acceso.
   */
  login(login: any): Observable<any> {
    login.grant_type = 'password';
    login.password = encodeURIComponent(login.password);

    const jsonHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)
    };

    const httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };

    const url = `${environment.sisproUrl}/oauth/token?password=${login.password}&username=${login.username}&grant_type=${login.grant_type}&application=${environment.appName}`;
    return this.http.post(url, {}, httpOptions).pipe(
      map((authToken: any) => {
        this.saveToken(authToken);
        this.saveUser(authToken.user);
      })
    );
  }

  /**
   * @description Guarda token de autorizacion
   * @param authToken Token de autorizacion
   */
  saveToken(authToken: any) {
    if (authToken) {
      sessionStorage.setItem('token', JSON.stringify(authToken));
    }

    return authToken;
  }

  /**
   *
   * @description Guarda menu de usuario
   * @param menu menu de usuario
   */
  saveUser(user: any) {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }

    return user;
  }

  /**
   * @description Se encarga de solicitar un nuevo token de refresco.
   * @return Observable correspondiente a la solicitud del token de refresco.
   */
  refresh(): Observable<any> {
    const storage: any = sessionStorage.getItem('token');
    if (!storage) {
      return;
    }

    const refresh = {
      grant_type: 'refresh_token',
      refresh_token: JSON.parse(storage).refresh_token
    };

    const jsonHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)
    };

    const httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };

    const url = `${environment.sisproUrl}/oauth/token?grant_type=${refresh.grant_type}&application=${environment.appName}&refresh_token=${refresh.refresh_token}`;
    return this.http.post(url, { refresh }, httpOptions).pipe(
      map((authToken: any) => {
        this.saveToken(authToken);
      })
    );
  }

  userMe() {
    const url = `${environment.sisproUrl}/user/me`;
    const token = this.getToken();

    const jsonHeaders = {
      Authorization: 'Bearer ' + token
    };

    const httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };
    return this.http.get(url, httpOptions);
  }

  /**
   * @description Valida que el usuario este logeado.
   * @return True si el usuario esta loggeado, false sino.
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    return token ? this.jwt.isTokenExpired(token) : true;
  }

  isRefreshTokenExpired() {
    const token = this.getRefreshToken();
    return token ? this.jwt.isTokenExpired(token) : true;
  }

  /**
   * @description Se encarga de cerrar la sesi;ón en el aplicativo.
   * @return null
   */
  logout() {

    const token = this.getToken();
    if (!token) {
      return;
    }

    const jsonHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)
    };

    const httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    const url = `${environment.sisproUrl}/oauth/token?token=${token}`;
    return this.http.delete(url, httpOptions).subscribe();
  }

  /**
   * @description Obtiene el token de acceso.
   * @return Retorna el token de acceso.
   */
  getUser(): any {
    const storage = sessionStorage.getItem('user');
    return storage ? JSON.parse(storage) : undefined;
  }

  /**
   * @description Obtiene el token de acceso.
   * @return Retorna el token de acceso.
   */
  getToken(): string {
    const storage = sessionStorage.getItem('token');
    return storage ? JSON.parse(storage).access_token : undefined;
  }

  /**
   * @description Obtiene el token de acceso.
   * @return Retorna el token de acceso.
   */
  getRefreshToken(): string {
    const storage = sessionStorage.getItem('token');
    return storage ? JSON.parse(storage).refresh_token : undefined;
  }

  /**
   * @description Obtiene la fecha de expiraci;ón.
   * @return Retorna la fecha de expiraci;ón del token.
   */
  getTokenExpirationDate(): Date {
    return this.jwt.getTokenExpirationDate();
  }

  /**
   * @description Obtiene el expiresIn del token.
   * @return Retorna el numero de segundos.
   */
  getExpiresInToken(): number {
    const storage = sessionStorage.getItem('token');
    return storage ? JSON.parse(storage).expires_in : undefined;
  }

}
