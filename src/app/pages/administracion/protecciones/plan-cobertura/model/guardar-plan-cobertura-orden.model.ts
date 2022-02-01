export class GuardarPlanCoberturaOrden {
  id?: string;
  parentId?: string;
  title?: string;
  label?: string;
  orden?: number;
  estado?: Estado;
  command?: (event?: any) => void;
  activeIndex?: number;
  items?: GuardarPlanCoberturaOrden[];

  constructor(objeto?: IGuardarPlanCoberturaOrden) {
    this.id = objeto && objeto.id || null;
    this.parentId = objeto && objeto.parentId || null;
    this.title = objeto && objeto.title || null;
    this.label = objeto && objeto.label || null;
    this.orden = objeto && objeto.orden || null;
    this.estado = objeto && objeto.estado || null;
    this.activeIndex = objeto && objeto.activeIndex || null;
    this.items = objeto && objeto.items || null;
  }
}

export interface IGuardarPlanCoberturaOrden {
  id?: string;
  parentId?: string;
  title?: string;
  label?: string;
  orden?: number;
  estado?: Estado;
  command?: (event?: any) => void;
  activeIndex?: number;
  items?: IGuardarPlanCoberturaOrden[];
}

export enum Estado {
  Guardado = 'guardado',
  Pendiente = 'pendiente'
}
