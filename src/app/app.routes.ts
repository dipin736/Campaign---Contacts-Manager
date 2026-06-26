import { Routes } from '@angular/router';
import { MessageComposerComponent } from './pages/message-composer/message-composer.component';
import { ContactManagerComponent } from './pages/contact-manager/contact-manager.component';

export const routes: Routes = [
  { path: '', redirectTo: 'message-composer', pathMatch: 'full' },
  { path: 'message-composer', component: MessageComposerComponent },

  { path: '**', redirectTo: 'message-composer' }
];
