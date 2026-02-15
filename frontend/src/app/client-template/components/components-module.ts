import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { HeroComponent } from './hero/hero.component';
import { PricingComponent } from './pricing/pricing.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { CoursesComponent } from './courses/courses.component';
import { MentorComponent } from './mentor/mentor.component';
import { GroupComponent } from './group/group.component';
import { GetStartedModalComponent } from './get-started-modal/get-started-modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HeroComponent,
    PricingComponent,
    TestimonialsComponent,
    CoursesComponent,
    MentorComponent,
    GroupComponent,
    GetStartedModalComponent
  ],
  exports: [
   
    HeroComponent,
    PricingComponent,
    TestimonialsComponent,
    CoursesComponent,
    MentorComponent,
    GroupComponent,
    GetStartedModalComponent
  ]
})
export class ComponentsModule { }
