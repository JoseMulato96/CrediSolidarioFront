import { HttpClient } from "@angular/common/http";
import { BaseStore } from "../extends/base-store";
import { AcademicLevelStore } from "./academic-level-store";
import { BeneficiaryPlanStore } from "./beneficiary-plan-store";
import { TypeChannelStore } from "./type-channel-store";
import { CIIUStore } from "./ciiu-store";
import { ConfirmeStore } from "./confirme-store";
import { EntityBankStore } from "./entity-bank-store";
import { OcupationStore } from "./ocupation-store";
import { PerseverancePlanStore } from "./perseverance-plan-store";

import { RelationshipStore, RelationshipStoreFa } from "./relationship-store";
import { StateAccountStore } from "./state-account-store";
import { TerritoryStore } from "./territory-store";
import { TypeAccountStore } from "./type-account-store";
import { TypeDocumentStore } from "./type-document-store";
import { TypeGenderStore } from "./type-gender-store";
import { TypeMoneyStore } from "./type-money-store";
import { TypeProductStore } from "./type-product-store";
import { TypeReferentStore } from "./type-referent-store";
import { TypeTransactionStore } from "./type-transaction-store";
import { ViculacionStore } from "./viculacion-store";
import { WorkActivityStore } from "./work-activity-store";
import {
  AddressTypeRoadStore,
  AddressTypeZoneStore,
  AddressTypeInsideStore,
  AddressTypeInmueblesStore
} from "./address-type-road-store";
import { OfficesStore } from "./offices-store";
import { TypeContractStore } from "./type-contract-store";
import { TitlesStore } from "./titles-store";
import { InstitutionsStore } from "./institutions-store";
import { TypeBeneficiaryStore } from "./type-beneficiary-store";
import { AgentsStore } from "./agents-store";
import { ChargesPublicStore } from "./charges-public-store";
import { SocialNetworkStore } from "./social-network-store";
import { CortesStore } from "./cortes-store";
import { AportaCartaStore } from "./aporta-carta-store";

export class ListOfStore {
  private static store = {
    ChargesPublicStore,
    AgentsStore,
    TypeBeneficiaryStore,
    TitlesStore,
    InstitutionsStore,
    AcademicLevelStore,
    TypeDocumentStore,
    TypeProductStore,
    BeneficiaryPlanStore,
    PerseverancePlanStore,
    TypeGenderStore,
    TypeReferentStore,
    TypeChannelStore,
    RelationshipStore,
    TerritoryStore,
    TypeTransactionStore,
    ConfirmeStore,
    TypeAccountStore,
    TypeMoneyStore,
    WorkActivityStore,
    OcupationStore,
    CIIUStore,
    ViculacionStore,
    EntityBankStore,
    StateAccountStore,
    AddressTypeRoadStore,
    AddressTypeZoneStore,
    TypeContractStore,
    AddressTypeInsideStore,
    AddressTypeInmueblesStore,
    OfficesStore,
    SocialNetworkStore,
    RelationshipStoreFa,
    CortesStore,
    AportaCartaStore
  };
  private static instances: BaseStore[] = [];

  /**
   * r
   * @description obtiene en la lista las clases de almacenamiento para que los componente solicite el servicio y obtenga el contenido
   * @param nameStore
   * @param http
   */
  public static GetStore(nameStore: string, http?: HttpClient): BaseStore {
    this.instances[nameStore] =
      this.instances[nameStore] || new this.store[nameStore](http);
    return this.instances[nameStore];
  }
}
