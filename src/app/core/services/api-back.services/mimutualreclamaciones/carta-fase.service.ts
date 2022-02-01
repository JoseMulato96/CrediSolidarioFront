import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartaFaseService {

    url = `${environment.miMutualReclamacionesUrl}/mimCartaFase`;
    constructor(private readonly http: HttpClient) {}

    getCartaFase(param: any): Observable<any> {
        return this.http.get(this.url, {params: param});
    }
}
