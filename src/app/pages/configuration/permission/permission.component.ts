import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { ServerService } from '../../../services/server.service'
import { ClipBoardService } from '../../../services/clipboard.service'
import { PermissionAddModalComponent } from './permission-add-modal/permission-add-modal.component';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  showComponentLoader: boolean = false
  authToken: any = localStorage.getItem("token")
  currentUser: any = JSON.parse(localStorage.getItem("userInfo"))
  permissions: any[] = []
  permissionAddModalComponent: MatDialogRef<PermissionAddModalComponent>
  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService) {
    this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Permissions');
  }


  ngOnInit() {
    this.getAllPermissions()
  }

  getAllPermissions() {
    this.serverService.getPermissionList(this.authToken).subscribe(
      data => {
        this.permissions = data;
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  createPermission() {
    this.permissionAddModalComponent = this.dialog.open(PermissionAddModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
    });
    this.permissionAddModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllPermissions()
      }
    })
  }
}