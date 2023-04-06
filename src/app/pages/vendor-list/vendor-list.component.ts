import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ClipBoardService } from '../../services/clipboard.service'
import { ServerService } from '../../services/server.service'
import { ClientAssignModelComponent } from './client-assign-model/client-assign-model.component';
import { VendorCreateModalComponent } from './vendor-create-modal/vendor-create-modal.component';
import { VendorEditModalComponent } from './vendor-edit-modal/vendor-edit-modal.component';
import { VendorFilterModalComponent } from './vendor-filter-modal/vendor-filter-modal.component';
import { VendorInfoModalComponent } from './vendor-info-modal/vendor-info-modal.component';
@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {
  showComponentLoader: boolean = false
  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  vendor: any = {
    vendors: [],
    pagination: {}
  }
  elasticSearch: string = ""
  createdAt: any = ""
  updatedAt: any = ""
  pageIndex: number = 0;
  pageSize: number = 50;
  showChartStats: boolean = false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  clientAssignModelComponent: MatDialogRef<ClientAssignModelComponent>
  vendorCreateModalComponent: MatDialogRef<VendorCreateModalComponent>
  vendorEditModalComponent: MatDialogRef<VendorEditModalComponent>
  vendorInfoModalComponent: MatDialogRef<VendorInfoModalComponent>
  vendorFilterModalComponent: MatDialogRef<VendorFilterModalComponent>

  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService
  ) {
    this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Vendors');
    if (this.clipBoardService.vendorName != "") {
      this.elasticSearch = this.clipBoardService.vendorName
    }
  }

  ngOnInit() {
    this.getAllVendors()
  }

  getAllVendors() {
    let body = {
    }
    if (this.elasticSearch.trim() != "") {
      body["name"] = this.elasticSearch
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
    }
    if (this.updatedAt != undefined && this.updatedAt != "") {
      body["modified_at"] = [this.updatedAt.formatted.split(" - ")[0], this.updatedAt.formatted.split(" - ")[1]];
    }
    this.pageIndex = 0;
    this.pageSize = 50;
    this.showComponentLoader = true
    let url = "vendors_with_filter/?per_page=" + this.pageSize + "&page=" + this.pageIndex;
    this.serverService.vendorsListByFilter(url, body, this.authToken).subscribe(
      data => {
        this.vendor = data
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
      body["name"] = this.elasticSearch
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
    }
    if (this.updatedAt != undefined && this.updatedAt != "") {
      body["modified_at"] = [this.updatedAt.formatted.split(" - ")[0], this.updatedAt.formatted.split(" - ")[1]];
    }
    this.pageIndex = 0;
    this.pageSize = 50;
    this.showComponentLoader = true
    let url = "vendors_with_filter/?per_page=" + this.pageSize + "&page=" + indexPage;
    this.serverService.vendorsListByFilter(url, body, this.authToken).subscribe(
      data => {
        this.vendor = data
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
    if (this.createdAt != undefined && this.createdAt != "") {
      body["createdAt"] = this.createdAt
    }
    if (this.updatedAt != undefined && this.updatedAt != "") {
      body["updatedAt"] = this.updatedAt
    }
    this.vendorFilterModalComponent = this.dialog.open(VendorFilterModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
    this.vendorFilterModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true

        if (result.createdAt != undefined && result.createdAt != "") {
          this.createdAt = result.createdAt
        } else {
          this.createdAt = ""
        }
        if (result.updatedAt != undefined && result.updatedAt != "") {
          this.updatedAt = result.updatedAt
        } else {
          this.createdAt = ""
        }
        this.getAllVendors()
      }
    })
  }
  openCreateModal() {
    this.vendorCreateModalComponent = this.dialog.open(VendorCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
    });
    this.vendorCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllVendors()
      }
    });
  }

  edit(vendor) {
    this.vendorEditModalComponent = this.dialog.open(VendorEditModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: vendor
    });
    this.vendorEditModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllVendors()
      }
    });
  }

  openClientDialog(element) {
    this.clientAssignModelComponent = this.dialog.open(ClientAssignModelComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

  disableVendor(element, event) {
    let body = {
      "disable": event.checked
    }
    this.serverService.disbaleVendor(element.id, body, this.authToken).subscribe(
      data => {
        if (data.disable) {
          this.clipBoardService.showMessgeInText("Vendor Disable Succesfully", "success-snackbar")
        } else {
          this.clipBoardService.showMessgeInText("Vendor Enable Succesfully", "success-snackbar")
        }
      },
      err => {
        element.disable = !event.checked
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }


  appAccess(element, event) {
    let body = {
      "organization_id": element.id,
      "allow_app_login": event.checked,
      "organization_type": "Vendor",
    }
    this.serverService.allowApplogin(body, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("Successfully Updated", "success-snackbar")
      },
      err => {
        element.allow_app_login = !event.checked
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  vendorInfo(element) {
    if (this.userInfo.admin) {
      this.showComponentLoader = true;
      this.serverService.getVendorById(element.id, this.authToken).subscribe(
        data => {
          this.vendorInfoModalComponent = this.dialog.open(VendorInfoModalComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            width: '100%',
            maxWidth: '100vw',
            panelClass: 'cdk-overlay-panel-right-side',
            data: data
          });
          this.showComponentLoader = false;
        },
        err => {
          this.showComponentLoader = false;
          this.clipBoardService.checkServerError(err, this.authToken)
        }
      )
    }
  }

  styleObject() {
    if (this.userInfo.admin) {
      return { "color": '#BF9724', "cursor": "pointer" }
    }
    return {}
  }

  removeSearch() {
    this.elasticSearch = ""
    this.clipBoardService.vendorName = ""
    this.getAllVendors()
  }
}