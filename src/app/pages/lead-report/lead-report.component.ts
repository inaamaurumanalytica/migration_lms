import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ClipBoardService } from '../../services/clipboard.service'
import { ServerService } from '../../services/server.service'
import { LeadReportDeleteModalComponent } from './lead-report-delete-modal/lead-report-delete-modal.component';
@Component({
  selector: 'app-lead-report',
  templateUrl: './lead-report.component.html',
  styleUrls: ['./lead-report.component.scss']
})
export class LeadReportComponent implements OnInit {
  showComponentLoader: boolean = false
  showComponentLoader1: boolean = false;
  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  selectedIndex: number = 0
  dataSource: any = {
    reports: [],
    pagination: {}
  }
  showData: boolean = false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  pageIndex: number = 0;
  pageSize: number = 50;

  leadReportDeleteModalComponent: MatDialogRef<LeadReportDeleteModalComponent>
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService
  ) {
    this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Leads Report');
  }

  ngOnInit() {
    this.getAllReports()
  }

  // getAllReports() {
  //   this.showComponentLoader = true;
  //   this.serverService.getReportList(this.authToken).subscribe(
  //     data => {
  //       this.showComponentLoader = false;
  //       this.dataSource = data;
  //     },
  //     err => {
  //       this.showComponentLoader = false;
  //       this.clipBoardService.checkServerError(err, this.authToken)
  //     }
  //   )
  // }

  getAllReports() {
    this.pageIndex = 0;
    this.pageSize = 50;
    this.showComponentLoader = true
    let url = "reports/?per_page=" + this.pageSize + "&page=" + this.pageIndex;
    this.serverService.getReportList(url, this.authToken).subscribe(
      data => {
        this.dataSource = data
        console.log(this.dataSource)
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getNext(event) {
    this.showComponentLoader = true
    let body1 = {
      "per_page": event.pageSize,
      "page": event.pageIndex
    };
    this.pageSize = body1.per_page;
    this.pageIndex = body1.page
    let indexPage = this.pageIndex + 1
    
   
    this.showComponentLoader = true
    let url = "reports/?per_page=" + this.pageSize + "&page=" + indexPage;
    this.serverService.getReportList(url, this.authToken).subscribe(
      data => {
        this.dataSource = data
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  selectReport(item: any) {
    this.showData = !this.showData
    this.selectedIndex = item;
  }


  openCreateModal() {
    this.router.navigate(['/page/lead-report/create'])
  }

  edit(item) {
    localStorage.setItem("report", JSON.stringify(item))
    this.router.navigate(['/page/lead-report/edit'])
  }

  delete(item) {
    this.leadReportDeleteModalComponent = this.dialog.open(LeadReportDeleteModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: "500px",
      data: item
    });
    this.leadReportDeleteModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllReports();
      }
    });
  }

}