import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ClubChatComponent } from './club-chat/club-chat.component';

const routes: Routes = [
  { path: '', component: ClubChatComponent }
];

@NgModule({
  declarations: [ClubChatComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)]
})
export class ClubsChatModule {}
