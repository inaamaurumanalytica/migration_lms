import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { SelectionModel } from "@angular/cdk/collections";

import { ClientLeadFilterModalComponent } from '../client-lead/client-lead-filter-modal/client-lead-filter-modal.component'
import { ClientRemarkModalComponent } from '../client-lead/client-remark-modal/client-remark-modal.component'
import { ClientLeadInfoModalComponent } from '../client-lead/client-lead-info-modal/client-lead-info-modal.component'
import { ClientLeadEmailCreateModalComponent } from '../client-lead-profile/client-lead-email-create-modal/client-lead-email-create-modal.component';
import { ClientLeadProfileTaskCreateModalComponent } from '../client-lead-profile/client-lead-profile-task-create-modal/client-lead-profile-task-create-modal.component';
import { ClientAssignLeadModalComponent } from '../client-lead/client-assign-lead-modal/client-assign-lead-modal.component';
import { ClientLeadDeleteModalComponent } from '../client-lead/client-lead-delete-modal/client-lead-delete-modal.component';
import { ClientLeadEditModalComponent } from '../client-lead/client-lead-edit-modal/client-lead-edit-modal.component';
import { ClientLeadCreateModalComponent } from '../client-lead/client-lead-create-modal/client-lead-create-modal.component';
import { ClientExportLeadModalComponent } from '../client-lead/client-export-lead-modal/client-export-lead-modal.component';
import { SetLeadColorModalComponent } from '../client-lead/set-lead-color-modal/set-lead-color-modal.component';
import { CopyLeadModalComponent } from '../client-lead/copy-lead-modal/copy-lead-modal.component';
import { AppointmentModalComponent } from '../client-lead/appointment-modal/appointment-modal.component';
import { ClientUploadModalComponent } from '../client-lead/client-upload-modal/client-upload-modal.component';
import { ConfirmLeadModalComponent } from '../client-lead/confirm-lead-modal/confirm-lead-modal.component';
import { LeadVndorUpdatedModalComponent } from './lead-vendor-updated-modal/lead-vendor-updated-modal.component';
import { Title } from '@angular/platform-browser';
import { LeadUpdatedToVerifiedStatusModalComponent } from './lead-updated-to-verified-status-modal/lead-updated-to-verified-status-modal.component';
@Component({
  selector: 'app-client-master-lead',
  templateUrl: './client-master-lead.component.html',
  styleUrls: ['./client-master-lead.component.scss']
})
export class ClientMasterLeadComponent {
  status = "Not Interested"
  lead: any = {
    pagination: {},
    leads: []
  }
  showSelect: boolean = false;
  selection = new SelectionModel<string>(true, []);

  showLeadPermsissions: boolean = false
  showLeadExport: boolean = false
  showLeadImport: boolean = false
  showLeadProfile: boolean = false
  showLeadWebhook: boolean = false
  showLeadTransfer: boolean = false
  showMailer: boolean = false
  showTask: boolean = false
  showLeadSms: boolean = false

  elasticSearch: string = ""
  pageIndex: number = 0;
  pageSize: number = 100;
  showComponentLoader: boolean = false
  selectChannelPartner: any
  selectVendorAssignee: any
  selectedProject: any = ''
  selectedColor: any = ''
  selectedClient: any = ''
  selectedVendor: any = ''
  selectSource: any[] = []
  selectLastModifiedBy: any;
  selectLeadType: any;
  lastVendorStatusUpdatedDate: any
  lastVendorStatusUpdatedDateFormate: any
  createdAtFormate: any
  lastClientStatusUpdatedDate: any
  lastClientStatusUpdatedDateFormate: any
  selectStatus: any = []
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  authToken = localStorage.getItem("token")
  authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
  leads: any[] = []
  leadStatuses: any[] = []
  createdAt: any;


  leadFilterModalComponent: MatDialogRef<ClientLeadFilterModalComponent>
  clientRemarkModalComponent: MatDialogRef<ClientRemarkModalComponent>
  leadEditModalComponent: MatDialogRef<ClientLeadEditModalComponent>;
  clientLeadInfoModalComponent: MatDialogRef<ClientLeadInfoModalComponent>
  clientLeadEmailCreateModalComponent: MatDialogRef<ClientLeadEmailCreateModalComponent>
  ClientLeadProfileTaskCreateModalComponent: MatDialogRef<ClientLeadProfileTaskCreateModalComponent>
  clientAssignLeadModalComponent: MatDialogRef<ClientAssignLeadModalComponent>
  clientLeadDeleteModalComponent: MatDialogRef<ClientLeadDeleteModalComponent>
  clientLeadCreateModalComponent: MatDialogRef<ClientLeadCreateModalComponent>
  clientExportLeadModalComponent: MatDialogRef<ClientExportLeadModalComponent>
  setLeadColorModalComponent: MatDialogRef<SetLeadColorModalComponent>
  copyLeadModalComponent: MatDialogRef<CopyLeadModalComponent>
  appointmentModalComponent: MatDialogRef<AppointmentModalComponent>
  clientUploadModalComponent: MatDialogRef<ClientUploadModalComponent>
  confirmLeadModalComponent: MatDialogRef<ConfirmLeadModalComponent>
  leadVndorUpdatedModalComponent: MatDialogRef<LeadVndorUpdatedModalComponent>
  leadUpdatedToVerifiedStatusModalComponent: MatDialogRef<LeadUpdatedToVerifiedStatusModalComponent>
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService
  ) {
    sessionStorage.removeItem('leadInfo');
    sessionStorage.removeItem('projectInfo');
    sessionStorage.removeItem('masterLead');

    this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Leads');
  }

  ngOnInit() {
    
   
    this.getAllLeads()
  }

  getAllLeads() {
    // sessionStorage.clear()
    this.showComponentLoader = true
    let body = {
      "query": "*",
      "filters": {
      }
    }
    if (this.elasticSearch.trim() != "") {
      body.query = this.elasticSearch
    }

    if (this.selectedProject != "") {
      body.filters["project_id"] = this.selectedProject;
    }
    if (this.lastVendorStatusUpdatedDate != undefined && this.lastVendorStatusUpdatedDate != "") {
      body.filters["last_vendor_status_updated_at"] = [this.lastVendorStatusUpdatedDate.formatted.split(" - ")[0], this.lastVendorStatusUpdatedDate.formatted.split(" - ")[1]];
    }
    if (this.lastClientStatusUpdatedDate != undefined && this.lastClientStatusUpdatedDate != "") {
      body.filters["last_client_status_updated_at"] = [this.lastClientStatusUpdatedDate.formatted.split(" - ")[0], this.lastClientStatusUpdatedDate.formatted.split(" - ")[1]];
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body.filters["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
    }
    if (this.selectedVendor != "") {
      body.filters["vendor_id"] = this.selectedVendor;
    }
    if (this.selectedClient != "") {
      body.filters["client_id"] = this.selectedClient;
    }
    if (this.selectedColor != undefined && this.selectedColor != "") {
      if (this.userInfo.member_type == "Vendor") {
        body.filters["vendor_color_id"] = this.selectedColor;
      } else {
        body.filters["client_color_id"] = this.selectedColor;
      }
    }
    if (this.selectStatus.length != 0) {
      body.filters["statuses"] = this.selectStatus;
    }
    let newData = []
    this.pageIndex = 0;
    this.pageSize = 100;
    let url = "leads_search?per_page=" + this.pageSize + "&page=" + this.pageIndex;
    this.serverService.leadsElasticSearch(url, body, this.authToken).subscribe(
      data => {
        this.lead = data;
        if (data.leads.length != 0) {
          data.leads.forEach((element, index) => {
            element._source.lead_status_new = element._source.lead_status;
            element._source.client_remark_new = element._source.client_remark
            element._source.vendor_remark_new = element._source.vendor_remark
            newData.push(element._source)
            this.leads = Object.assign([], newData)
          });
        } else {
          this.leads = Object.assign([], newData)
        }
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
    if (this.selectedProject != undefined && this.selectedProject != "") {
      body['selectedProject'] = this.selectedProject
    }
    if (this.selectedClient != undefined && this.selectedClient != "") {
      body['selectedClient'] = this.selectedClient
    }
    if (this.selectedVendor != undefined && this.selectedVendor != "") {
      body['selectedVendor'] = this.selectedVendor
    }
    if (this.selectStatus != undefined && this.selectStatus.length != 0) {
      body["selectStatus"] = this.selectStatus
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
    if (this.selectedColor != undefined && this.selectedColor != "") {
      body["selectedColor"] = this.selectedColor
    }
    body["master"] = true
    this.leadFilterModalComponent = this.dialog.open(ClientLeadFilterModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
    this.leadFilterModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        if (result.selectedProject != undefined && result.selectedProject != "") {
          this.selectedProject = result.selectedProject
        } else {
          this.selectedProject = ""
        }
        if (result.selectedClient != undefined && result.selectedClient != "") {
          this.selectedClient = result.selectedClient
        } else {
          this.selectedClient = ""
        }
        if (result.selectedVendor != undefined && result.selectedVendor != "") {
          this.selectedVendor = result.selectedVendor
        } else {
          this.selectedVendor = ""
        }
        if (result.selectStatus != undefined && result.selectStatus.length != 0) {
          this.selectStatus = result.selectStatus
        } else {
          this.selectStatus = []
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
        this.getAllLeads()
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
    let url = "leads_search/?per_page=" + body1.per_page + "&page=" + indexPage;
    let body = {
      "query": "*",
      "filters": {
      }
    }
    if (this.elasticSearch.trim() != '') {
      body.query = this.elasticSearch
    }
    if (this.selectedProject != "") {
      body.filters["project_id"] = this.selectedProject;
    }
    if (this.lastVendorStatusUpdatedDate != undefined && this.lastVendorStatusUpdatedDate != "") {
      body.filters["last_vendor_status_updated_at"] = [this.lastVendorStatusUpdatedDate.formatted.split(" - ")[0], this.lastVendorStatusUpdatedDate.formatted.split(" - ")[1]];
    }
    if (this.lastClientStatusUpdatedDate != undefined && this.lastClientStatusUpdatedDate != "") {
      body.filters["last_client_status_updated_at"] = [this.lastClientStatusUpdatedDate.formatted.split(" - ")[0], this.lastClientStatusUpdatedDate.formatted.split(" - ")[1]];
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body.filters["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
    }
    if (this.selectedVendor != "") {
      body.filters["vendor_id"] = this.selectedVendor;
    }
    if (this.selectedClient != "") {
      body.filters["client_id"] = this.selectedClient;
    }
    if (this.selectedColor != undefined && this.selectedColor != "") {
      if (this.userInfo.member_type == "Vendor") {
        body.filters["vendor_color_id"] = this.selectedColor;
      } else {
        body.filters["client_color_id"] = this.selectedColor;
      }
    }
    if (this.selectStatus.length != 0) {
      body.filters["statuses"] = this.selectStatus;
    }
    let newData = []
    this.serverService.leadsElasticSearch(url, body, this.authToken).subscribe(
      data => {
        this.lead = data
        if (data.leads.length != 0) {
          data.leads.forEach((element, index) => {
            element._source.new_lead_status = element._source.lead_status
            element._source.client_remark_new = element._source.client_remark
            element._source.vendor_remark_new = element._source.vendor_remark
            newData.push(element._source)
            this.leads = Object.assign([], newData)
          });
        } else {
          this.leads = Object.assign([], newData)
        }
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  compareObjects(o1: any, o2: any) {
    if (o1.id == o2.id) {
      return true;
    } else {
      return false
    }
  }

  leadProfile(lead) {
    // localStorage.setItem("masterLead", "true")
    // localStorage.setItem("projectInfo", JSON.stringify(lead.project))
    // localStorage.setItem("leadInfo", JSON.stringify(lead));
    sessionStorage.setItem("masterLead", "true")
    sessionStorage.setItem("projectInfo", JSON.stringify(lead.project))
    sessionStorage.setItem("leadInfo", JSON.stringify(lead));

    this.router.navigate(['page/project/leads/profile/' + lead.project.id])
  }

  updateLeadStatus(element) {
    (<any>window).ga("send", "event", {
      eventCategory: "Leads",
      eventLabel: this.userInfo.email,
      eventAction: "Lead Status - " + element.lead_status
    });
    let body = {
      lead_status: element.lead_status
    };
    if (this.userInfo.member_type == "Vendor") {
      if (element.lead_status != "Verified" && element.lead_status != "Appointment Proposed") {
        let arrayForm = ["Closed/Won", "Interested", "Not Interested", "Not Responding", "Not Available", "Contacted", "Follow Up", "Site Visit"];
        if (arrayForm.includes(element.lead_status)) {
          this.confirmLeadModalComponent = this.dialog.open(ConfirmLeadModalComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            width: '500px',
            panelClass: 'cdk-overlay-panel-right-side',
            data: element
          });
          this.confirmLeadModalComponent.afterClosed().subscribe(result => {
            if (result != undefined) {
              this.serverService.updateLead(element, body, this.authToken).subscribe(
                data => {
                  element.lead_status_new = element.lead_status;
                  this.clipBoardService.showMessgeInText("Lead Updated Successfully", "success-snackbar")
                },
                err => {
                  element.lead_status = element.lead_status_new;
                  this.clipBoardService.checkServerError(err, this.authToken);
                }
              );
            } else {
              element.lead_status = element.lead_status_new;
            }
          });
        } else {
          if (element.lead_status == "V Not Interested") {
            this.leadVndorUpdatedModalComponent = this.dialog.open(LeadVndorUpdatedModalComponent, {
              hasBackdrop: true,
              disableClose: false,
              autoFocus: true,
              width: '50vw',
              panelClass: 'cdk-overlay-panel-right-side',
              data: element
            });
            this.leadVndorUpdatedModalComponent.afterClosed().subscribe(result => {
              if (result != undefined) {
                body["vendor_remark"] = result.trim()
                body["vendor_remark_new"] = result.trim();
                this.serverService.updateLead(element, body, this.authToken).subscribe(
                  data => {
                    element.lead_status_new = element.lead_status;
                    element.vendor_remark = result
                    element.vendor_remark_new = result
                    this.clipBoardService.showMessgeInText("Lead Updated Successfully", "success-snackbar")
                  },
                  err => {
                    element.lead_status = element.lead_status_new;
                    this.clipBoardService.checkServerError(err, this.authToken)
                  }
                )
              } else {
                element.lead_status = element.lead_status_new;
              }
            })
          } else {
            this.serverService.updateLead(element, body, this.authToken).subscribe(
              data => {
                element.lead_status_new = element.lead_status;
                this.clipBoardService.showMessgeInText("Lead Updated Successfully", "success-snackbar")
              },
              err => {
                element.lead_status = element.lead_status_new;
                this.clipBoardService.checkServerError(err, this.authToken);
              }
            );
          }
        }
      } else {
        if (element.lead_status == "Appointment Proposed") {
          this.appointmentModalComponent = this.dialog.open(AppointmentModalComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            width: '500px',
            panelClass: 'cdk-overlay-panel-right-side',
            data: element
          });
          this.appointmentModalComponent.afterClosed().subscribe(result => {
            if (result != undefined) {
              delete result["status_description"];
              this.serverService.updateLead(element, result, this.authToken).subscribe(
                data => {
                  element = result;
                  element.lead_status_new = element.lead_status;
                  this.clipBoardService.showMessgeInText("Appointment Updated Successfully", "success-snackbar")
                },
                err => {
                  element.lead_status = element.lead_status_new;
                  this.clipBoardService.checkServerError(err, this.authToken);
                }
              );
            } else {
              element.lead_status = element.lead_status_new;
            }
          });
        } else {
          this.leadUpdatedToVerifiedStatusModalComponent = this.dialog.open(LeadUpdatedToVerifiedStatusModalComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            width: '50vw',
            panelClass: 'cdk-overlay-panel-right-side',
            data: element
          });
          this.leadUpdatedToVerifiedStatusModalComponent.afterClosed().subscribe(result => {
            if (result != undefined) {
              body["vendor_remark"] = result.trim()
              body["vendor_remark_new"] = result.trim();
              this.serverService.updateLead(element, body, this.authToken).subscribe(
                data => {
                  element.lead_status_new = element.lead_status;
                  element.vendor_remark = result
                  element.vendor_remark_new = result
                  this.clipBoardService.showMessgeInText("Lead Updated Succesfully", "success-snackbar")
                },
                err => {
                  element.lead_status = element.lead_status_new;
                  this.clipBoardService.checkServerError(err, this.authToken)
                }
              )
            } else {
              element.lead_status = element.lead_status_new;
            }
          });
        }
      }
    } else {
      let arrayForm = ["Not Interested", "Not Responding", "Not Available"];
      let arrayForm1 = ["Closed/Won", "Interested", "Follow Up", "Site Visit"];
      var result = new Date(element.last_vendor_status_updated_at);
      result.setDate(result.getDate() + 2);
      if (Date.parse(result.toString()) < Date.now()) {
        arrayForm1.push("Verified");
        arrayForm1.push("Contacted");
      }
      if (
        arrayForm.includes(element.lead_status) &&
        !arrayForm1.includes(element.lead_status_new)
      ) {
        this.confirmLeadModalComponent = this.dialog.open(ConfirmLeadModalComponent, {
          hasBackdrop: true,
          disableClose: false,
          autoFocus: true,
          width: '500px',
          panelClass: 'cdk-overlay-panel-right-side',
          data: element
        });
        this.confirmLeadModalComponent.afterClosed().subscribe(result => {
          if (result != undefined) {
            element.client_remark = element.client_remark + "\n" + result;
            element.client_remark_new = result;
            body["client_remark"] = element.client_remark;
            this.serverService.updateLead(element, body, this.authToken).subscribe(
              data => {
                element.lead_status_new = element.lead_status;
                this.clipBoardService.showMessgeInText("Laed Updated Successfully", "success-snackbar");
              },
              err => {
                element.lead_status = element.lead_status_new;
                this.clipBoardService.checkServerError(err, this.authToken);
              }
            );
          } else {
            element.lead_status_new = element.lead_status;
          }
        });
      } else {
        this.serverService.updateLead(element, body, this.authToken).subscribe(
          data => {
            element.lead_status_new = element.lead_status;
            this.clipBoardService.showMessgeInText(data.message, "success-snackbar");
          },
          err => {
            element.lead_status = element.lead_status_new;
            this.clipBoardService.checkServerError(err, this.authToken);
          }
        );
      }
    }
  }

  refresh() {
    this.elasticSearch = ""
    this.lastVendorStatusUpdatedDate = ""
    this.selectVendorAssignee = ""
    this.selectedClient = ""
    this.selectedColor = ""
    this.selectedProject = ""
    this.selectedVendor = ""
    this.createdAt = ""
    this.lastClientStatusUpdatedDate = ""
    this.selectStatus = []
    this.getAllLeads()
  }

  remarks(element, val) {
    element.member_type = val;
    this.clientRemarkModalComponent = this.dialog.open(ClientRemarkModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
    this.clientRemarkModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        delete element.member_type;
        delete element.status_description
        this.serverService.updateLead(element, result, this.authToken).subscribe(
          data => {
            element = result;
            this.clipBoardService.showMessgeInText("Lead Updated Succesfully", "success-snackbar")
          },
          err => {
            this.clipBoardService.checkServerError(err, this.authToken);
          }
        );
      }
    })
    if (element.vendor_remark == null) {
      return;
    }
  }

  leadInfo(lead) {
    this.clientLeadInfoModalComponent = this.dialog.open(ClientLeadInfoModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: lead
    });
  }

  deleteLead(lead) {
    this.clientLeadDeleteModalComponent = this.dialog.open(ClientLeadDeleteModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      data: lead
    });

    this.clientLeadDeleteModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllLeads()
      }
    })
  }

  create() {
    (<any>window).ga("send", "event", {
      eventCategory: "Leads",
      eventLabel: this.userInfo.email,
      eventAction: "Create Lead"
    });
    this.clientLeadCreateModalComponent = this.dialog.open(ClientLeadCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side'
    });
    this.clientLeadCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllLeads()
      }
    })
  }

  edit(lead) {
    (<any>window).ga("send", "event", {
      eventCategory: "Leads",
      eventLabel: this.userInfo.email,
      eventAction: "Edit Lead"
    });
    this.leadEditModalComponent = this.dialog.open(ClientLeadEditModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: lead
    });
    this.leadEditModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllLeads()
      }
    })
  }

  backgroundColor(lead) {
    if (this.userInfo.member_type == 'Vendor') {
      return {
        "color": lead.vendor_color_code
      };
    } else {
      return {
        "color": lead.client_color_code
      };
    }
  }

  openExportLead(data) {
    this.clientExportLeadModalComponent = this.dialog.open(ClientExportLeadModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: data
    });
  }

  disableLead(element) {
    this.showComponentLoader = true;
    element.disable = !element.disable;
    let body = {
      disable: element.disable
    };
    this.serverService.updateLead(element, body, this.authToken).subscribe(
      data => {
        if (data.disable) {
          this.clipBoardService.showMessgeInText("Lead Disable Successfully", "success-snackbar")
        } else {
          this.clipBoardService.showMessgeInText("Lead Enable Successfully", "success-snackbar")
        }
        this.showComponentLoader = false;
      },
      err => {
        element.disable = !element.disable;
        this.showComponentLoader = false;
        this.clipBoardService.checkServerError(err, this.authToken);
      }
    );
  }

  setColor(element) {
    this.setLeadColorModalComponent = this.dialog.open(SetLeadColorModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
    this.setLeadColorModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllLeads();
      }
    });
  }

  resetColor(element) {
    this.serverService.resetLeadColor(element.id, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("Reset Color Successfully", "success-snackbar");
        this.getAllLeads();
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken);
      }
    );
  }

  leadCopy(element) {
    element.masteLead = true
    this.copyLeadModalComponent = this.dialog.open(CopyLeadModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

  appointment(element) {
    this.appointmentModalComponent = this.dialog.open(AppointmentModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
    this.appointmentModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.serverService.updateLead(element, result, this.authToken).subscribe(
          data => {
            element = result;
            element.lead_status_new = element.lead_status;
            this.clipBoardService.showMessgeInText("Appointment Updated Succesfully", "success-snackbar")
          },
          err => {
            element.lead_status = element.lead_status_new;
            this.clipBoardService.checkServerError(err, this.authToken);
          });
      }
    });
  }

  uploadLead() {
    (<any>window).ga("send", "event", {
      eventCategory: "Leads",
      eventLabel: this.userInfo.email,
      eventAction: "Bulk Upload Leads"
    });
    this.clientUploadModalComponent = this.dialog.open(ClientUploadModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
    });

    this.clientUploadModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllLeads();
      }
    });
  }

  bulkSelect() {
    this.showSelect = !this.showSelect;
  }
  masterToggle() {
    if (!this.leads) {
      return;
    }

    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.leads.forEach(data => this.selection.select(data.id));
    }
  }

  isAllSelected(): boolean {
    if (!this.leads) {
      return false;
    }
    if (this.selection.isEmpty()) {
      return false;
    }
    return this.selection.selected.length == this.leads.length;
  }

  deleteLeadModal() {

    this.clientLeadDeleteModalComponent = this.dialog.open(ClientLeadDeleteModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      data: this.selection.selected
    });

    this.clientLeadDeleteModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.bulkSelect();
        this.refresh();
      }
    });
  }

  removeSearch() {
    this.elasticSearch = ""
    this.getAllLeads()
  }
}
