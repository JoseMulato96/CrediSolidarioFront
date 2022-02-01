import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-datos-asociado-detalle',
  templateUrl: './datos-asociado-detalle.component.html'
})
export class DatosAsociadoDetalleComponent implements OnInit {
  // VARIABLES
  form: FormGroup;

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.validateFormRegistro();
  }

  // VALIDAR FORMULARIO
  validateFormRegistro() {
    this.form = new FormGroup({
      editarDatosAsoPrimerNombre: new FormControl(),
      editarDatosAsoSegundoNombre: new FormControl(),
      editarDatosAsoPrimerApellido: new FormControl(),
      editarDatosAsoSegundoApellido: new FormControl(),
      editarDatosAsoEstadoCivil: new FormControl(),
      editarDatosAsoProfesion: new FormControl(),
      editarDatosAsoDireccion: new FormControl(),
      editarDatosAsoBarrio: new FormControl(),
      editarDatosAsoCiudad: new FormControl(),
      editarDatosAsoCorrespondencia: new FormControl(),
      editarDatosAsoCorreo: new FormControl(),
      editarDatosAsoTelefono: new FormControl(),
      editarDatosAsoExtension: new FormControl(),
      editarDatosAsoCelular: new FormControl(),
      editarDatosAsoDireccionLaboral: new FormControl(),
      editarDatosAsoBarrioLaboral: new FormControl(),
      editarDatosAsoCiudadLaboral: new FormControl(),
      editarDatosAsoTelefonoLaboral: new FormControl(),
      editarDatosAsoExtensionLaboral: new FormControl(),
      editarDatosAsoApartadoAereo: new FormControl(),
      editarDatosAsoCiudadAereo: new FormControl(),
      editarDatosAsoCasilleroAereo: new FormControl()
    });
  }

  formDatosAsoDetalle() {
    if (this.form.valid) {
      this.router.navigate(['/pages', 'inicio']);
    } else {
      this.form.controls['formBucarAsociadosID'].markAsTouched();
      return false;
    }
  }
}
