import { MimPersonaDetalleConfiguracion } from '@shared/components/mim-persona-detalle/mim-persona-detalle.component';


export class ActivarSolicitudesSuspendidasConfig {
    detalleEvento: MimPersonaDetalleConfiguracion = new MimPersonaDetalleConfiguracion();
    constructor() {
        this.detalleEvento.items = [
            {
                label: 'asociado.protecciones.portafolio.activarSolicitudesSuspendidas.personaDetalle.numeroSolicitud',
                key: 'idProceso'
            },
            {
                label: 'asociado.protecciones.portafolio.activarSolicitudesSuspendidas.personaDetalle.fechaSolicitud',
                key: 'fechaSolicitud'
            },
            {
                label: 'asociado.protecciones.portafolio.activarSolicitudesSuspendidas.personaDetalle.tipoSolicitud',
                key: 'mimTipoMovimiento.nombre'
            },
            {
                label: 'asociado.protecciones.portafolio.activarSolicitudesSuspendidas.personaDetalle.estadoSolicitud',
                key: 'mimEstadoVenta.nombre'
            },
            {
                label: 'asociado.protecciones.portafolio.activarSolicitudesSuspendidas.personaDetalle.producto',
                key: 'mimPlan.nombre'
            },
            {
                label: 'asociado.protecciones.portafolio.activarSolicitudesSuspendidas.personaDetalle.canalVenta',
                key: 'mimCanal.nombre'
            },
            {
                label: 'asociado.protecciones.portafolio.activarSolicitudesSuspendidas.personaDetalle.categoriaAsociado',
                key: 'asociado.tipoVin'
            },
            {
                label: 'asociado.protecciones.portafolio.activarSolicitudesSuspendidas.personaDetalle.oficinaVinculacion',
                key: 'asociado.desOficina'
            },
            {
                label: 'asociado.protecciones.portafolio.activarSolicitudesSuspendidas.personaDetalle.regional',
                key: 'asociado.regionalAso'
            },
        ];
    }
}
