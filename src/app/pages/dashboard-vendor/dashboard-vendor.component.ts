import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, HostListener, TemplateRef,ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { Router } from '@angular/router';
import { MatAutocompleteTrigger } from "@angular/material";
import * as XLSX from "xlsx";
import { DashboardFilterModalComponent } from './dashboard-filter-modal/dashboard-filter-modal.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard-vendor',
  templateUrl: './dashboard-vendor.component.html',
  styleUrls: ['./dashboard-vendor.component.scss']
})
export class DashboardVendorComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger, static: true })
  
  inputAutoComplit: MatAutocompleteTrigger;
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  vendorStats: any = {}
  authToken: any = localStorage.getItem('token');
  showComponentLoader: boolean = false

  selectedClient: any = {};
  dataSource: any[] = []
  exportListString: any = ""
  notFound: boolean = false
  filterBtn: any = false
  clients: any[] = []
  filteredClients: any[] = []
  projectId = null
  project: any = {}
  //chnages made
  role:any;
  selectedVendor: any = ""

  modifiedAt: any = ""
  modifiedAtFormate: any

  lastVendorStatusUpdatedDate: any
  lastVendorStatusUpdatedDateFormate: any
  createdAt: any = ""
  createdAtFormate: any
  lastClientStatusUpdatedDate: any
  lastClientStatusUpdatedDateFormate: any

  dashboardFilterModalComponent: MatDialogRef<DashboardFilterModalComponent>

  showFilter: boolean = false

  clientLead:any;
  searchValue:any;

  constructor(
    private serverService: ServerService,
    private router: Router,
    private titleService: Title,
    private dialog: MatDialog,
    private clipBoardService: ClipBoardService,
  ) {
    this.titleService.setTitle('AutomateLeads - Dashboard');
    // this.searchValue = '';
  }
// changes made
  ngOnInit() {
    this.getVendorStats();
    // this.searchValue = '';
    // console.log(this.searchValue);
    // this.searchInput.value = '';
    //changes made
    this.role =this.userInfo['role'];
    if (this.userInfo.org_admin || this.role == "SalesAdmin"){
      this.getAllClients()
    }
    this.getLeadCount()
  }
  getVendorStats() {
    this.serverService.getStats(this.authToken).subscribe(
      data => {
        this.vendorStats = data
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getLeadCount() {
    this.serverService.getFreshLeadCount('get_lead_count', this.authToken).subscribe(data => {
      //console.log(data)
        this.clientLead = data
      }, err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getAllClients() {
    this.serverService.clientsList(this.authToken).subscribe(
      data => {
        this.clients = data.client
        this.filteredClients = data.client
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getVendorData(body, token) {
    this.dataSource = [];
    this.exportListString = ""
    this.serverService.projectStatsByClient(body, token).subscribe(
      data => {
        console.log(data);
        this.filterBtn = true
        let tempItem;
        let projects = data.aggregations.projects.buckets;
        let statuses;
        for (let i = 0; i < projects.length; i++) {
          tempItem = {
            project: "",
            Fresh: 0,
            Verified: 0,
            Interested: 0,
            "V Not Interested": 0,
            "V Not Responding": 0,
            "V Not Available": 0,
            "Not Interested": 0,
            "Not Responding": 0,
            "Not Available": 0,
            Contacted: 0,
            "Follow Up": 0,
            Callback: 0,
            "Wrong Number": 0,
            "Closed/Won": 0,
            "Site Visit": 0,
            total: 0
          };
          tempItem.project = projects[i].key;
          tempItem.total = projects[i].doc_count;
          statuses = projects[i].statuses.buckets;
          tempItem.projectId = statuses[0].project_id.buckets[0].key
          for (let j = 0; j < statuses.length; j++) {
            tempItem[statuses[j].key] = statuses[j].doc_count;
          }
          this.dataSource.push(tempItem);
        }
        if (this.dataSource.length == 0) {
          this.notFound = true;
        } else {
          let newData = ""
          Object.keys(this.dataSource[0]).map((el) => {
            newData += el + ','
          })
          newData += "\n"
          for (let index = 0; index < this.dataSource.length; index++) {
            Object.values(this.dataSource[index]).map(el => {
              newData += el + ','
            })
            newData += "\n"
          }
          this.exportListString = newData
          this.showFilter = true
        }
        this.showComponentLoader = false;
      },
      err => {
        this.showComponentLoader = false;
        this.clipBoardService.checkServerError(err, this.authToken);
      }
    );
  }

  selectClient() {
    this.showComponentLoader = true;
    let body = {
      client_id: this.selectedClient.id,
      filters: {}
    };
    if (this.lastVendorStatusUpdatedDate != undefined && this.lastVendorStatusUpdatedDate != "") {
      body.filters["last_vendor_status_updated_at"] = [this.lastVendorStatusUpdatedDate.formatted.split(" - ")[0], this.lastVendorStatusUpdatedDate.formatted.split(" - ")[1]];
    }
    if (this.lastClientStatusUpdatedDate != undefined && this.lastClientStatusUpdatedDate != "") {
      body.filters["last_client_status_updated_at"] = [this.lastClientStatusUpdatedDate.formatted.split(" - ")[0], this.lastClientStatusUpdatedDate.formatted.split(" - ")[1]];
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body.filters["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
    }
    if (this.modifiedAt != undefined && this.modifiedAt != "") {
      body.filters["modified_at"] = [this.modifiedAt.formatted.split(" - ")[0], this.modifiedAt.formatted.split(" - ")[1]];
    }
    if (this.selectedVendor != "") {
      body.filters["vendor_users"] = [this.selectedVendor];
    }
    this.getVendorData(body, this.authToken);
  }

  // Export to excel
  exportToExcel() {
    this.showComponentLoader = true
    let fileName = this.selectedClient.name;
    let csvContent = "";
    var csvData = new Blob([this.exportListString], { type: 'text/csv' });
    var csvUrl = URL.createObjectURL(csvData);
    var link = document.createElement("a");
    link.setAttribute("href", csvUrl);
    link.setAttribute("id", "csvUrl");
    link.setAttribute("download", fileName + '.csv');
    link.innerHTML = "";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      this.showComponentLoader = false
      document.getElementById("csvUrl").remove()
    }, 1000)
  }

  onKeyClient(val) {
    let filter = val.target.value.toLowerCase();
    if (val.key === ' ') {
      val.preventDefault();
      const inputElement = val.target as HTMLInputElement;
      const currentCaretPosition = inputElement.selectionStart;
      const inputValue = inputElement.value;
      const newValue = `${inputValue.slice(0, currentCaretPosition)} ${inputValue.slice(currentCaretPosition)}`;
      inputElement.value = newValue;
      inputElement.setSelectionRange(currentCaretPosition + 1, currentCaretPosition + 1);
    }
    else{
    this.filteredClients = this.clients.filter(option => option.name.toLowerCase().includes(filter));
  }
  // this.searchValue = '';
}

  filter() {
    let body = {};

    if (this.selectedVendor != undefined && this.selectedVendor != "") {
      body['selectedVendor'] = this.selectedVendor
    }

    if (this.lastClientStatusUpdatedDate != undefined && this.lastClientStatusUpdatedDate != "") {
      body["lastClientStatusModifiedDate"] = this.lastClientStatusUpdatedDate
    }
    if (this.lastVendorStatusUpdatedDate != undefined && this.lastVendorStatusUpdatedDate != "") {
      body["lastVendorStatusModifiedDate"] = this.lastVendorStatusUpdatedDate
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["createdAt"] = this.createdAt
    }

    this.dashboardFilterModalComponent = this.dialog.open(DashboardFilterModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
    this.dashboardFilterModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        if (result.selectedVendor != undefined && result.selectedVendor != "") {
          this.selectedVendor = result.selectedVendor
        } else {
          this.selectedVendor = ""
        }

        if (result.lastVendorStatusModifiedDate != undefined && result.lastVendorStatusModifiedDate != "") {
          this.lastVendorStatusUpdatedDate = result.lastVendorStatusModifiedDate
          this.lastVendorStatusUpdatedDateFormate = [result.lastVendorStatusModifiedDate.formatted.split(" - ")[0], result.lastVendorStatusModifiedDate.formatted.split(" - ")[1]]
        } else {
          this.lastVendorStatusUpdatedDate = ""
          this.lastVendorStatusUpdatedDateFormate = ""
        }
        if (result.lastClientStatusModifiedDate != undefined && result.lastClientStatusModifiedDate != "") {
          this.lastClientStatusUpdatedDate = result.lastClientStatusModifiedDate
          this.lastClientStatusUpdatedDateFormate = [result.lastClientStatusModifiedDate.formatted.split(" - ")[0], result.lastClientStatusModifiedDate.formatted.split(" - ")[1]]
        } else {
          this.lastClientStatusUpdatedDate = ""
          this.lastClientStatusUpdatedDateFormate = ""
        }
        if (result.createdAt != undefined && result.createdAt != "") {
          this.createdAt = result.createdAt
          this.createdAtFormate = [result.createdAt.formatted.split(" - ")[0], result.createdAt.formatted.split(" - ")[1]]
        } else {
          this.createdAt = ""
          this.createdAtFormate = ""
        }
        if (result.modifiedAt != undefined && result.modifiedAt != "") {
          this.modifiedAt = result.modifiedAt
          this.modifiedAtFormate = [result.modifiedAt.formatted.split(" - ")[0], result.modifiedAt.formatted.split(" - ")[1]]
        } else {
          this.modifiedAt = ""
          this.modifiedAtFormate = ""
        }
        this.selectClient()
      }
    })
  }

  routeTo(val) {
    if (val == 'project') {
      this.clipBoardService.select('/page/project')
      this.clipBoardService.isActive('/page/project')
      this.router.navigate(['/page/project'])
    } else if (val == 'vendor') {
      this.clipBoardService.select('/page/vendors')
      this.clipBoardService.isActive('/page/vendors')
      this.router.navigate(['/page/vendors'])
    } else if (val == 'client') {
      this.clipBoardService.select('/page/clients')
      this.clipBoardService.isActive('/page/clients')
      this.router.navigate(['/page/clients'])
    } else if (val == 'user') {
      this.clipBoardService.select('/page/users')
      this.clipBoardService.isActive('/page/users')
      this.router.navigate(['/page/users'])
    } else if (val == 'lead') {
      this.clipBoardService.select('/page/leads')
      this.clipBoardService.isActive('/page/leads')
      this.router.navigate(['/page/leads'])
    }
  }

  routeToProjectLeads(projectId, status, count) {
    if (count == 0 && status != '') {
      this.clipBoardService.showMessgeInText("No leads are available for " + status + " status", "error-snackbar")
      return
    }
    let body = {
      id: projectId
    }
    this.serverService.getProjectById(body, this.authToken).subscribe(
      data => {
        let queryParam = {
          id: projectId
        }
        if (this.lastVendorStatusUpdatedDate != undefined && this.lastVendorStatusUpdatedDate != "") {
          queryParam["last_vendor_status_updated_at"] = JSON.stringify([this.lastVendorStatusUpdatedDate.formatted.split(" - ")[0], this.lastVendorStatusUpdatedDate.formatted.split(" - ")[1]]);
        }
        if (this.lastClientStatusUpdatedDate != undefined && this.lastClientStatusUpdatedDate != "") {
          queryParam["last_client_status_updated_at"] = JSON.stringify([this.lastClientStatusUpdatedDate.formatted.split(" - ")[0], this.lastClientStatusUpdatedDate.formatted.split(" - ")[1]]);
        }
        if (this.createdAt != undefined && this.createdAt != "") {
          queryParam["created_at"] = JSON.stringify([this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]]);
        }
        if (this.modifiedAt != undefined && this.modifiedAt != "") {
          queryParam["modified_at"] = JSON.stringify([this.modifiedAt.formatted.split(" - ")[0], this.modifiedAt.formatted.split(" - ")[1]]);
        }
        if (this.selectedVendor != "") {
          queryParam["vendor_users"] = this.selectedVendor;
        }
        sessionStorage.setItem("projectInfo", JSON.stringify(data))
        if (status == '' && count == 0) {
          this.router.navigate(['/page/project/leads/'], { queryParams: queryParam });
        } else {
          if (count > 0) {
            queryParam['status'] = status
            this.router.navigate(['/page/project/leads/'], { queryParams: queryParam });
          }
        }
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }
}