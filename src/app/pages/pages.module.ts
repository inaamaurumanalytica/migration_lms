import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PapaParseModule } from 'ngx-papaparse'
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClipboardModule } from 'ngx-clipboard';
import { ImageCropperModule } from 'ngx-image-cropper';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import {
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCheckboxModule,
  MatRippleModule,
  MatButtonToggleModule,
  MatSnackBarModule,
  MatDialogModule,
  MatPaginatorModule,
  MatTabsModule,
  MatFormFieldModule,
  MatStepperModule,
  MatSelectModule,
  MatTableModule,
  MatRadioModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatBadgeModule,
  MatChipsModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatProgressBarModule,
  MatAutocompleteModule
} from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardVendorComponent } from './dashboard-vendor/dashboard-vendor.component';
import { PagesComponent } from './pages.component';
import { PageRoutingModule } from './pages.routing';
import { MainNavComponent } from '../main-nav/main-nav.component';

// User Page
import { UsersComponent } from './users/users.component';
import { UserCreateModalComponent } from './users/user-create-modal/user-create-modal.component';
import { PermissionModalComponent } from './users/permission-modal/permission-modal.component';

// Project Pages
import { ClientProjectComponent } from './client-project/client-project.component';
import { ClientProjectCreateModalComponent } from './client-project/client-project-create-modal/client-project-create-modal.component';
import { ClientProjectEditModalComponent } from './client-project/client-project-edit-modal/client-project-edit-modal.component';
import { ClientProjectDeleteModalComponent } from './client-project/client-project-delete-modal/client-project-delete-modal.component';
import { ClientProjectInfoModalComponent } from './client-project/client-project-info-modal/client-project-info-modal.component';
import { ClientProjectBrochuerModalComponent } from './client-project/client-project-brochuer-modal/client-project-brochuer-modal.component';
import { ProjectStatusModalComponent } from './client-project/project-status-modal/project-status-modal.component';
import { DeleteProjectStatusModalComponent } from './client-project/delete-project-status-modal/delete-project-status-modal.component';



// Permission
import { PermissionComponent } from './configuration/permission/permission.component';
import { PermissionAddModalComponent } from './configuration/permission/permission-add-modal/permission-add-modal.component';

// Color
import { ColorComponent } from './configuration/color/color.component';
import { ColorCreateModalComponent } from './configuration/color/color-create-modal/color-create-modal.component';
import { ColorDeleteModalComponent } from './configuration/color/color-delete-modal/color-delete-modal.component';
import { ColorEditModalComponent } from './configuration/color/color-edit-modal/color-edit-modal.component';

// Client Leads
import { ClientLeadComponent } from './client-lead/client-lead.component';
import { ClientRemarkModalComponent } from './client-lead/client-remark-modal/client-remark-modal.component';
import { ClientLeadCreateModalComponent } from './client-lead/client-lead-create-modal/client-lead-create-modal.component';
import { ClientLeadEditModalComponent } from './client-lead/client-lead-edit-modal/client-lead-edit-modal.component';
import { ClientLeadFilterModalComponent } from './client-lead/client-lead-filter-modal/client-lead-filter-modal.component';
import { ClientLeadInfoModalComponent } from './client-lead/client-lead-info-modal/client-lead-info-modal.component';
import { ClientUploadModalComponent } from './client-lead/client-upload-modal/client-upload-modal.component';
import { ClientExportLeadModalComponent } from './client-lead/client-export-lead-modal/client-export-lead-modal.component';
import { ClientLeadDeleteModalComponent } from './client-lead/client-lead-delete-modal/client-lead-delete-modal.component';
import { ClientLeadWebhookCreateModalComponent } from './client-lead/client-lead-webhook-create-modal/client-lead-webhook-create-modal.component';
import { ClientAssignLeadModalComponent } from './client-lead/client-assign-lead-modal/client-assign-lead-modal.component';
import { ClientLeadTransferModalComponent } from './client-lead/client-lead-transfer-modal/client-lead-transfer-modal.component';
import { ClientWebhookDeleteModalComponent } from './client-lead/client-webhook-delete-modal/client-webhook-delete-modal.component'
import { CreateMeetingModalComponent } from './client-lead/create-meeting-modal/create-meeting-modal.component'
// Client Lead Profile Pages
import { ClientLeadProfileComponent } from './client-lead-profile/client-lead-profile.component';
import { ClientLeadProfileTaskCreateModalComponent } from './client-lead-profile/client-lead-profile-task-create-modal/client-lead-profile-task-create-modal.component';
import { ClientLeadProfileNoteCreateModalComponent } from './client-lead-profile/client-lead-profile-note-create-modal/client-lead-profile-note-create-modal.component';
import { ClientLeadAddressCreateModalComponent } from './client-lead-profile/client-lead-address-create-modal/client-lead-address-create-modal.component';
import { ClientLeadAddressEditModalComponent } from './client-lead-profile/client-lead-address-edit-modal/client-lead-address-edit-modal.component';
import { ClientLeadEmailCreateModalComponent } from './client-lead-profile/client-lead-email-create-modal/client-lead-email-create-modal.component';
import { ClientLeadAttachmentCreateModalComponent } from './client-lead-profile/client-lead-attachment-create-modal/client-lead-attachment-create-modal.component';
import { ClientLeadProfileEditModalComponent } from './client-lead-profile/client-lead-profile-task-edit-modal/client-lead-profile-task-edit-modal.component';
import { ClientLeadProfileNoteEditModalComponent } from './client-lead-profile/client-lead-profile-note-edit-modal/client-lead-profile-note-edit-modal.component';
import { ClientTaskMarkDoneModalComponent } from './client-lead-profile/client-task-mark-done-modal/client-task-mark-done-modal.component';
import { ClientTaskDeleteModalComponent } from './client-lead-profile/client-task-delete-modal/client-task-delete-modal.component';
import { ClientNoteDeleteModalComponent } from './client-lead-profile/client-note-delete-modal/client-note-delete-modal.component';
import { ClientAddressDeleteModalComponent } from './client-lead-profile/client-address-delete-modal/client-address-delete-modal.component';
import { ClientDocumentDeleteModalComponent } from './client-lead-profile/client-document-delete-modal/client-document-delete-modal.component';
import { ClientEditProfileModalComponent } from './client-lead-profile/client-edit-profile-modal/client-edit-profile-modal.component';
import { PreviewNumberModalComponent } from './client-lead/preview-number-modal/preview-number-modal.component';

// CLient Rule assignmengt
import { ClientRuleAssignmentComponent } from './client-rule-assignment/client-rule-assignment.component';
import { ClientRuleAssignmentCreateModalComponent } from './client-rule-assignment/client-rule-assignment-create-modal/client-rule-assignment-create-modal.component';
import { ClientRuleEntryModalComponent } from './client-rule-assignment/client-rule-entry-modal/client-rule-entry-modal.component';
import { ClientCreateRuleEntryModalComponent } from './client-rule-assignment/client-create-rule-entry-modal/client-create-rule-entry-modal.component';
import { ClientEditRuleEntryModalComponent } from './client-rule-assignment/client-edit-rule-entry-modal/client-edit-rule-entry-modal.component';
import { ClientAssignmentDeleteModalComponent } from './client-rule-assignment/client-assignment-delete-modal/client-assignment-delete-modal.component';
import { ClientRuleEntryDeleteModalComponent } from './client-rule-assignment/client-rule-entry-delete-modal/client-rule-entry-delete-modal.component';

//Whatsapp Rule

import { CreateWhatsappRulesComponent } from './create-whatsapp-rules/create-whatsapp-rules.component';
import { WhatsappRuleEntryComponent } from './whatsapp-rule-entry/whatsapp-rule-entry.component';
import { EditWhatsappRuleEntryComponent } from './edit-whatsapp-rule-entry/edit-whatsapp-rule-entry.component';

///

import { HighchartsChartModule } from 'highcharts-angular';
import { FlexLayoutModule } from '@angular/flex-layout'
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxTinymceModule } from 'ngx-tinymce'

import { ClientLeadFailedModalComponent } from './client-lead/client-lead-failed-modal/client-lead-failed-modal.component';
import { ClientMasterLeadComponent } from './client-master-lead/client-master-lead.component';
import { LeadUpdatedToVerifiedStatusModalComponent } from './client-master-lead/lead-updated-to-verified-status-modal/lead-updated-to-verified-status-modal.component'
import { UserInfoModalComponent } from './users/user-info-modal/user-info-modal.component';

import { ClientListComponent } from './client-list/client-list.component';
import { CustomizePolicyComponent } from './configuration/customize-policy/customize-policy.component';
import { CustomizePolicyAddModalComponent } from './configuration/customize-policy/customize-policy-add-modal/customize-policy-add-modal.component';
import { CustomizePolicyModalInfoComponent } from './configuration/customize-policy/customize-policy-modal-info/customize-policy-modal-info.component';
import { UserTokenComponent } from './users/user-token/user-token.component';
import { UserAssignProjectComponent } from './users/user-assign-project/user-assign-project.component';
import { ClientCreateModalComponent } from './client-list/client-create-modal/client-create-modal.component';
import { ClientInfoModalComponent } from './client-list/client-info-modal/client-info-modal.component';
import { VendorAssignModelComponent } from './client-list/vendor-assign-model/vendor-assign-model.component';
import { ClientEditModalComponent } from './client-list/client-edit-modal/client-edit-modal.component';
import { ProjectEmailNotifyModalComponent } from './client-project/project-email-notify-modal/project-email-notify-modal.component';
import { RegistrationCreateModalComponent } from './registration-list/registration-create-modal/registration-create-modal.component';
import { RegistrationListComponent } from './registration-list/registration-list.component';
import { RegistrationFilterModalComponent } from './registration-list/registration-filter-modal/registration-filter-modal.component';
import { LeadListModalComponent } from './dashboard/lead-list-modal/lead-list-modal.component';
import { ProjectUploadAvatarModalComponent } from './client-project/project-upload-avatar-modal/project-upload-avatar-modal.component';
import { ClientProjectQualifiedModalComponent } from './client-project/client-project-qualified-modal/client-project-qualified-modal.component';
import { ProjectFeedbackModalComponent } from './client-project/project-feedback-modal/project-feedback-modal.component';

import { CampaignListComponent } from './campaign/campaign-list.component'
import { CampaignCreateModalComponent } from './campaign/campaign-create-modal/campaign-create-modal.component';
import { CopyLeadModalComponent } from './client-lead/copy-lead-modal/copy-lead-modal.component';
import { SetLeadColorModalComponent } from './client-lead/set-lead-color-modal/set-lead-color-modal.component';
import { AppointmentModalComponent } from './client-lead/appointment-modal/appointment-modal.component';
import { LeadVndorUpdatedModalComponent } from './client-master-lead/lead-vendor-updated-modal/lead-vendor-updated-modal.component';
import { ConfirmLeadModalComponent } from './client-lead/confirm-lead-modal/confirm-lead-modal.component';
import { CallsListModalComponent } from './client-lead/calls-list-modal/calls-list-modal.component';
import { CopyMultipleLeadModalComponent } from './client-lead/copy-multiple-lead-modal/copy-multiple-lead-modal.component';
import { AdminProjectModalComponent } from './client-lead/admin-project-modal/admin-project-modal.component';
import { AdminClientProjectModalComponent } from './client-lead/admin-client-project-modal/admin-client-project-modal.component';
import { MakeCallComponent } from './client-lead/make-call/make-call.component';
import { DashboardFilterModalComponent } from './dashboard-vendor/dashboard-filter-modal/dashboard-filter-modal.component';
import { VendorLogsComponent } from './vendor-logs/vendor-logs.component';
import { VendorLogsFilterModalComponent } from './vendor-logs/vendor-logs-filter-modal/vendor-logs-filter-modal.component';
import { AuditLogInfoComponent } from './vendor-logs/audit-log-info/audit-log-info.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorCreateModalComponent } from './vendor-list/vendor-create-modal/vendor-create-modal.component';
import { VendorEditModalComponent } from './vendor-list/vendor-edit-modal/vendor-edit-modal.component';
import { VendorInfoModalComponent } from './vendor-list/vendor-info-modal/vendor-info-modal.component';
import { ClientAssignModelComponent } from './vendor-list/client-assign-model/client-assign-model.component';
import { UserEditModalComponent } from './users/user-edit-modal/user-edit-modal.component';
import { UserProfileModalComponent } from './users/user-profile-modal/user-profile-modal.component';
import { CallReportComponent } from './call-report/call-report.component';
import { LeadReportComponent } from './lead-report/lead-report.component';
import { LeadReportDeleteModalComponent } from './lead-report/lead-report-delete-modal/lead-report-delete-modal.component';
import { CreateLeadReportComponent } from './lead-report/create-report/create-report.component';

import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { EditLeadReportComponent } from './lead-report/edit-report/edit-report.component';
import { UserFilterModalComponent } from './users/user-filter-modal/user-filter-modal.component';
import { ProjectFilterModalComponent } from './client-project/project-filter-modal/project-filter-modal.component';
import { ClientFilterModalComponent } from './client-list/client-filter-modal/client-filter-modal.component';
import { VendorFilterModalComponent } from './vendor-list/vendor-filter-modal/vendor-filter-modal.component';
import { WebhookByProjectComponent } from './client-lead/webhook-by-project/webhook-by-project.component';
import { WebhookCopyComponent } from './client-lead/webhook-copy/webhook-copy.component';
import { LeadDuplicateInfoComponent } from './client-lead/lead-duplicate-info/lead-duplicate-info.component';
import { ProjectInsightComponent } from './project-insight/project-insight.component';
import { LeadRequestComponent } from './lead-request/lead-request.component';
import { ClientProjectStatsModalComponent } from './client-project/client-project-stats-modal/client-project-stats-modal.component';
import { PersonaComponent } from './persona/persona.component';

// booking
import { BookingsComponent } from './bookings/bookings.component';
import { CreateBookingModalComponent } from './bookings/create-booking-modal/create-booking-modal.component';
import { DeleteBookingModalComponent } from './bookings/delete-booking-modal/delete-booking-modal.component';
import { BookingFilterModalComponent } from './bookings/booking-filter-modal/booking-filter-modal.component';
import { LeadSendMiModalComponent } from './client-project/lead-send-mi-modal/lead-send-mi-modal.component';
import { ProjectMediaPlanComponent } from './client-project/project-media-plan/project-media-plan.component';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { WhatsappProfileModalComponent } from './whatsapp-profile-modal/whatsapp-profile-modal.component';
import { ClientListProjectModalComponent } from './client-list/client-list-project-modal/client-list-project-modal.component';
import { WhatsappRulesComponent } from './whatsapp-rules/whatsapp-rules.component';
import { CreateWhatsappRuleEntryComponent } from './create-whatsapp-rule-entry/create-whatsapp-rule-entry.component';

// Sales Account

import { SalesAccountComponent } from './sales-account/sales-account.component';
import { SalesAccountCreateModalComponent } from './sales-account/sales-account-create-modal/sales-account-create-modal.component';
import { AssignUserComponent } from './sales-account/assign-user/assign-user.component';
import { AssignProjectComponent } from './sales-account/assign-project/assign-project.component';


//Call Logs

import { CallLogsComponent } from './call-logs/call-logs.component';
import { UserListModalComponent } from './client-project/user-list-modal/user-list-modal.component';




@NgModule({
  declarations: [
    DashboardComponent,
    LeadListModalComponent,
    DashboardVendorComponent,
    DashboardFilterModalComponent,
    MainNavComponent,
    PagesComponent,

    // User Component
    UsersComponent,
    UserCreateModalComponent,
    UserInfoModalComponent,
    UserAssignProjectComponent,
    UserTokenComponent,
    PermissionModalComponent,
    UserEditModalComponent,
    UserProfileModalComponent,
    UserFilterModalComponent,

    // Permission Configuration Component
    PermissionComponent,
    PermissionAddModalComponent,

    CampaignListComponent,
    CampaignCreateModalComponent,

    // Color Configuration Component
    ColorComponent,
    ColorCreateModalComponent,
    ColorDeleteModalComponent,
    ColorEditModalComponent,

    // Color Configuration Component
    CustomizePolicyComponent,
    CustomizePolicyAddModalComponent,
    CustomizePolicyModalInfoComponent,

    // Client List
    ClientListComponent,
    VendorAssignModelComponent,
    ClientCreateModalComponent,
    ClientEditModalComponent,
    ClientInfoModalComponent,
    ClientFilterModalComponent,

    // Client Project Component
    ClientProjectComponent,
    ClientProjectCreateModalComponent,
    ClientProjectDeleteModalComponent,
    ClientProjectEditModalComponent,
    ClientProjectInfoModalComponent,
    ClientProjectBrochuerModalComponent,
    ProjectEmailNotifyModalComponent,
    ProjectUploadAvatarModalComponent,
    ClientProjectQualifiedModalComponent,
    ProjectFeedbackModalComponent,
    ProjectFilterModalComponent,
    ClientProjectStatsModalComponent,
    ProjectStatusModalComponent,
    DeleteProjectStatusModalComponent,
    ClientProjectInfoModalComponent,
    // Client Lead Component
    ClientMasterLeadComponent,
    ClientLeadComponent,
    ClientLeadCreateModalComponent,
    ClientLeadEditModalComponent,
    ClientLeadFilterModalComponent,
    ClientLeadInfoModalComponent,
    ClientRemarkModalComponent,
    ClientUploadModalComponent,
    ClientExportLeadModalComponent,
    ClientLeadDeleteModalComponent,
    ClientAssignLeadModalComponent,
    ClientLeadWebhookCreateModalComponent,
    ClientLeadTransferModalComponent,
    ClientLeadFailedModalComponent,
    ClientWebhookDeleteModalComponent,
    CopyLeadModalComponent,
    SetLeadColorModalComponent,
    AppointmentModalComponent,
    ConfirmLeadModalComponent,
    LeadVndorUpdatedModalComponent,
    CallsListModalComponent,
    CopyMultipleLeadModalComponent,
    AdminProjectModalComponent,
    AdminClientProjectModalComponent,
    MakeCallComponent,
    WebhookCopyComponent,
    WebhookByProjectComponent,
    LeadUpdatedToVerifiedStatusModalComponent,
    LeadDuplicateInfoComponent,
    CreateMeetingModalComponent,

    // Client Lead Profile Component
    ClientLeadProfileComponent,
    ClientLeadProfileTaskCreateModalComponent,
    ClientLeadProfileEditModalComponent,
    ClientTaskMarkDoneModalComponent,
    ClientLeadProfileNoteCreateModalComponent,
    ClientLeadProfileNoteEditModalComponent,
    ClientLeadAddressEditModalComponent,
    ClientLeadAddressCreateModalComponent,
    ClientLeadEmailCreateModalComponent,
    ClientLeadAttachmentCreateModalComponent,
    ClientTaskDeleteModalComponent,
    ClientNoteDeleteModalComponent,
    ClientAddressDeleteModalComponent,
    ClientDocumentDeleteModalComponent,
    ClientEditProfileModalComponent,

    // CLient Rule Assigmment
    ClientRuleAssignmentComponent,
    ClientRuleAssignmentCreateModalComponent,
    ClientRuleEntryModalComponent,
    ClientCreateRuleEntryModalComponent,
    ClientEditRuleEntryModalComponent,
    ClientAssignmentDeleteModalComponent,
    ClientRuleEntryDeleteModalComponent,

    // CLient Registration
    RegistrationListComponent,
    RegistrationFilterModalComponent,
    RegistrationCreateModalComponent,

    // Vendor list
    VendorListComponent,
    VendorCreateModalComponent,
    VendorEditModalComponent,
    VendorInfoModalComponent,
    ClientAssignModelComponent,

    // Logs
    VendorLogsComponent,
    VendorLogsFilterModalComponent,
    AuditLogInfoComponent,
    VendorFilterModalComponent,

    // Call Report
    CallReportComponent,
    LeadReportComponent,
    CreateLeadReportComponent,
    EditLeadReportComponent,
    LeadReportDeleteModalComponent,
    ProjectInsightComponent,
    LeadRequestComponent,
    PersonaComponent,

    //booking
    BookingsComponent,
    CreateBookingModalComponent,
    DeleteBookingModalComponent,
    BookingFilterModalComponent,
    LeadSendMiModalComponent,
    ProjectMediaPlanComponent,
    WhatsappProfileModalComponent,
    PreviewNumberModalComponent,
    ClientListProjectModalComponent,

    //whatsapp
    WhatsappRulesComponent,
    CreateWhatsappRulesComponent,
    WhatsappRuleEntryComponent,
    CreateWhatsappRuleEntryComponent,
    EditWhatsappRuleEntryComponent,
   

    //Sales Account
    
    SalesAccountComponent,
    SalesAccountCreateModalComponent,
    AssignUserComponent,
    AssignProjectComponent,


    //Call Logs

    CallLogsComponent,


    UserListModalComponent,
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    ImageCropperModule,
    MatToolbarModule,
    HighchartsChartModule,
    MatButtonModule,
    MatButtonToggleModule,
    MyDateRangePickerModule,
    MatSnackBarModule,
    MatDialogModule,
    //
   
    //
    MatCardModule,
    PapaParseModule,
    MatPaginatorModule,
    MatChipsModule,
    FormsModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatTableModule,
    MatSelectModule,
    MatTooltipModule,
    FlexLayoutModule,
    DragDropModule,
    MatSidenavModule,
    MatExpansionModule,
    // ChartModule.forRoot(highcharts),
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    LayoutModule,
    PageRoutingModule,
    MatRippleModule,
    OwlDateTimeModule,
    MatProgressSpinnerModule,
    OwlNativeDateTimeModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    CdkAccordionModule,
    NgxMaterialTimepickerModule.forRoot(),
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.0/',
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  entryComponents: [
    DashboardFilterModalComponent,
    SalesAccountComponent,

    LeadListModalComponent,

    UserCreateModalComponent,
    UserInfoModalComponent,
    UserTokenComponent,
    UserAssignProjectComponent,
    PermissionModalComponent,
    UserEditModalComponent,
    UserProfileModalComponent,
    UserFilterModalComponent,

    //whatsapp 

    WhatsappProfileModalComponent,
    PreviewNumberModalComponent,
    WhatsappRulesComponent,
    CreateWhatsappRulesComponent,
    WhatsappRuleEntryComponent,
    CreateWhatsappRuleEntryComponent,
    EditWhatsappRuleEntryComponent,

    // Permission Configuration Modals Component
    PermissionAddModalComponent,

    // Color Configuration Modals Component
    ColorCreateModalComponent,
    ColorDeleteModalComponent,
    ColorEditModalComponent,

    CampaignCreateModalComponent,

    // Color Configuration Component
    CustomizePolicyAddModalComponent,
    CustomizePolicyModalInfoComponent,

    // CLient List
    VendorAssignModelComponent,
    ClientCreateModalComponent,
    ClientEditModalComponent,
    ClientInfoModalComponent,
    ClientFilterModalComponent,
    ClientProjectInfoModalComponent,
    ClientListProjectModalComponent,

    // Client Project Modals Component
    ClientProjectCreateModalComponent,
    ClientProjectDeleteModalComponent,
    ClientProjectEditModalComponent,
    ClientProjectInfoModalComponent,
    ClientProjectBrochuerModalComponent,
    ProjectEmailNotifyModalComponent,
    ProjectUploadAvatarModalComponent,
    ClientProjectQualifiedModalComponent,
    ProjectFeedbackModalComponent,
    ProjectMediaPlanComponent,
    ProjectFilterModalComponent,
    ClientProjectStatsModalComponent,
    ProjectStatusModalComponent,
    DeleteProjectStatusModalComponent,

    // Client lead Modals Component
    ClientMasterLeadComponent,
    ClientLeadCreateModalComponent,
    ClientLeadEditModalComponent,
    ClientLeadFilterModalComponent,
    ClientLeadInfoModalComponent,
    ClientRemarkModalComponent,
    ClientUploadModalComponent,
    ClientExportLeadModalComponent,
    ClientLeadDeleteModalComponent,
    ClientAssignLeadModalComponent,
    ClientLeadTransferModalComponent,
    ClientLeadWebhookCreateModalComponent,
    ClientLeadFailedModalComponent,
    ClientWebhookDeleteModalComponent,
    CopyLeadModalComponent,
    SetLeadColorModalComponent,
    AppointmentModalComponent,
    ConfirmLeadModalComponent,
    LeadVndorUpdatedModalComponent,
    CallsListModalComponent,
    CopyMultipleLeadModalComponent,
    AdminProjectModalComponent,
    AdminClientProjectModalComponent,
    MakeCallComponent,
    WebhookCopyComponent,
    WebhookByProjectComponent,
    LeadUpdatedToVerifiedStatusModalComponent,
    LeadDuplicateInfoComponent,
    CreateMeetingModalComponent,

    // Client Lead Profile Modals Component
    ClientLeadProfileTaskCreateModalComponent,
    ClientLeadProfileEditModalComponent,
    ClientTaskMarkDoneModalComponent,
    ClientLeadProfileNoteCreateModalComponent,
    ClientLeadProfileNoteEditModalComponent,
    ClientLeadAddressCreateModalComponent,
    ClientLeadAddressEditModalComponent,
    ClientLeadEmailCreateModalComponent,
    ClientLeadAttachmentCreateModalComponent,
    ClientTaskDeleteModalComponent,
    ClientNoteDeleteModalComponent,
    ClientAddressDeleteModalComponent,
    ClientDocumentDeleteModalComponent,
    ClientEditProfileModalComponent,
    LeadSendMiModalComponent,

    // CLient Rule
    ClientRuleAssignmentCreateModalComponent,
    ClientRuleEntryModalComponent,
    ClientCreateRuleEntryModalComponent,
    ClientEditRuleEntryModalComponent,
    ClientAssignmentDeleteModalComponent,
    ClientRuleEntryDeleteModalComponent,

    // CLient Registration
    RegistrationListComponent,
    RegistrationFilterModalComponent,
    RegistrationCreateModalComponent,


    // Vendor list
    VendorCreateModalComponent,
    VendorEditModalComponent,
    VendorInfoModalComponent,
    ClientAssignModelComponent,
    VendorFilterModalComponent,

    //logs
    VendorLogsFilterModalComponent,
    AuditLogInfoComponent,

    // Lead Report
    LeadReportDeleteModalComponent,
    ProjectInsightComponent,
    LeadRequestComponent,

    //booking
    BookingsComponent,
    CreateBookingModalComponent,
    DeleteBookingModalComponent,
    BookingFilterModalComponent,

    //sales account
    SalesAccountCreateModalComponent,
    AssignUserComponent,
    AssignProjectComponent,

    //Call Logs
    CallLogsComponent,

    //users
    UserListModalComponent,


  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class PagesModule { }
