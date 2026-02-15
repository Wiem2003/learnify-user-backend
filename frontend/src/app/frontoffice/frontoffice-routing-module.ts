import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Home } from './home/home';
import { StudentAccess } from './student-access/student-access';
import { CandidateAccess } from './candidate-access/candidate-access';
import { TutorAccess } from './tutor-access/tutor-access';
import { AdminAccess } from './admin-access/admin-access';

const routes: Routes = [

  { path: '', component: Home },

  {
    path: 'auth',
    loadChildren: () =>
    import('../user-management/user-management-module')
        .then(m => m.UserManagementModule)
  },

  { path: 'student', component: StudentAccess },
  { path: 'candidate', component: CandidateAccess },
  { path: 'tutor', component: TutorAccess },
  { path: 'admin', component: AdminAccess }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { }
