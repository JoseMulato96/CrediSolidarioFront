import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormValidate } from '@shared/util';
import { AlertService, AuthenticationService } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { masksPatterns } from '@shared/util/masks.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent extends FormValidate implements OnInit {
  form: FormGroup;
  returnUrl: string;
  shown = false;
  shownText: any = 'icon-preview';
  patterns = masksPatterns;
  mostrarBotonCargando: boolean;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: AuthenticationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly alertService: AlertService,
    private readonly translate: TranslateService) {
    super();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: [null, [Validators.required]],
      password: [null, Validators.required]
    });

    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/pages/inicio';
    this.auth.logout();
  }

  /**
   * @description Muestra o esconde la contraseña.
   * @return null
   */
  mostrarContrasenia() {
    this.shown = !this.shown;
    const demoTrigger = document.querySelector('.input-password');
    if (this.shown) {
      this.shownText = 'icon-eye-off';
      demoTrigger.setAttribute('type', 'text');
    } else {
      this.shownText = 'icon-preview';
      demoTrigger.setAttribute('type', 'password');
    }
  }

  /**
   * @description Ejecuta el inicio de sesión.
   * @return null
   */
  login() {
    if (this.form.invalid) {
      this.validateForm(this.form);
      this.translate.get('global.validateForm').subscribe((response: string) => {
        this.alertService.info(response);
      });
      return;
    }
    this.mostrarBotonCargando = true;
    this._bloquearForm(true);
    this.auth.login(this.form.value).subscribe(
      (data: any) => {
        this.mostrarBotonCargando = false;
        this._bloquearForm(false);
        this.router.navigate([this.returnUrl]);
      },
      (err: any) => {
        this.mostrarBotonCargando = false;
        this._bloquearForm(false);
        if (err.status === 0) {
          this.translate.get('security.logIn.servicioNoDisponible').subscribe((response: string) => {
            this.alertService.error(response);
          });
        } else {
          this.alertService.error(err.error.description);
        }
      }
    );
  }

  _bloquearForm(estado: boolean) {
    if (estado) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
}
