import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guard/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientProjectComponent } from './client-project/client-project.component';
import { ClientRuleAssignmentComponent } from './client-rule-assignment/client-rule-assignment.component';
import { PagesComponent } from './pages.component';
import { PermissionComponent } from './configuration/permission/permission.component';
import { ColorComponent } from './configuration/color/color.component';
import { ClientLeadComponent } from './client-lead/client-lead.component';
import { ClientLeadProfileComponent } from './client-lead-profile/client-lead-profile.component';
import { UsersComponent } from './users/users.component';
import { ClientMasterLeadComponent } from './client-master-lead/client-master-lead.component';
import { DashboardVendorComponent } from './dashboard-vendor/dashboard-vendor.component';
import { ClientListComponent } from './client-list/client-list.component';
import { CustomizePolicyComponent } from './configuration/customize-policy/customize-policy.component';
import { RegistrationListComponent } from './registration-list/registration-list.component';
import { CampaignListComponent } from './campaign/campaign-list.component';
import { VendorLogsComponent } from './vendor-logs/vendor-logs.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { CallReportComponent } from './call-report/call-report.component';
import { LeadReportComponent } from './lead-report/lead-report.component';
import { CreateLeadReportComponent } from './lead-report/create-report/create-report.component';
import { EditLeadReportComponent } from './lead-report/edit-report/edit-report.component';
import { ProjectInsightComponent } from './project-insight/project-insight.component';
import { LeadRequestComponent } from './lead-request/lead-request.component';
import { PersonaComponent } from './persona/persona.component';
import { BookingsComponent } from './bookings/bookings.component';
import { CsAdminGuard } from '../guard/cs-admin.guard';
import { WhatsappRulesComponent } from './whatsapp-rules/whatsapp-rules.component';
import { WhatsappRuleEntryComponent } from './whatsapp-rule-entry/whatsapp-rule-entry.component';
import { CreateWhatsappRuleEntryComponent } from './create-whatsapp-rule-entry/create-whatsapp-rule-entry.component';
import { EditWhatsappRuleEntryComponent } from './edit-whatsapp-rule-entry/edit-whatsapp-rule-entry.component';
import { SalesAccountComponent } from './sales-account/sales-account.component';
import { SalesAccountCreateModalComponent } from './sales-account/sales-account-create-modal/sales-account-create-modal.component';
import { CallLogsComponent } from './call-logs/call-logs.component';
import { UserListModalComponent } from './client-project/user-list-modal/user-list-modal.component';

const authRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivateChild:[CsAdminGuard],
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'dashboard-vendor', component: DashboardVendorComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'users', component: UsersComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'clients', component: ClientListComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      // For Client Routung Components
      { path: 'leads', component: ClientMasterLeadComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'project', component: ClientProjectComponent, pathMatch: 'full', canActivate: [AuthGuard] },

      { path: 'whatsapp-rules', component: WhatsappRulesComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'whatsapp-rule-entry', component: WhatsappRuleEntryComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'create-whatsapp-rule-entry', component: CreateWhatsappRuleEntryComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      {path:'edit-whatsapp-rule-entry',component:EditWhatsappRuleEntryComponent,pathMatch:'full',canActivate: [AuthGuard]},


      { path: 'audience-recommendation-engine/:id', component: ProjectInsightComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'new-client-project', component: LeadRequestComponent, pathMatch: 'full', canActivate: [AuthGuard] },

      { path: 'rules', component: ClientRuleAssignmentComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'project/leads', component: ClientLeadComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'project/leads/:id', component: ClientLeadComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'project/leads/profile/:id', component: ClientLeadProfileComponent, canActivate: [AuthGuard] },
      { path: 'registration', component: RegistrationListComponent, pathMatch: 'full', canActivate: [AuthGuard] },

      { path: 'vendors', component: VendorListComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'logs', component: VendorLogsComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'campaign', component: CampaignListComponent, pathMatch: 'full', canActivate: [AuthGuard] },

      { path: 'call-report', component: CallReportComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'lead-report', component: LeadReportComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'lead-report/create', component: CreateLeadReportComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'lead-report/edit', component: EditLeadReportComponent, pathMatch: 'full', canActivate: [AuthGuard] },

      //booking
      { path: 'bookings', component: BookingsComponent, pathMatch: 'full', canActivate: [AuthGuard]},

      // Sales Account

      { path: 'sales-account', component: SalesAccountComponent, pathMatch: 'full', canActivate: [AuthGuard]},
      { path: 'sales-account-create-modal', component: SalesAccountCreateModalComponent, pathMatch: 'full', canActivate: [AuthGuard]},

      //Call Logs

      { path: 'call-logs', component: CallLogsComponent, pathMatch: 'full', canActivate: [AuthGuard]},

      //users

      { path: 'users-list', component: UserListModalComponent, pathMatch: 'full', canActivate: [AuthGuard]},


      // System Configuration Pages
      { path: 'permission', component: PermissionComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'color', component: ColorComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'policy', component: CustomizePolicyComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'persona', component: PersonaComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      // Error Page
      { path: '**', redirectTo: '404' },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
