import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedModule } from "./shared.module";

import { GlobalService } from "./services/global.service";

import { MenuComponent } from "./layouts/menu/menu.component";
import { SidebarComponent } from "./layouts/sidebar/sidebar.component";
import { PagesTopComponent } from "./layouts/pages-top/pages-top.component";
import { RightConfigComponent } from "./layouts/right-config/right-config.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule, HttpClientModule],
  providers: [GlobalService],
  declarations: [
    MenuComponent,
    SidebarComponent,
    PagesTopComponent,
    RightConfigComponent
  ],
  exports: [SidebarComponent, PagesTopComponent, RightConfigComponent]
})
export class LayoutModule {}
