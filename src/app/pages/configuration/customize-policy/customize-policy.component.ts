import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { ServerService } from '../../../services/server.service'
import { ClipBoardService } from '../../../services/clipboard.service'
import { CustomizePolicyAddModalComponent } from './customize-policy-add-modal/customize-policy-add-modal.component';
import { CustomizePolicyModalInfoComponent } from './customize-policy-modal-info/customize-policy-modal-info.component';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-customize-policy',
  templateUrl: './customize-policy.component.html',
  styleUrls: ['./customize-policy.component.scss']
})
export class CustomizePolicyComponent implements OnInit {
  showComponentLoader: boolean = false
  authToken: any = localStorage.getItem("token")
  currentUser: any = JSON.parse(localStorage.getItem("userInfo"))
  policies: any[] = []
  customizePolicyAddModalComponent: MatDialogRef<CustomizePolicyAddModalComponent>
  customizePolicyModalInfoComponent: MatDialogRef<CustomizePolicyModalInfoComponent>
  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService) {
    this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Policy');
  }

  ngOnInit() {
    this.getAllPolicy()
  }

  getAllPolicy() {
    this.serverService.getPolicy(this.authToken).subscribe(
      data => {
        this.policies = data;
        this.policies.forEach((element, index) => {
          if (element.doc_type == "PP") {
            element["new_doc_type"] = 'Privacy Policy'
          } else {
            element["new_doc_type"] = 'Terms & Conditions'
          }
        });
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  createPolicy() {
    this.customizePolicyAddModalComponent = this.dialog.open(CustomizePolicyAddModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
    });
    this.customizePolicyAddModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllPolicy()
      }
    })
  }

  changeActive(element) {
    this.showComponentLoader = true
    let body = {
      "published": !element.published,
      "id": element.id
    }
    this.serverService.updatePublishPolicy(body, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("Succesfully Updated", "success-snackbar")
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  viewInfo(element) {
    this.customizePolicyModalInfoComponent = this.dialog.open(CustomizePolicyModalInfoComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

}