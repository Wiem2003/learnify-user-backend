import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { CoursesModule } from './courses/courses.module';
import { FeaturesModule } from './features/features.module';
import { EventsModule } from './pages/events/events.module';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    HttpClientModule, 
    FormsModule,
    CoreModule, 
    HomeModule, 
    CoursesModule, 
    FeaturesModule,
    EventsModule,
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
