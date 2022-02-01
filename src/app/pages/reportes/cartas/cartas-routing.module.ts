import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartasComponent } from './cartas.component';
import { ListarCartasComponent } from './listar-cartas/listar-cartas.component';

const routes: Routes = [
  {
    path: '',
    component: CartasComponent,
    children: [
      {
        path: '',
        component: ListarCartasComponent
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartasRoutingModule { }
