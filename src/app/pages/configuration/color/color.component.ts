import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { ColorCreateModalComponent } from './color-create-modal/color-create-modal.component'
import { ColorEditModalComponent } from './color-edit-modal/color-edit-modal.component'
import { ColorDeleteModalComponent } from './color-delete-modal/color-delete-modal.component'
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {
  showComponentLoader = false
  authToken: any = localStorage.getItem("token")
  colors: any[] = []
  colorCreateModalComponent: MatDialogRef<ColorCreateModalComponent>
  colorEditModalComponent: MatDialogRef<ColorEditModalComponent>
  colorDeleteModalComponent: MatDialogRef<ColorDeleteModalComponent>
  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService
  ) {
    this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Color');
  }

  ngOnInit() {
    this.getAllSystemLeads()
  }

  getAllSystemLeads() {
    this.serverService.getLeadColor(this.authToken).subscribe(
      data => {
        this.colors = data
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  active(type, event) {
    let body = {
      "active": event.checked
    }
    this.serverService.updateLeadColor(type.id, body, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("Color Updated Successfully", "success-snackbar")
        //this.getAllLeadStatus()
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  create() {
    this.colorCreateModalComponent = this.dialog.open(ColorCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side'
    });
    this.colorCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllSystemLeads()
      }
    })
  }

  edit(type) {
    this.colorEditModalComponent = this.dialog.open(ColorEditModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: type
    });
    this.colorEditModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllSystemLeads()
      }
    })
  }

  delete(type) {
    this.colorDeleteModalComponent = this.dialog.open(ColorDeleteModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      data: type
    });
    this.colorDeleteModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllSystemLeads()
      }
    })
  }

  backGroundColor(status) {
    return {
      "width": "20px",
      "height": "20px",
      "border-radius": "28px",
      "background-color": status.color_code,
      "border": "1px solid",
    }
  }
}