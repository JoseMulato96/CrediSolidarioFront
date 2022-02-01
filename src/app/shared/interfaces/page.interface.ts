


export class Page<T> {
  public content: T[];
  public totalPages: number;
  public totalElements: number;
  public last: boolean;
  public size: number;
  public page: number;
  public numberOfElements: number;
  public first: boolean;
  public empty: boolean;
  public number: number;
  public additionalAttributes: any;

  constructor(objeto: IPage<T>) {
    this.content = objeto && objeto.content || null;
    this.totalPages = objeto && objeto.totalPages || null;
    this.totalElements = objeto && objeto.totalElements || null;
    this.last = objeto && objeto.last || null;
    this.size = objeto && objeto.size || null;
    this.page = objeto && objeto.page || null;
    this.numberOfElements = objeto && objeto.numberOfElements || null;
    this.first = objeto && objeto.first || null;
    this.empty = objeto && objeto.empty || null;
    this.number = objeto && objeto.number || null;
    this.additionalAttributes = objeto && objeto.additionalAttributes || null;

  }
}

export interface IPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  page: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
  number: number;
  additionalAttributes: any;
}
