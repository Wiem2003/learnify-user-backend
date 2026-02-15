import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../../components/components-module';
import { GetStartedModalComponent } from '../../components/get-started-modal/get-started-modal.component';
import { CoreModule } from '../../core/core.module';


@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    CommonModule,
    ComponentsModule,
    CoreModule      // AJOUT ICI

  ],

  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild('modal') modal!: GetStartedModalComponent;

  openModal() {
    this.modal.open();
  }
}
