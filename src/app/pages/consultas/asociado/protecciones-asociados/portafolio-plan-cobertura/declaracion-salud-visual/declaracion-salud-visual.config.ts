import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';


export class DeclaracionSaludVisualConfig {
    detalleEvento: MimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();
    constructor() {
        this.detalleEvento.items = [
            {
                label: 'eventos.consulta.detalleDatosEvento.noEvento',
                key: 'codigo'
            },
            {
                label: 'eventos.consulta.detalleDatosEvento.fechaSolicitud',
                key: 'fechaSolicitud'
            },
            {
                label: 'Nombre',
                key: 'asociado.nomCli'
            },
            {
                label: 'Cédula',
                key: 'asociado.nitCli'
            },
            {
                label: 'Correo electronico',
                key: 'correoElectronico'
            },
            {
                label: 'Datos del asociado',
                key: 'fechaSolicitud'
            },
            {
                label: 'Categoría del asociado',
                key: 'mimEvento.nombre'
            },
            {
                label: 'Nivel de riesgo ingreso',
                key: 'mimEstadoSolicitudEvento.nombre'
            },
            {
                label: 'Canal de venta',
                key: 'mimCanal.nombre'
            },
            {
                label: 'Oficina de vinculación',
                key: 'usuarioCreacionUserInfo.zone.description'
            },
            {
                label: 'Regional',
                key: 'usuarioCreacionUserInfo.regional.description'
            },
            {
                label: 'Proyecto de vida',
                key: 'mimProyectoVida.nombre'
            }
        ];
    }
}
