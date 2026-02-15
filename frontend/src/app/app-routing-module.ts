import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './frontoffice/home/home';

const routes: Routes = [
  { path: '', component: Home },
   // Backoffice
  {
    path: 'backoffice',
    loadChildren: () =>
      import('./backoffice/backoffice-module').then(m => m.BackofficeModule)
  },

   {
    path: 'client',
    loadChildren: () =>
      import('./client-template/client-template-module')
        .then(m => m.ClientTemplateModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
