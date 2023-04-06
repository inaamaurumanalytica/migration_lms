import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { WithoutSideberComponent } from './without-sideber.component';

const routes: Routes =  [
  { path: '', component: WithoutSideberComponent, children: [     
      { path: 'lead/details/:id', component: LeadDetailsComponent, pathMatch: 'full', canActivate: [AuthGuard] },   
      // Error Page
      { path: '**', redirectTo: '404' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WithoutSidebarRoutingModule { }
