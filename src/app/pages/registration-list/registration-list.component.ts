import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { RegistrationFilterModalComponent } from './registration-filter-modal/registration-filter-modal.component'
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { RegistrationCreateModalComponent } from './registration-create-modal/registration-create-modal.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {
  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  showComponentLoader: boolean = false
  registrations: any = {
    my_registrations: [],
    pagination: {}
  }
  search: any = ""

  registrationFilterModalComponent: MatDialogRef<RegistrationFilterModalComponent>
  registrationCreateModalComponent: MatDialogRef<RegistrationCreateModalComponent>
  createdDateFormate: any = ""
  createdDate: any = ""
  selectUser: any = ""
  selectProject: any = ""


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
    this.titleService.setTitle('AutomateLeads - Registration');
  }

  ngOnInit() {
    this.getRegistrationList()
  }

  getRegistrationList() {
    this.showComponentLoader = true;
    let url = "my_registrations?per_page=" + this.pageSize + "&page=" + this.pageIndex;
    if (this.selectProject != "") {
      url += '&project_id=' + this.selectProject;
    }
    if (this.selectUser != "") {
      url += '&user_id=' + this.selectUser
    }
    if (this.createdDate != null && this.createdDate != undefined && this.createdDate != "") {
      if (this.createdDate.length != undefined && this.createdDate.length != 0) {
        url += '&created_at=' + JSON.stringify(this.createdDate)
      } else {
        url += '&created_at=' + JSON.stringify(this.createdDateFormate)
      }
    }
    this.serverService.getRegistration(url, this.authToken).subscribe(
      data => {
        this.registrations = data;
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
    if (this.selectProject != undefined && this.selectProject != "") {
      body['selectProject'] = this.selectProject
    }
    if (this.createdDate != undefined && this.createdDate != "") {
      body['createdDate'] = this.createdDate
    }
    this.registrationFilterModalComponent = this.dialog.open(RegistrationFilterModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
    this.registrationFilterModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        if (result.selectUser != undefined && result.selectUser != "") {
          this.selectUser = result.selectUser
        } else {
          this.selectUser = ""
        }
        if (result.selectProject != undefined && result.selectProject != "") {
          this.selectProject = result.selectProject
        } else {
          this.selectProject = ""
        }
        if (result.createdDate != undefined && result.createdDate != "") {
          this.createdDate = result.createdDate
          this.createdDateFormate = [result.createdDate.formatted.split(" - ")[0], result.createdDate.formatted.split(" - ")[1]]
        } else {
          this.createdDate = ""
          this.createdDateFormate = ""
        }
        this.getRegistrationList()
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
    let url = "my_registrations/?per_page=" + body1.per_page + "&page=" + indexPage

    if (this.selectUser != "") {
      url += '&user_id=' + this.selectUser
    }
    if (this.selectProject != "") {
      url += '&project_id=' + this.selectProject
    }
    if (this.createdDate != null && this.createdDate != undefined && this.createdDate != "") {
      if (this.createdDate.length != undefined && this.createdDate.length != 0) {
        url += '&created_at=' + JSON.stringify(this.createdDate)
      } else {
        this.createdDate = [this.createdDate.beginDate.year + '-' + this.createdDate.beginDate.month + '-' + this.createdDate.beginDate.day, this.createdDate.endDate.year + '-' + this.createdDate.endDate.month + '-' + this.createdDate.endDate.day];
        url += '&created_at=' + JSON.stringify(this.createdDate)
      }
    }
    this.serverService.getRegistration(url, this.authToken).subscribe(
      data => {
        this.registrations = data
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  openCreateModal() {
    this.registrationCreateModalComponent = this.dialog.open(RegistrationCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
    });
    this.registrationCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getRegistrationList();
      }
    });
  }
}