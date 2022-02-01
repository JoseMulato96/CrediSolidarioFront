import { Injectable } from '@angular/core';
import { TimeoutService } from './timeout.service';
import { HttpClient, HttpBackend, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { AuthenticationService } from './authentication.service';

export const HEALTH_CHECK_MILLIS = 60000;

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService extends TimeoutService {

  constructor(
    private readonly http: HttpClient,
    private readonly handler: HttpBackend,
    private readonly authenticationService: AuthenticationService) {
    super();
    this.http = new HttpClient(this.handler);
  }

  public resetTimer() {
    this.startTimer();
  }

  /**
   *
   * @description Se encarga de realizar todos los llamados a HealthCheck de los servicios.
   */
  public bulkHealthCheck(): Observable<any> {
    return forkJoin([
      this.doHealthCheck(environment.miMutualAsociadosUrl),
      this.doHealthCheck(environment.miMutualUtilidadesUrl)
    ]);
  }

  /**
   *
   * @description Se encarga de consumir el HealthCheck de un servicio.
   * @param url Url del servicio al que se desea validar el status.
   */
  private doHealthCheck(url: string): Observable<any> {
    const token = this.authenticationService.getToken();

    const jsonHeaders = {
      Authorization: `Bearer ${token}`
    };

    const httpOptions = {
      headers: new HttpHeaders(jsonHeaders)
    };

    url = `${url}/actuator/health`;
    return this.http.get(url, httpOptions);
  }
}
