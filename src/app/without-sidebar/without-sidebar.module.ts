import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WithoutSidebarRoutingModule } from './without-sidebar-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule, MatButtonModule, MatButtonToggleModule, MatSnackBarModule, MatDialogModule, MatCardModule, MatPaginatorModule, MatChipsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatBadgeModule, MatDatepickerModule, MatNativeDateModule, MatTabsModule, MatTableModule, MatSelectModule, MatTooltipModule, MatSidenavModule, MatExpansionModule, MatIconModule, MatListModule, MatCheckboxModule, MatRadioModule, MatSlideToggleModule, MatRippleModule, MatProgressSpinnerModule, MatProgressBarModule, MatAutocompleteModule } from '@angular/material';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HighchartsChartModule } from 'highcharts-angular';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ClipboardModule } from 'ngx-clipboard';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { PapaParseModule } from 'ngx-papaparse';
import { NgxTinymceModule } from 'ngx-tinymce';
import { WithoutSideberComponent } from './without-sideber.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { LayoutTwoComponent } from '../shared/layout/layout-two/layout-two.component';

@NgModule({
  declarations: [WithoutSideberComponent, LeadDetailsComponent, LayoutTwoComponent,],
  imports: [
    CommonModule,
    WithoutSidebarRoutingModule,
    ClipboardModule,
    ImageCropperModule,
    MatToolbarModule,
    HighchartsChartModule,
    MatButtonModule,
    MatButtonToggleModule,
    MyDateRangePickerModule,
    MatSnackBarModule,
    MatDialogModule,
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
    MatRippleModule,
    OwlDateTimeModule,
    MatProgressSpinnerModule,
    OwlNativeDateTimeModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    NgxMaterialTimepickerModule.forRoot(),
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.0/',
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ]
})
export class WithoutSidebarModule { }
