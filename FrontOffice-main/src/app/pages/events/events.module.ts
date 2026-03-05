import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';

import { EventsComponent } from './events.component';
import { EventLikeButtonComponent } from '../../components/event-like-button/event-like-button.component';

@NgModule({
  declarations: [
    EventsComponent,
    EventLikeButtonComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, CoreModule, SharedModule],
  exports: [EventsComponent, EventLikeButtonComponent],
})
export class EventsModule {}