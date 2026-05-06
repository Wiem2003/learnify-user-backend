import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PreevaluationComponent } from './preevaluation.component';
import { PreevaluationShellComponent } from './preevaluation-shell.component';
import { PreevaluationIntroComponent } from './preevaluation-intro.component';
import { PreevaluationProfileComponent } from './preevaluation-profile.component';
import { PreevaluationTestComponent } from './preevaluation-test.component';
import { PreevaluationResultComponent } from './preevaluation-result.component';
import { PreevaluationCheatingTerminatedComponent } from './preevaluation-cheating-terminated.component';
import { ComponentsModule } from '../../components/components.module';

const routes = [
  {
    path: '',
    component: PreevaluationShellComponent,
    children: [
      { path: '', redirectTo: 'intro', pathMatch: 'full' as const },
      { path: 'intro', component: PreevaluationIntroComponent },
      { path: 'profile', component: PreevaluationProfileComponent },
      { path: 'test', component: PreevaluationTestComponent },
      { path: 'result', component: PreevaluationResultComponent },
      { path: 'cheating-terminated', component: PreevaluationCheatingTerminatedComponent },
    ]
  }
];

@NgModule({
  declarations: [
    PreevaluationComponent,
    PreevaluationShellComponent,
    PreevaluationIntroComponent,
    PreevaluationProfileComponent,
    PreevaluationTestComponent,
    PreevaluationResultComponent,
    PreevaluationCheatingTerminatedComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ]
})
export class PreevaluationModule {}
