import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';
import { MimGridItemsConfig } from '@shared/components/mim-grid-items/mim-grid-items.config';

export class ResumenCoberturasVentaConfig {
  detalle: MimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();
  gridListar: MimGridItemsConfig = new MimGridItemsConfig();
  gridListarResumen: MimGridItemsConfig = new MimGridItemsConfig();
  gridListasRestrictivas: MimGridItemsConfig = new MimGridItemsConfig();

  constructor() {
    this.detalle.items = [
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.numeroVenta',
        key: 'codigo'
      },
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.fechaCotizacion',
        key: 'fechaSolicitud'
      },
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.nombre',
        key: 'asociado.nomCli'
      },
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.cedula',
        key: 'asociado.nitCli'
      },
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.fechaNacimiento',
        key: 'asociado.fecNac'
      },
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.correoEletronico',
        key: 'correoElectronico'
      },
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.tipoAsociado',
        key: 'asociado.tipoVin'
      },
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.canalVenta',
        key: 'mimCanal.nombre'
      },
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.ciudad',
        key: 'usuarioCreacionUserInfo.zone.description'
      },
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.regional',
        key: 'usuarioCreacionUserInfo.regional.description'
      },
      {
        label: 'asociado.protecciones.portafolio.resumen.misDatos.proyectoVida',
        key: 'mimProyectoVida.nombre'
      }
    ];

    this.gridListarResumen.borderLeft = true;
    this.gridListarResumen.columnas = [
      {
        configCelda: {
          tipo: 'icono',
          cssIcon: 'icon-shield text--white',
          color: 'mimPlanCobertura.mimCobertura.codigoColor'
        }
      },
      {
        titulo: 'shared.components.form.adminCoberturas.listarCoberturas.cobertura',
        key: 'mimPlanCobertura.nombre',
        configCelda: {
          classCss: 'col-5',
          tipo: 'text'
        }
      },
      {
        titulo: 'shared.components.form.adminCoberturas.listarCoberturas.proteccion',
        key: 'proValor',
        configCelda: {
          classCss: 'col text-center',
          tipo: 'currency'
        }
      },
      {
        titulo: 'shared.components.form.adminCoberturas.listarCoberturas.cuota',
        key: 'proCuota',
        configCelda: {
          classCss: 'col text-center',
          tipo: 'currency'
        }
      },
      {
        titulo: 'shared.components.form.adminCoberturas.listarCoberturas.factorContribucion',
        key: 'factorCodigo.valor',
        configCelda: {
          classCss: 'col text-center',
          tipo: 'number'
        }
      }

    ];

    this.gridListasRestrictivas.borderLeft = false;
    this.gridListasRestrictivas.columnas = [
      {
        titulo: 'asociado.protecciones.portafolio.resumen.listasRestrictivas.nombreLista',
        key: 'nombreLista',
        configCelda: {
          classCss: 'col-5',
          tipo: 'text'
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.resumen.listasRestrictivas.noLista',
        key: 'no',
        configCelda: {
          classCss: 'col text-center',
          tipo: 'text'
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.resumen.listasRestrictivas.idLista',
        key: 'idLista',
        configCelda: {
          classCss: 'col text-center',
          tipo: 'text'
        }
      },
      {
        titulo: 'asociado.protecciones.portafolio.resumen.listasRestrictivas.prioridad',
        key: 'prioridad',
        configCelda: {
          classCss: 'col text-center',
          tipo: 'number'
        }
      }
    ];
  }
}
