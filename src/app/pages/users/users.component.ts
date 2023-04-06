import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ClipBoardService } from '../../services/clipboard.service'
import { ServerService } from '../../services/server.service'
import { PermissionModalComponent } from './permission-modal/permission-modal.component';
import { UserAssignProjectComponent } from './user-assign-project/user-assign-project.component';
import { UserCreateModalComponent } from './user-create-modal/user-create-modal.component';
import { UserFilterModalComponent } from './user-filter-modal/user-filter-modal.component';
import { UserInfoModalComponent } from './user-info-modal/user-info-modal.component';
import { UserTokenComponent } from './user-token/user-token.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  showComponentLoader: boolean = false
  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  elasticSearch: any = ""
  user: any = {
    users: [],
    pagination: {}
  }
  showChartStats: boolean = false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageIndex: number = 0;
  pageSize: number = 50;

  createdAt: any = ""
  email_verified: boolean = false
  memberType: any = ''
  memberId: any = ""
  org_admin: boolean = false
  active: boolean = false
  phone_verified: boolean = false

  permissionModalComponent: MatDialogRef<PermissionModalComponent>
  userCreateModalComponent: MatDialogRef<UserCreateModalComponent>
  userTokenComponent: MatDialogRef<UserTokenComponent>
  userInfoModalComponent: MatDialogRef<UserInfoModalComponent>
  userAssignProjectComponent: MatDialogRef<UserAssignProjectComponent>
  userFilterModalComponent: MatDialogRef<UserFilterModalComponent>
  constructor(
    private dialog: MatDialog,
    private serverService: ServerService,
    private titleService: Title,
    private clipBoardService: ClipBoardService
  ) {
    this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Users');
    if (this.clipBoardService.userName != "") {
      this.elasticSearch = this.clipBoardService.userName
    }
  }

  ngOnInit() {
    this.getAllUsers()
    this.getPermission()
  }

  getAllUsers() {
    let body = {
    }
    if (this.elasticSearch.trim() != "") {
      if (this.elasticSearch.includes("@")) {
        body["email"] = this.elasticSearch
      } else if (/^-?\d+$/.test(this.elasticSearch)) {
        body["phone"] = this.elasticSearch
      } else {
        body["name"] = this.elasticSearch
      }
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
    }
    if (this.email_verified) {
      body["email_verified"] = this.email_verified
    }
    if (this.org_admin) {
      body["org_admin"] = this.org_admin
    }
    if (this.active) {
      body["active"] = this.active
    }
    if (this.phone_verified) {
      body["phone_verified"] = this.phone_verified
    }
    if (this.memberType != undefined && this.memberType != '') {
      body["member_type"] = this.memberType
    }
    if (this.memberId != undefined && this.memberId != '') {
      body["member_id"] = this.memberId
    }
    this.pageIndex = 0;
    this.pageSize = 50;
    this.showComponentLoader = true
    let url = "all_users_search_n_filter/?per_page=" + this.pageSize + "&page=" + this.pageIndex;
    this.serverService.getUsersByFilter(url, body, this.authToken).subscribe(
      data => {
        this.user = data
        //console.log(this.user)
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
    let body = {}
    this.pageSize = body1.per_page;
    this.pageIndex = body1.page
    let indexPage = this.pageIndex + 1
    if (this.elasticSearch.trim() != "") {
      if (this.elasticSearch.includes("@")) {
        body["email"] = this.elasticSearch
      } else if (/^-?\d+$/.test(this.elasticSearch)) {
        body["phone"] = this.elasticSearch
      } else {
        body["name"] = this.elasticSearch
      }
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
    }
    if (this.email_verified) {
      body["email_verified"] = this.email_verified
    }
    if (this.org_admin) {
      body["org_admin"] = this.org_admin
    }
    if (this.active) {
      body["active"] = this.active
    }
    if (this.phone_verified) {
      body["phone_verified"] = this.phone_verified
    }
    if (this.memberType != undefined && this.memberType != '') {
      body["member_type"] = this.memberType
    }
    if (this.memberId != undefined && this.memberId != '') {
      body["member_id"] = this.memberId
    }
    let url = "all_users_search_n_filter?per_page=" + this.pageSize + "&page=" + indexPage;
    this.serverService.getUsersByFilter(url, body, this.authToken).subscribe(
      data => {
        this.user = data
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  filter() {
    let body = {};
    body['phone_verified'] = this.phone_verified
    body['org_admin'] = this.org_admin
    body['email_verified'] = this.email_verified
    body["active"] = this.active
    if (this.memberType != undefined && this.memberType != "") {
      body["member_type"] = this.memberType
    }
    if (this.memberId != undefined && this.memberId != "") {
      body["member_id"] = this.memberId
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["createdAt"] = this.createdAt
    }
    this.userFilterModalComponent = this.dialog.open(UserFilterModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
    this.userFilterModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        if (result.memberType != undefined && result.memberType != "") {
          this.memberType = result.memberType
        } else {
          this.memberType = ""
        }
        if (result.memberId != undefined && result.memberId != "") {
          this.memberId = result.memberId
        } else {
          this.memberId = ""
        }

        this.active = result.active
        this.phone_verified = result.phone_verified
        this.org_admin = result.org_admin
        this.email_verified = result.email_verified

        if (result.createdAt != undefined && result.createdAt != "") {
          this.createdAt = result.createdAt
        } else {
          this.createdAt = ""
        }
        this.getAllUsers()
      }
    })
  }

  getPermission() {
    this.serverService.getPermissionList(this.authToken).subscribe(
      data => {
        localStorage.setItem("permissions", JSON.stringify(data));
      },
      err => {

        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  create() {
    this.userCreateModalComponent = this.dialog.open(UserCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side'
    });
    this.userCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllUsers()
      }
    })
  }


  makeUserAdmin(user, event) {
    let body = {
      "id": user.id,
      "org_admin": event.checked
    }
    this.serverService.updateUserOrganistationAdminStatus(body, this.authToken).subscribe(
      data => {
        if (body.org_admin) {
          this.clipBoardService.showMessgeInText('User updated to Admin Successfully', 'success-snackbar')
        } else {
          this.clipBoardService.showMessgeInText('User updated to Not Admin Successfully', 'success-snackbar')
        }
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  permission(element) {
    this.serverService.getUserById(element, this.authToken).subscribe(
      data => {
        this.permissionModalComponent = this.dialog.open(PermissionModalComponent, {
          hasBackdrop: true,
          disableClose: false,
          autoFocus: true,
          width: '500px',
          panelClass: 'cdk-overlay-panel-right-side',
          data: data
        });
      },
      err => {

        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  openAssignProjectDialog(element) {
    this.userAssignProjectComponent = this.dialog.open(UserAssignProjectComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

  resendEmail(element) {
    let body = {
      "user_id": element.id
    }
    this.serverService.resendEmail(body, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("Email Verification Has been sent to " + element.name, "success-snackbar")
      },
      err => {

        this.clipBoardService.checkServerError(err, this.authToken)
      }

    )
  }

  verifyPhone(element) {
    let body = {
      "phone_verified": !element.phone_verified
    }
    this.serverService.verifyNumber(element.id, body, this.authToken).subscribe(
      data => {
        if (body.phone_verified) {
          this.clipBoardService.showMessgeInText("Phone Verified Successfully", "success-snackbar")
        } else {
          this.clipBoardService.showMessgeInText("Phone Unverified Successfully", "error-snackbar")
        }
        element.phone_verified = !element.phone_verified
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }

    )
  }

  verifyEmail(element) {
    let body = {
      "email_verified": !element.email_verified
    }
    this.serverService.virtualVerifyEmail(element.id, body, this.authToken).subscribe(
      data => {
        if (body.email_verified) {
          this.clipBoardService.showMessgeInText("Email Verified Successfully", "success-snackbar")
        } else {
          this.clipBoardService.showMessgeInText("Email Unverified Successfully", "error-snackbar")
        }
        element.email_verified = !element.email_verified
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }

    )
  }

  getUserToken(element) {
    this.serverService.getUserToken(element.id, this.authToken).subscribe(
      data => {
        let body = {
          userDetail: element,
          auth_token: data.auth_token
        }
        this.userTokenComponent = this.dialog.open(UserTokenComponent, {
          hasBackdrop: true,
          disableClose: false,
          autoFocus: true,
          width: '400px',
          data: body
        });
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  disableUser(element, event) {
    let body = {
      "id": element.id,
      "active": event.checked
    }
    this.serverService.disbaleUser(body, this.authToken).subscribe(
      data => {
        if (body.active) {
          this.clipBoardService.showMessgeInText('User Enabled Successfully', 'success-snackbar')
        } else {
          this.clipBoardService.showMessgeInText('User Disabled Successfully', 'success-snackbar')
        }
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  userData(lead) {
    this.serverService.getUserById(lead, this.authToken).subscribe(
      data => {
        this.userInfoModalComponent = this.dialog.open(UserInfoModalComponent, {
          hasBackdrop: true,
          disableClose: false,
          autoFocus: true,
          width: '500px',
          panelClass: 'cdk-overlay-panel-right-side',
          data: data
        });
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  removeSearch() {
    this.elasticSearch = ""
    this.clipBoardService.userName = ""
    this.getAllUsers()
  }
}