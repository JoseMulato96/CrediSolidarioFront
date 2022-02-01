import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal, { SweetAlertOptions, SweetAlertType } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private readonly translate: TranslateService) { }

  private configBase() {
    const options: SweetAlertOptions = {
      customClass: {
        container: 'z-index-11000',
        header: 'bar-model'
      },
      showCloseButton: false,
      buttonsStyling: false,
      confirmButtonText: 'Aceptar'
    };
    return options;
  }

  private alert(text: string,
    icon: SweetAlertType = null,
    swalConfig) {
    return swalConfig.fire({
      text: text ? text : null,
      type: icon,
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  success(text = 'Proceso realizado con éxito.'): Promise<any> {
    const option = this.configBase();
    option.customClass['closeButton'] =
      'btn btn--circle float-right p-0 btn-color-close';
    option.customClass['confirmButton'] =
      'btn btn--md w-100 btn--green1 btn-min-with';
    option.html = `<h5 class="my-0 text--gray2 text--600wt d-block text--tittle_circle text--tittle_circle-xl
    text-center mx-auto success" ng-reflect-klass="my-0 text--gray2 text--600wt d" ng-reflect-ng-class="success">
    <span class="text--36pts text-center mx-auto icon-thumbs-up" ng-reflect-klass="text--36pts text-center
    mx-aut" ng-reflect-ng-class="icon-thumbs-up"></span></h5>
    <h2 class="text--gray1 text--500wt text-center mt-4">${text}</h2>`;
    const swalConfig = Swal.mixin(option);
    return this.alert(text, null, swalConfig);
  }

  info(text: string): Promise<any> {
    const option = this.configBase();
    option.customClass['closeButton'] =
      'btn btn--circle float-right p-0 btn-color-close';
    option.customClass['confirmButton'] =
      'btn btn--md w-100 btn--blue1 btn-min-with';
    option.html = `<h5 class="my-0 text--gray2 text--600wt d-block text--tittle_circle text--tittle_circle-xl text-center mx-auto info blue blue-icon span"
    ng-reflect-klass="my-0 text--gray2 text--600wt d" ng-reflect-ng-class="blue"><span class="text--36pts text-center mx-auto icon-info"
    ng-reflect-klass="text--36pts text-center mx-aut" ng-reflect-ng-class="icon-info"></span></h5>
    <h2 class="text--gray1 text--500wt text-center mt-4">${text}</h2>`;
    const swalConfig = Swal.mixin(option);
    return this.alert(text, null, swalConfig);
  }

  warning(text: string): Promise<any> {
    const option = this.configBase();
    option.customClass['closeButton'] =
      'btn btn--circle float-right p-0 btn-color-close';
    option.customClass['confirmButton'] =
      'btn btn--md w-100 btn--red1 btn-min-with';
    option.confirmButtonText = 'Aceptar';
    option.html = `<h5 class="my-0 text--gray2 text--600wt d-block text--tittle_circle text--tittle_circle-xl
    text-center mx-auto danger" ng-reflect-klass="my-0 text--gray2 text--600wt d" ng-reflect-ng-class="danger">
    <span class="text--36pts text-center mx-auto icon-alert-triangle" ng-reflect-klass="text--36pts text-center
    mx-aut" ng-reflect-ng-class="icon-alert-triangle"></span></h5>
    <h2 class="text--gray1 text--500wt text-center mt-4">${text}</h2>`;
    const swalConfig = Swal.mixin(option);
    return this.alert(text, null, swalConfig);
  }

  error(text = 'Error en el proceso.', detail?: string): Promise<any> {
    const option = this.configBase();
    option.customClass['closeButton'] =
      'btn btn--circle float-right p-0 btn-color-close';
    option.customClass['confirmButton'] =
      'btn btn--md w-100 btn--red1 btn-min-with';

    option.html = `<h5 class="my-0 text--gray2 text--600wt d-block text--tittle_circle text--tittle_circle-xl
    text-center mx-auto danger" ng-reflect-klass="my-0 text--gray2 text--600wt d" ng-reflect-ng-class="danger">
    <span class="text--36pts text-center mx-auto icon-alert-triangle" ng-reflect-klass="text--36pts text-center
    mx-aut" ng-reflect-ng-class="icon-alert-triangle"></span></h5>
    <h2 class="text--gray1 text--500wt text-center mt-4">${text}</h2>`;

    if (detail) {
      option.html += `
      <div class="accordion" id="errorDetail" >
      <div>
      <div class="d-flex justify-content-center" id="detailError">
      <h5 class="mb-0">
      <button class="btn btn--gray2 collapsed" type="button" data-toggle="collapse" data-target="#collapseDetailError"
      aria-expanded="false" aria-controls="collapseDetailError">
      Ver más detalle
      </button>
      </h5>
      </div>
      <div id="collapseDetailError" class="p-3 collapse" aria-labelledby="detailError" data-parent="#errorDetail">
      <div class="text-left text--400wt text--gray1 text--10pts mb-3">
      ${detail}
      </div>
      </div>
      </div>
      </div>`;
    }
    const swalConfig = Swal.mixin(option);
    return this.alert(text, null, swalConfig);
  }

  // color
  confirm(text: string, type: string = 'info' || 'warning' || 'danger'): Promise<any> {
    let color: string;
    let icon: string;
    switch (type) {
      case 'warning':
        color = 'yellow';
        icon = 'icon-alert-triangle';
        break;
      case 'danger':
        color = 'red';
        icon = 'icon-alert-triangle';
        break;
      default:
        color = 'blue';
        icon = 'icon-info';
        break;
    }

    const option = this.configBase();
    option.customClass['closeButton'] =
      'btn btn--circle float-right p-0 btn-color-close';
    option.customClass['confirmButton'] =
      `btn btn--md btn--${color}1 btn-min-with mx-2`;
    option.customClass['cancelButton'] =
      'btn btn--md btn--gray2 btn-min-with mx-2';
    option.html = `<h5 class="my-0 text--gray2 text--600wt d-block text--tittle_circle text--tittle_circle-xl
      text-center mx-auto ${type} ${color} ${color}-icon span"
      ng-reflect-klass="my-0 text--gray2 text--600wt d" ng-reflect-ng-class="${color} ${type}"><span class="text--36pts text-center mx-auto ${icon}"
      ng-reflect-klass="text--36pts text-center mx-aut" ng-reflect-ng-class="${icon}"></span></h5>
      <h2 class="text--gray1 text--500wt text-center mt-4">${text}</h2>`;

    const swalConfig = Swal.mixin(option);
    return Promise.resolve(
      swalConfig.fire({
        text: text,
        type: null,
        showCancelButton: true,
        cancelButtonText:
          'Cancelar',
        confirmButtonText:
          'Aceptar',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(result => {
        return result.value;
      })
    );
  }

  /** NOTA: No usar este modal si el input es un textarea */
  input(title: string, text: string, control: 'text' | 'email' | 'password' | 'number' | 'tel' | 'range' | 'select' | 'radio' | 'checkbox' |
    'file' | 'url' | 'textarea', color?: string) {
    color = color != undefined && color != null ? color : 'blue';

    const option = this.configBase();
    option.customClass['closeButton'] = 'btn btn--circle float-right p-0 btn-color-close';
    option.customClass['confirmButton'] = `btn btn--md btn--${color}1 btn-min-with mx-2`;
    option.customClass['cancelButton'] = 'btn btn--md btn--grey btn-min-with mx-2';
    option.html = `<h4 class="text--gray1 text--500wt text-left">${text}</h4>`;
    const titulo = `<h2 class="text--gray1 text--500wt text-center">${title}</h2>`;

    const swalConfig = Swal.mixin(option);
    return Promise.resolve(
      swalConfig.fire({
        title: titulo,
        input: control,
        inputAttributes: {
          autocapitalize: 'off'
        },
        text: text,
        type: null,
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Si',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        preConfirm: (obs) => {
          if (obs === '') {
            this.translate.get('global.required', { campo: text }).subscribe((validateForm: string) => {
              Swal.showValidationMessage(validateForm);
            });
          }
        }
      }).then(result => {
        return result.value;
      })
    );
  }

  inputAnular(title: string, text: string, control: 'text' | 'email' | 'password' | 'number' | 'tel' | 'range' | 'select' | 'radio' | 'checkbox' |
    'file' | 'url' | 'textarea', color?: string) {
    color = color != undefined && color != null ? color : 'blue';

    const option = this.configBase();
    option.customClass['closeButton'] = 'btn btn--circle float-right p-0 btn-color-close';
    option.customClass['confirmButton'] = `btn btn--md btn--${color}1 btn-min-with mx-2`;
    option.customClass['cancelButton'] = `btn btn--md btn--${color}1 btn-min-with mx-2`;
    option.html = `<h1 class="text--gray1 text--400wt text-left">${text}</h2>`;
    const titulo = `<h1 class="text--gray1 text--500wt text-center">${title}</h2>`;

    const swalConfig = Swal.mixin(option);
    return Promise.resolve(
      swalConfig.fire({
        title: titulo,
        input: control,
        inputAttributes: {
          autocapitalize: 'off'
        },
        text: text,
        type: null,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Aceptar',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        preConfirm: (obs) => {
          if (obs === '') {
            this.translate.get('global.required', { campo: text }).subscribe((validateForm: string) => {
              Swal.showValidationMessage(validateForm);
            });
          }
          if (obs.length > 1000) {
            this.translate.get('asociado.protecciones.portafolio.movimientos.alerts.maxlenth', { campo: text }).subscribe((validateForm: string) => {
              Swal.showValidationMessage(validateForm);
            });
          }
        }
      }).then(result => {
        return result.value;
      })
    );
  }

  launch(title: string, text: string, fieldName: string, control: 'text' | 'email' | 'password' | 'number' | 'tel' | 'range' | 'select' | 'radio' | 'checkbox' |
    'file' | 'url', config?: { closeButton: string, confirmButton: string, cancelButton: string, html: string },
    placeholder?: string, options?: any) {

    const sweetAlertOptions = this.configBase();
    sweetAlertOptions.customClass['closeButton'] = config.closeButton;
    sweetAlertOptions.customClass['confirmButton'] = config.confirmButton;
    sweetAlertOptions.customClass['cancelButton'] = config.cancelButton;
    sweetAlertOptions.html = config.html;

    const titulo = `<h1 class="text--gray1 text--500wt text-center">${title}</h1>`;
    const swalConfig = Swal.mixin(sweetAlertOptions);
    return Promise.resolve(
      swalConfig.fire({
        title: titulo,
        input: control,
        inputPlaceholder: placeholder,
        inputOptions: options,
        inputAttributes: {
          autocapitalize: 'off'
        },
        text: text,
        type: null,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Guardar',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        preConfirm: (obs) => {
          if (obs === '') {
            this.translate.get('global.required', { campo: fieldName }).subscribe((validateForm: string) => {
              Swal.showValidationMessage(validateForm);
            });
          }
        }
      }).then(result => {
        return result.value;
      })
    );
  }

  close() {
    Swal.close();
  }
}
