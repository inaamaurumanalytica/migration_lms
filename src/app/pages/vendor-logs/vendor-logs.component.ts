import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { VendorLogsFilterModalComponent } from './vendor-logs-filter-modal/vendor-logs-filter-modal.component'
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { AuditLogInfoComponent } from './audit-log-info/audit-log-info.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-vendor-logs',
  templateUrl: './vendor-logs.component.html',
  styleUrls: ['./vendor-logs.component.scss']
})
export class VendorLogsComponent implements OnInit {
  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  showComponentLoader: boolean = false
  logs: any = {
    audit_logs: [],
    pagination: {}
  }
  search: any = ""

  vendorLogFilterModalComponent: MatDialogRef<VendorLogsFilterModalComponent>
  auditLogInfoComponent: MatDialogRef<AuditLogInfoComponent>
  createdDateFormate: any = ""
  createdDate: any = ""
  selectAction: any = ""
  selectUser: any = ""
  selectType: any = ""


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageIndex: number = 0;
  pageSize: number = 100;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
  ) {
    this.titleService.setTitle('AutomateLeads - Logs')
  }

  ngOnInit() {
    this.getAllLogs()
  }

  getAllLogs() {
    this.showComponentLoader = true;
    let url = "per_page=100&page=1"
    if (this.selectAction != "") {
      url += '&actions=' + this.selectAction
    }
    if (this.selectType != "") {
      url += '&lms_object_type=' + this.selectType
    }
    if (this.selectUser != "") {
      url += '&user_id=' + this.selectUser
    }
    if (this.createdDate != null && this.createdDate != undefined && this.createdDate != "") {
      if (this.createdDate.length != undefined && this.createdDate.length != 0) {
        url += '&created_at=' + JSON.stringify(this.createdDate)
      } else {
        //let createdDate = [this.createdDate.formatted.split(" - ")[0], this.createdDate.formatted.split(" - ")[1]]
        url += '&created_at=' + JSON.stringify(this.createdDateFormate)
      }
    }
    this.serverService.auditLogList(url, this.authToken).subscribe(
      data => {
        this.logs = data;
        this.showComponentLoader = false;
      },
      err => {
        this.showComponentLoader = false;
        this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
      }
    )
  }

  filter() {
    let body = {};
    if (this.selectUser != undefined && this.selectUser != "") {
      body['selectUser'] = this.selectUser
    }
    if (this.createdDate != undefined && this.createdDate != "") {
      body['createdDate'] = this.createdDate
    }
    if (this.selectAction != undefined && this.selectAction != "") {
      body["selectAction"] = this.selectAction
    }
    if (this.selectType != undefined && this.selectType != "") {
      body["selectType"] = this.selectType
    }
    this.vendorLogFilterModalComponent = this.dialog.open(VendorLogsFilterModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
    this.vendorLogFilterModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        if (result.selectUser != undefined && result.selectUser != "") {
          this.selectUser = result.selectUser
        } else {
          this.selectUser = ""
        }
        if (result.selectAction != undefined && result.selectAction != "") {
          this.selectAction = result.selectAction
        } else {
          this.selectAction = ""
        }
        if (result.selectType != undefined && result.selectType != "") {
          this.selectType = result.selectType
        } else {
          this.selectType = ""
        }
        if (result.createdDate != undefined && result.createdDate != "") {
          this.createdDate = result.createdDate
          this.createdDateFormate = [result.createdDate.formatted.split(" - ")[0], result.createdDate.formatted.split(" - ")[1]]
        } else {
          this.createdDate = ""
          this.createdDateFormate = ""
        }
        this.getAllLogs()
      }
    })
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
    //let url = "leads_search/?per_page=" + body1.per_page + "&page=" + body1.page;
    let url = "per_page=" + body1.per_page + "&page=" + indexPage

    if (this.selectAction != "") {
      url += '&actions=' + this.selectAction
    }
    if (this.selectType != "") {
      url += '&lms_object_type=' + this.selectType
    }
    if (this.selectUser != "") {
      url += '&user_id=' + this.selectUser
    }
    if (this.createdDate != null && this.createdDate != undefined && this.createdDate != "") {
      if (this.createdDate.length != undefined && this.createdDate.length != 0) {
        url += '&created_at=' + JSON.stringify(this.createdDate)
      } else {
        this.createdDate = [this.createdDate.beginDate.year + '-' + this.createdDate.beginDate.month + '-' + this.createdDate.beginDate.day, this.createdDate.endDate.year + '-' + this.createdDate.endDate.month + '-' + this.createdDate.endDate.day];
        url += '&created_at=' + JSON.stringify(this.createdDate)
      }
    }
    this.serverService.auditLogList(url, this.authToken).subscribe(
      data => {
        this.logs = data
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  auditInfo(element) {
    this.auditLogInfoComponent = this.dialog.open(AuditLogInfoComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '700px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }
}