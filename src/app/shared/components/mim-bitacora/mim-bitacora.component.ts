import { Component, OnInit, Input } from '@angular/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { GENERALES } from '@shared/static/constantes/constantes';
import { FrontFacadeService } from '@core/services/front-facade.service';
import { BackFacadeService } from '@core/services/back-facade.service';

@Component({
  selector: 'app-mim-bitacora',
  templateUrl: './mim-bitacora.component.html',
})
export class MimBitacoraComponent implements OnInit {

  datos: any[] = [];
  selectIndex = -1;
  tituloBitacora: string;

  @Input() idProceso: any;
  @Input() titulo: string;
  constructor(
    private readonly translate: TranslateService,
    private readonly frontService: FrontFacadeService,
    private readonly backService: BackFacadeService
  ) { }

  ngOnInit() {
    this.tituloBitacora = this.titulo === null || this.titulo === undefined ? 'eventos.consulta.bitacora.titulo' : this.titulo;
    this.getBitacora();
  }

  getBitacora() {
    forkJoin({
      _reclamaciones: this.backService.reclamaciones.getBitacora(this.idProceso),
      _tareas: this.backService.proceso.getObservacionesByIdProceso(this.idProceso)
    }).pipe(
      map(x => {
        return [ ...x._reclamaciones.content,
          ...x._tareas.map(t => {
            return {
             id: t.id,
             dateManagement: t.time,
             observation:  t.comment.includes('||') ? t.comment.split('||')[0] : t.comment,
             taskName: '',
             type: t.type,
             idOrder: '',
             managementState: '',
             employee: {
              id: t.user.identification,
              name: t.user.name,
              idArea: null,
              idCompany: null,
              email: null,
              login: t.user.username,
              isAdministration: null,
              viewReporting: null,
              isActive: null,
              idDocument: null,
              idCanal: null,
              idString: null
             }
           };
         })
        ];
      })
    ).subscribe((respuesta: any) => {
      if (!respuesta || !respuesta.length) {
        const msg = 'global.noSeEncontraronRegistrosMensaje';
        this.translate.get(msg).subscribe((response: string) => {
          this.frontService.alert.info(response);
        });
        return;
      }

      this.datos = respuesta;
      this.datos.forEach(x => {
        x['date'] = String(x['dateManagement'] || '').substr(0, 10);
        x['time'] = String(x['dateManagement'] || '').substr(10);
      });

      this.datos = this.datos.filter(x => x.type !== GENERALES.TIPO_COMENTARIO.ASIGNAR);
    }, (err) => {
      this.frontService.alert.error(err.error.message);
    });
  }

  /**
  * @author Jorge Luis Caviedes Alvarado
  * @description selecionar la card con el borde narajado
  */
 _onClickCard(index: number, e: MouseEvent) {
  this.selectIndex = index;
  e.stopPropagation();
}

}
