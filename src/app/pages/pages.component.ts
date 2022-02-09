import { Component, ViewEncapsulation } from "@angular/core";
import { NotificationsAppService } from "../shared/services/notifications-app.service";
import { MainStore } from "../store/main-store";
import { Router } from "@angular/router";
import { AddressesUrlParams } from "../parameters/addresses-url-params";
import { AuthRefreshService } from "../shared/services/auth-refresh.service";
import { AuthenticationService } from "../services/authentication.service";
import { takeUntil, take } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import { timer } from "rxjs/observable/timer";
import { IResponseOautServer } from "../interfaces/response-oaut-server";
import { SAlertComponent } from "../shared/components/s-alert/s-alert.component";
import { BaseService } from "../services/base.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"]
})
export class PagesComponent {
  constructor(private notyApp: NotificationsAppService, public router: Router, public authRefresh: AuthRefreshService,
    public authServ: AuthenticationService) {
    this.notyApp.MenuItemClick.subscribe(x => {
      this.CheckIsNew(x);
    });
  }
  unsubscribe$: Subject<void> = new Subject();
  timerSubscription: Subscription;

  ngOnInit() {
    this.resetTimer();
    this.authRefresh.timerActionOccured.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.resetTimer();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    // this.timerSubscription && this.timerSubscription.
  }

  resetTimer() {
    const interval = 1000;
    const duration = this.authRefresh.GetTimeRefresh() * 60;
    this.timerSubscription = timer(0, interval).pipe(
      take(duration)
    ).subscribe(value => {
      // console.log("reloj: ", value, duration)
    },
      err => { },
      () => {
        this.authServ.RefreshToken().
          then((response: IResponseOautServer) => {
            if (response.error == "unauthorized") {
              return SAlertComponent.AlertError(response.error_description);
            }
            BaseService.SetToken(response.access_token);
            BaseService.SetRefreshToken(response.refresh_token);
            this.resetTimer()

          }).catch((error) => { })

      }
    )
  }
  /**
   * @author Jorge Luis Caviedes Alvarador
   * @description valida si han dado click a crear una nueva solicitu y borrar el cache
   * @param item
   */
  CheckIsNew(item) {
    if (item.key == "create") {
      let url = AddressesUrlParams.PathSectionForm(
        AddressesUrlParams.SECTION_VERIFIC_USUARIO,
        AddressesUrlParams.PAGES_FORM
      );
      this.router.navigateByUrl(AddressesUrlParams.PathIndex()).then(() => {
        MainStore.db.RestSections();
        this.router.navigateByUrl(url);
      });
    }
  }
}
