import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ConceptoTareaFlujoService {

  url = `${environment.miMutualReclamacionesUrl}/mimConceptoTareaFlujo`;

  constructor(private readonly http: HttpClient) { }

  getConceptoTareaFlujo(param: any): Observable<any> {
    return this.http.get(this.url, {params: param});
  }

}
