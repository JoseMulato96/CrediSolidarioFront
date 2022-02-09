import { UserModel } from "./user-model";
import { MenuModel } from "./menu-model";
import { Section1Model } from "./section1-model";
import { Section2Model } from "./section2-model";
import { Section3Part1Model, Section3Part2Model } from "./section3-model";
import { Section4Model } from "./section4-model";
import { Section5Model } from "./section5-model";
import { Section6Model } from "./section6-model";
import { Section7Model } from "./section7-model";
import { Section8Model } from "./section8-model";
import { Section9Model } from "./section9-model";
import { Section10Model } from "./section10-model";
import { SectionFilesModel } from "./section-files-model";
import { PageModel } from "./page-model";
import { LockFieldsModel } from "./lock-fields-model";
import { LockSectionsModel } from "./lock-section-model";
import { SectionEncModel } from './section-enc-model';
import { SectionVerificaUsuarioModel } from "./section-verifica-usuario-model";

export class ZeroPaperModel {
  user: UserModel = new UserModel();
  menu: MenuModel[] = [];
  section1: Section1Model;
  section2: Section2Model;
  section3Part1: Section3Part1Model;
  section3Part2: Section3Part2Model;
  section4: Section4Model;
  section5: Section5Model;
  section6: Section6Model;
  section7: Section7Model;
  section8: Section8Model;
  section9: Section9Model;
  section10: Section10Model;
  sectionenc: SectionEncModel;
  sectionFiles: SectionFilesModel;
  lastPage: PageModel;
  sectionVerificaUsuario: SectionVerificaUsuarioModel;
  /**
   * Se le permite al rol de fuerza comercial ver el boton continuar
   */
  PCForceForCompleteForm: boolean;
  lockFields: LockFieldsModel = {};
  lockSection: LockSectionsModel = {};
  percent: string;
}
