import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ClipBoardService } from '../../services/clipboard.service'
import { ServerService } from '../../services/server.service'
import { ClientCreateModalComponent } from './client-create-modal/client-create-modal.component';
import { ClientEditModalComponent } from './client-edit-modal/client-edit-modal.component';
import { ClientFilterModalComponent } from './client-filter-modal/client-filter-modal.component';
import { ClientInfoModalComponent } from './client-info-modal/client-info-modal.component';
import { VendorAssignModelComponent } from './vendor-assign-model/vendor-assign-model.component';
import { ClientListProjectModalComponent } from './client-list-project-modal/client-list-project-modal.component';
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  showComponentLoader: boolean = false
  showComponentLoader1: boolean = false;
  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  client: any = {
    clients: [],
    pagination: {}
  }
  elasticSearch: string = ""
  createdAt: any = ""
  updatedAt: any = ""
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageIndex: number = 0;
  pageSize: number = 50;
  vendorAssignModelComponent: MatDialogRef<VendorAssignModelComponent>
  clientCreateModalComponent: MatDialogRef<ClientCreateModalComponent>
  clientEditModalComponent: MatDialogRef<ClientEditModalComponent>
  clientInfoModalComponent: MatDialogRef<ClientInfoModalComponent>
  clientFilterModalComponent: MatDialogRef<ClientFilterModalComponent>
  clientListProjectModalComponent:MatDialogRef<ClientListProjectModalComponent>

  constructor(
    private dialog: MatDialog,
    private serverService: ServerService,
    private titleService: Title,
    private clipBoardService: ClipBoardService
  ) {
    this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Clients');
  }

  ngOnInit() {
    this.getAllClients()
  }

  getAllClients() {
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
    let url = "clients_with_filter/?per_page=" + this.pageSize + "&page=" + this.pageIndex;
    this.serverService.clientsListByFilter(url, body, this.authToken).subscribe(
      data => {
        this.client = data
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
    this.showComponentLoader = true
    let url = "clients_with_filter/?per_page=" + this.pageSize + "&page=" + indexPage;
    this.serverService.clientsListByFilter(url, body, this.authToken).subscribe(
      data => {
        this.client = data
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
    this.clientFilterModalComponent = this.dialog.open(ClientFilterModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
    this.clientFilterModalComponent.afterClosed().subscribe(result => {
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
        this.getAllClients()
      }
    })
  }

  openCreateModal() {
    this.clientCreateModalComponent = this.dialog.open(ClientCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
    });
    this.clientCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllClients()
      }
    });
  }

  edit(vendor) {
    this.clientEditModalComponent = this.dialog.open(ClientEditModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: vendor
    });
    this.clientEditModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllClients()
      }
    });
  }

  openClientDialog(element) {
    this.vendorAssignModelComponent = this.dialog.open(VendorAssignModelComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

  disableClient(element, event) {
    let body = {
      "disable": !event.checked
    }
    this.serverService.disbaleClient(element, body, this.authToken).subscribe(
      data => {
        if (data.disable) {
          this.clipBoardService.showMessgeInText("Client Disable Succesfully", "success-snackbar")
        } else {
          this.clipBoardService.showMessgeInText("Client Enable Succesfully", "success-snackbar")
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
      "organization_type": "Client",
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

  clientInfo(element) {
    if (this.userInfo.admin) {
      this.showComponentLoader = true;
      this.serverService.getClientById(element.id, this.authToken).subscribe(
        data => {
          this.clientInfoModalComponent = this.dialog.open(ClientInfoModalComponent, {
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

  download(element) {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    let filename = element.name + '-Report' + "-" + dd + "-" + mm + "-" + yyyy + ".csv";
    this.showComponentLoader1 = true
    this.serverService.exportClientAnalysis(element.id, this.authToken).subscribe(
      data => {
        var csvData = new Blob([data._body], { type: "text/csv" });
        var csvUrl = URL.createObjectURL(csvData);
        var link = document.createElement("a");
        link.setAttribute("id", "download-link")
        link.setAttribute("href", csvUrl);
        link.setAttribute("download", filename);
        link.innerHTML = "Click Here to download";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.getElementById("download-link").remove();
        }, 1000)
        this.showComponentLoader1 = false
      },
      err => {
        this.showComponentLoader1 = false
        this.clipBoardService.checkServerError(err, this.authToken);
      }
    );
  }

  removeSearch() {
    this.elasticSearch = ""
    this.getAllClients()
  }
  projectName(element){
    this.showComponentLoader = true;
    console.log(element.id)
    this.serverService.getProjectById(element.id, this.authToken).subscribe(
      data => {
        this.clientListProjectModalComponent = this.dialog.open(ClientListProjectModalComponent, {
          hasBackdrop: true,
          disableClose: false,
          autoFocus: true,
          width: '25%',
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