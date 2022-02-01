import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UrlRoute } from '@shared/static/urls/url-route';
import { AuthGuard } from '@core/guards';
import { PreloadSelectedModules } from '@core/guards/preload-selected-modules';

const routes: Routes = [
  {
    path: UrlRoute.PAGES,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard],
    data: {
      preload: true
    }
  },
  { path: UrlRoute.LOGIN, component: LoginComponent },
  { path: '', redirectTo: UrlRoute.PAGES, pathMatch: 'full' },
  { path: 'simulaciones', loadChildren: () => import('./pages/simulaciones/simulaciones.module').then(m => m.SimulacionesModule) },
  { path: '**', redirectTo: UrlRoute.PAGES }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadSelectedModules })],
  exports: [RouterModule],
  providers: [PreloadSelectedModules]
})
export class AppRoutingModule { }
