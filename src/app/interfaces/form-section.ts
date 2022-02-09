import { BaseComponent } from "../shared/extends-components/base-component";

export interface IFormSection {
  Prev(): Promise<any>;
  Next(): Promise<any>;
  Save(): Promise<any>;
  Valid(): Promise<any>;
  Load(): Promise<any>;
  IsLockSection(components: BaseComponent[]);
}
