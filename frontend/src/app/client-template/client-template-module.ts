import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesModule } from './pages/pages-module';
import { ComponentsModule } from './components/components-module';
import { CoreModule } from './core/core.module';
import { ClientTemplateRoutingModule } from './client-template-routing-module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ComponentsModule,
    PagesModule,
    ClientTemplateRoutingModule
  ]
})
export class ClientTemplateModule { }
