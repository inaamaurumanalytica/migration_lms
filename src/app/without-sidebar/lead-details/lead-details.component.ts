import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { MatDialog, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { ClipBoardService } from '../../services/clipboard.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Title } from '@angular/platform-browser';
import { CreateBookingModalComponent } from 'src/app/pages/bookings/create-booking-modal/create-booking-modal.component';
import { ClientLeadEmailCreateModalComponent } from 'src/app/pages/client-lead-profile/client-lead-email-create-modal/client-lead-email-create-modal.component';
import { ClientLeadProfileTaskCreateModalComponent } from 'src/app/pages/client-lead-profile/client-lead-profile-task-create-modal/client-lead-profile-task-create-modal.component';
import { AdminClientProjectModalComponent } from 'src/app/pages/client-lead/admin-client-project-modal/admin-client-project-modal.component';
import { AdminProjectModalComponent } from 'src/app/pages/client-lead/admin-project-modal/admin-project-modal.component';
import { AppointmentModalComponent } from 'src/app/pages/client-lead/appointment-modal/appointment-modal.component';
import { CallsListModalComponent } from 'src/app/pages/client-lead/calls-list-modal/calls-list-modal.component';
import { ClientAssignLeadModalComponent } from 'src/app/pages/client-lead/client-assign-lead-modal/client-assign-lead-modal.component';
import { ClientExportLeadModalComponent } from 'src/app/pages/client-lead/client-export-lead-modal/client-export-lead-modal.component';
import { ClientLeadCreateModalComponent } from 'src/app/pages/client-lead/client-lead-create-modal/client-lead-create-modal.component';
import { ClientLeadDeleteModalComponent } from 'src/app/pages/client-lead/client-lead-delete-modal/client-lead-delete-modal.component';
import { ClientLeadEditModalComponent } from 'src/app/pages/client-lead/client-lead-edit-modal/client-lead-edit-modal.component';
import { ClientLeadFilterModalComponent } from 'src/app/pages/client-lead/client-lead-filter-modal/client-lead-filter-modal.component';
import { ClientLeadInfoModalComponent } from 'src/app/pages/client-lead/client-lead-info-modal/client-lead-info-modal.component';
import { ClientLeadTransferModalComponent } from 'src/app/pages/client-lead/client-lead-transfer-modal/client-lead-transfer-modal.component';
import { ClientLeadWebhookCreateModalComponent } from 'src/app/pages/client-lead/client-lead-webhook-create-modal/client-lead-webhook-create-modal.component';
import { ClientRemarkModalComponent } from 'src/app/pages/client-lead/client-remark-modal/client-remark-modal.component';
import { ClientUploadModalComponent } from 'src/app/pages/client-lead/client-upload-modal/client-upload-modal.component';
import { ConfirmLeadModalComponent } from 'src/app/pages/client-lead/confirm-lead-modal/confirm-lead-modal.component';
import { CopyLeadModalComponent } from 'src/app/pages/client-lead/copy-lead-modal/copy-lead-modal.component';
import { CopyMultipleLeadModalComponent } from 'src/app/pages/client-lead/copy-multiple-lead-modal/copy-multiple-lead-modal.component';
import { CreateMeetingModalComponent } from 'src/app/pages/client-lead/create-meeting-modal/create-meeting-modal.component';
import { LeadDuplicateInfoComponent } from 'src/app/pages/client-lead/lead-duplicate-info/lead-duplicate-info.component';
import { MakeCallComponent } from 'src/app/pages/client-lead/make-call/make-call.component';
import { SetLeadColorModalComponent } from 'src/app/pages/client-lead/set-lead-color-modal/set-lead-color-modal.component';
import { LeadUpdatedToVerifiedStatusModalComponent } from 'src/app/pages/client-master-lead/lead-updated-to-verified-status-modal/lead-updated-to-verified-status-modal.component';
import { LeadVndorUpdatedModalComponent } from 'src/app/pages/client-master-lead/lead-vendor-updated-modal/lead-vendor-updated-modal.component';
import { RegistrationCreateModalComponent } from 'src/app/pages/registration-list/registration-create-modal/registration-create-modal.component';

@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.scss']
})
export class LeadDetailsComponent implements OnInit {

  lead: any = {
    pagination: {},
    leads: []
  }

  showSelect: boolean = false;
  selection = new SelectionModel<string>(true, []);

  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  project: any = JSON.parse(localStorage.getItem("projectInfo"))
  pageIndex: number = 0;
  pageSize: number = 100;
  showComponentLoader: boolean = false

  elasticSearch: string = ""
  createdAt: any = '';
  selectedVendor: any = '';
  filterByClientUser: any = '';
  filterByVendorUser: any = '';
  selectedColor: any = ''
  lastVendorStatusUpdatedDate: any
  lastVendorStatusUpdatedDateFormate: any
  createdAtFormate: any
  lastClientStatusUpdatedDate: any
  lastClientStatusUpdatedDateFormate: any
  selectStatus: any = []

  authToken = localStorage.getItem("token")
  authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
  leads: any[] = []
  leadStatuses: any[] = []

  leadCreateModalComponent: MatDialogRef<ClientLeadCreateModalComponent>;
  leadFilterModalComponent: MatDialogRef<ClientLeadFilterModalComponent>;
  leadInfoModalComponent: MatDialogRef<ClientLeadInfoModalComponent>;
  leadEditModalComponent: MatDialogRef<ClientLeadEditModalComponent>;
  clientRemarkModalComponent: MatDialogRef<ClientRemarkModalComponent>;
  uploadModalComponent: MatDialogRef<ClientUploadModalComponent>
  clientExportLeadModalComponent: MatDialogRef<ClientExportLeadModalComponent>;
  clientLeadDeleteModalComponent: MatDialogRef<ClientLeadDeleteModalComponent>;
  leadWebhookCreateModalComponent: MatDialogRef<ClientLeadWebhookCreateModalComponent>;
  clientAssignLeadModalComponent: MatDialogRef<ClientAssignLeadModalComponent>;
  clientLeadTransferModalComponent: MatDialogRef<ClientLeadTransferModalComponent>
  ClientLeadProfileTaskCreateModalComponent: MatDialogRef<ClientLeadProfileTaskCreateModalComponent>
  clientLeadEmailCreateModalComponent: MatDialogRef<ClientLeadEmailCreateModalComponent>
  setLeadColorModalComponent: MatDialogRef<SetLeadColorModalComponent>
  appointmentModalComponent: MatDialogRef<AppointmentModalComponent>
  copyLeadModalComponent: MatDialogRef<CopyLeadModalComponent>
  callsListModalComponent: MatDialogRef<CallsListModalComponent>
  copyMultipleLeadModalComponent: MatDialogRef<CopyMultipleLeadModalComponent>
  adminProjectModalComponent: MatDialogRef<AdminProjectModalComponent>
  clientLeadWebhookCreateModalComponent: MatDialogRef<ClientLeadWebhookCreateModalComponent>
  confirmLeadModalComponent: MatDialogRef<ConfirmLeadModalComponent>
  leadVndorUpdatedModalComponent: MatDialogRef<LeadVndorUpdatedModalComponent>
  adminClientProjectModalComponent: MatDialogRef<AdminClientProjectModalComponent>
  makeCallComponent: MatDialogRef<MakeCallComponent>
  registrationCreateModalComponent: MatDialogRef<RegistrationCreateModalComponent>
  leadUpdatedToVerifiedStatusModalComponent: MatDialogRef<LeadUpdatedToVerifiedStatusModalComponent>
  positiveLeads: any = ""

  exportLeadShow: boolean = false

  leadId: any;
  leadDetail: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
    private _activatedRoute: ActivatedRoute
  ) {

    this.leadId = this._activatedRoute.snapshot.paramMap.get('id')
    console.log(this.leadId)

    this.showComponentLoader = true
    this.titleService.setTitle("AutomateLeads - Project - Leads")
    this.activatedRoute.queryParams.subscribe(el => {
      if (el.status != undefined) {
        this.selectStatus.push(el.status)
      }
      if (el.last_vendor_status_updated_at != undefined && el.last_vendor_status_updated_at != "") {
        this.lastVendorStatusUpdatedDate = JSON.parse(el.last_vendor_status_updated_at);
      }
      if (el.last_client_status_updated_at != undefined && el.last_client_status_updated_at != "") {
        this.lastClientStatusUpdatedDate = JSON.parse(el.last_client_status_updated_at);
      }
      if (el.created_at != undefined && el.created_at != "") {
        this.createdAt = JSON.parse(el.created_at);
      }
      if (el.vendor_users != "") {
        this.filterByVendorUser = el.vendor_users
      }
    })
    
    // if (localStorage.getItem("projectInfo") == undefined) {
    //   this.router.navigate(['page/project']);
    //   return;
    // } else {
    //   this.clipBoardService.projectInfo = JSON.parse(localStorage.getItem("projectInfo"));
    //   this.project = this.clipBoardService.projectInfo
    // }

    if (this.userInfo != null) {
      if (this.userInfo.admin) {
        this.exportLeadShow = true;
      }
      if (this.userInfo.permissions.length != 0) {
        this.userInfo.permissions.forEach(element => {
          if (element.name == "export") {
            this.exportLeadShow = true;
          }
        });
      }
    }
  }

  ngOnInit() {
    //this.getProjectById()
    this.getLeadDetail();
  }

  getProjectById() {
    this.serverService.getProjectById(this.project, this.authToken).subscribe(data => {
        this.project = data
        this.getAllLeads()
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getLeadDetail() {

    this.showComponentLoader = true

    this.serverService.getLeadDetailById(this.leadId, this.authToken).subscribe(data => {
      this.leadDetail = data;
      //console.log(this.leadDetail)
      this.showComponentLoader = false
    },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      })

  }

  getAllLeads() {
    this.showComponentLoader = true
    let body = {
      "query": "*",
      "filters": {
        "project_id": this.project.id,
      }
    }
    if (this.elasticSearch.trim() != "") {
      body.query = this.elasticSearch
    }
    if (this.lastVendorStatusUpdatedDate != undefined && this.lastVendorStatusUpdatedDate != "") {
      if (this.lastVendorStatusUpdatedDate.formatted != undefined) {
        body.filters["last_vendor_status_updated_at"] = [this.lastVendorStatusUpdatedDate.formatted.split(" - ")[0], this.lastVendorStatusUpdatedDate.formatted.split(" - ")[1]];
      } else {
        body.filters["last_vendor_status_updated_at"] = this.lastVendorStatusUpdatedDate
      }
    }
    if (this.lastClientStatusUpdatedDate != undefined && this.lastClientStatusUpdatedDate != "") {
      if (this.lastClientStatusUpdatedDate.formatted != undefined) {
        body.filters["last_client_status_updated_at"] = [this.lastClientStatusUpdatedDate.formatted.split(" - ")[0], this.lastClientStatusUpdatedDate.formatted.split(" - ")[1]];
      } else {
        body.filters["last_client_status_updated_at"] = this.lastClientStatusUpdatedDate
      }
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      if (this.createdAt.formatted != undefined) {
        body.filters["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
      } else {
        body.filters["created_at"] = this.createdAt
      }
    }
    if (this.selectedVendor != "") {
      body.filters["vendor_id"] = this.selectedVendor;
    }
    if (this.filterByClientUser != "") {
      body.filters["client_assignee_id"] = this.filterByClientUser;
    }
    if (this.filterByVendorUser != "") {
      body.filters["vendor_assignee_id"] = this.filterByVendorUser;
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
              //console.log(this.leads)
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

    if (this.selectedVendor != undefined && this.selectedVendor != "") {
      body['selectedVendor'] = this.selectedVendor
    }
    if (this.filterByClientUser != undefined && this.filterByClientUser != "") {
      body['filterByClientUser'] = this.filterByClientUser
    }
    if (this.filterByVendorUser != undefined && this.filterByVendorUser != "") {
      body['filterByVendorUser'] = this.filterByVendorUser
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
        if (result.selectedVendor != undefined && result.selectedVendor != "") {
          this.selectedVendor = result.selectedVendor
        } else {
          this.selectedVendor = ""
        }
        if (result.filterByClientUser != undefined && result.filterByClientUser != "") {
          this.filterByClientUser = result.filterByClientUser
        } else {
          this.filterByClientUser = ""
        }
        if (result.filterByVendorUser != undefined && result.filterByVendorUser != "") {
          this.filterByVendorUser = result.filterByVendorUser
        } else {
          this.filterByVendorUser = ""
        }
        if (result.selectedColor != undefined && result.selectedColor != "") {
          this.selectedColor = result.selectedColor
        } else {
          this.selectedColor = ""
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

  create() {
    (<any>window).ga("send", "event", {
      eventCategory: "Leads",
      eventLabel: this.userInfo.email,
      eventAction: "Create Lead"
    });
    this.leadCreateModalComponent = this.dialog.open(ClientLeadCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.project
    });
    this.leadCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
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
    let url = "leads_search?per_page=" + this.pageSize + "&page=" + indexPage;
    let body = {
      "query": "*",
      "filters": {
        "project_id": this.project.id
      }
    }
    if (this.elasticSearch.trim() != "") {
      body.query = this.elasticSearch
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
    if (this.filterByClientUser != "") {
      body.filters["client_assignee_id"] = this.filterByClientUser;
    }
    if (this.filterByVendorUser != "") {
      body.filters["vendor_assignee_id"] = this.filterByVendorUser;
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

  leadInfo(lead) {
    this.leadInfoModalComponent = this.dialog.open(ClientLeadInfoModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: lead
    });
  }

  edit(lead) {
    (<any>window).ga('send', 'event', {
      eventCategory: 'Projects',
      eventLabel: this.userInfo.email,
      eventAction: 'Edit Lead'
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
        //this.getAllLeads()
        this.getLeadDetail()
      }      
    })
  }

  compareObjects(o1: any, o2: any) {
    if (o1.id == o2.id) {
      return true;
    } else {
      return false
    }
  }

  leadProfile(lead) {
    localStorage.setItem("leadInfo", JSON.stringify(lead));
    this.router.navigate(['page/project/leads/profile/' + this.project.id])
  }

  remarks(data, val) {
    data.member_type = val
    this.clientRemarkModalComponent = this.dialog.open(ClientRemarkModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: data
    });
    this.clientRemarkModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        delete data.member_type
        delete data.status_description
        this.serverService.updateLead(data, result, this.authToken).subscribe(
          data => {
            data = result
            this.clipBoardService.showMessgeInText("Lead Updated Succesfully", "success-snackbar")
          },
          err => {
            this.clipBoardService.checkServerError(err, this.authToken)
          }
        )
      }
    })
  }

  updateLeadStatus(element) {

    (<any>window).ga('send', 'event', {
      eventCategory: 'Projects',
      eventLabel: this.userInfo.email,
      eventAction: 'Lead Status - ' + element.lead_status
    });
    let body = {
      "lead_status": element.lead_status,
    }
    if (this.userInfo.member_type == "Vendor") {
      if (element.lead_status != "Verified" && element.lead_status != "Appointment Proposed") {
        let arrayForm = ["Closed/Won", "Interested", "Not Interested", "Not Responding", "Not Available", "Contacted", "Follow Up", "Site Visit"]
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
                  this.clipBoardService.checkServerError(err, this.authToken)
                }
              )
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
                this.clipBoardService.checkServerError(err, this.authToken)
              }
            )
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
              delete result["status_description"]
              this.serverService.updateLead(element, result, this.authToken).subscribe(
                data => {
                  element = result
                  element.lead_status_new = element.lead_status;
                  this.clipBoardService.showMessgeInText("Appointment Updated Successfully", "success-snackbar")
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
              body["vendor_remark"] = result
              body["vendor_remark_new"] = result
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
      let arrayForm = ["Not Interested", "Not Responding", "Not Available"]
      let arrayForm1 = ["Closed/Won", "Interested", "Follow Up", "Site Visit"]
      let arrayForm2 = ["Interested", "Closed/Won", "Contacted", "Site Visit", "Follow Up", "Not Interested"]
      var result = new Date(element.last_vendor_status_updated_at);
      result.setDate(result.getDate() + 2);
      if (Date.parse(result.toString()) < Date.now()) {
        arrayForm1.push("Verified")
        arrayForm1.push("Contacted")
      }
      if (arrayForm2.includes(element.lead_status)) {
        element.member_type = 'Client'
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
            delete element.member_type
            element.client_remark = result.client_remark.trim()
            body["client_remark"] = element.client_remark
            body["status_description"] = result.status_description
            this.serverService.updateLead(element, body, this.authToken).subscribe(
              data => {
                element.client_remark_new = element.client_remark
                element.lead_status_new = element.lead_status;
                this.clipBoardService.showMessgeInText("Lead Updated Successfully", "success-snackbar")
              },
              err => {
                element.client_remark_new = result.client_remark_new
                element.lead_status = element.lead_status_new;
                this.clipBoardService.checkServerError(err, this.authToken)
              }
            )
          } else {
            element.lead_status = element.lead_status_new;
          }
        });
      } else if (arrayForm.includes(element.lead_status) && !arrayForm1.includes(element.lead_status_new)) {
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
            element.client_remark = result.trim()
            element.client_remark_new = result.trim()
            body["client_remark"] = element.client_remark
            this.serverService.updateLead(element, body, this.authToken).subscribe(
              data => {
                element.lead_status_new = element.lead_status;
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
        });
      } else {
        this.serverService.updateLead(element, body, this.authToken).subscribe(
          data => {
            element.lead_status_new = element.lead_status;
            this.clipBoardService.showMessgeInText("Lead Updated Successfully", "success-snackbar")
          },
          err => {
            element.lead_status = element.lead_status_new;
            this.clipBoardService.checkServerError(err, this.authToken)
          }
        )
      }
    }
  }

  uploadLead() {
    (<any>window).ga('send', 'event', {
      eventCategory: 'Projects',
      eventLabel: this.userInfo.email,
      eventAction: 'Upload Bulk Lead'
    });
    this.uploadModalComponent = this.dialog.open(ClientUploadModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.project
    });

    this.uploadModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllLeads()
      }
    })
  }

  backToProjects() {
    localStorage.removeItem("leadInfo")
    localStorage.removeItem("projectInfo")
    this.router.navigate(["page/project"])
  }

  setting() {
    this.leadWebhookCreateModalComponent = this.dialog.open(ClientLeadWebhookCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '100%',
      maxWidth: '100vw',
      panelClass: 'cdk-overlay-panel-right-side',
    });

    this.leadWebhookCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllLeads()
      }
    })
  }

  exportLead() {
    this.clientExportLeadModalComponent = this.dialog.open(ClientExportLeadModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.project
    });

    this.clientExportLeadModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllLeads()
      }
    })

  }

  delete(lead) {
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

  openAssignUserDialog(element) {
    this.clientAssignLeadModalComponent = this.dialog.open(ClientAssignLeadModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      data: element,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side'
    })
    this.clientAssignLeadModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllLeads()
      }
    });
  }

  assignMulitpleUser() {
    let body = {
      "id": this.selection.selected,
      "multiple": true,
      "project_id": this.project.id
    }
    this.clientAssignLeadModalComponent = this.dialog.open(ClientAssignLeadModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      data: body,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side'
    })
    this.clientAssignLeadModalComponent.afterClosed().subscribe(result => {
      this.selection.clear();
      this.getAllLeads()
    });
  }

  transferLead() {
    this.clientLeadTransferModalComponent = this.dialog.open(ClientLeadTransferModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      maxWidth: '100vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.project
    });
    this.clientLeadTransferModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.getAllLeads()
      }
    })
  }

  refresh() {
    this.elasticSearch = ""
    this.createdAt = '';
    this.selectedVendor = '';
    this.filterByClientUser = '';
    this.filterByVendorUser = '';
    this.selectedColor = ''
    this.lastVendorStatusUpdatedDate = ""
    this.lastClientStatusUpdatedDate = ""
    this.selectStatus = []
    this.showSelect = false
    this.clipBoardService.projectInfo = JSON.parse(localStorage.getItem("projectInfo"));
    this.project = this.clipBoardService.projectInfo
    this.getAllLeads()
  }

  notifyUser(val) {
    (<any>window).ga('send', 'event', {
      eventCategory: 'Projects',
      eventLabel: this.userInfo.email,
      eventAction: 'Notify User'
    });
    this.serverService.notifyUser(val, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText(data.message, 'success-snackbar')
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
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

  leadCopy(element) {
    this.copyLeadModalComponent = this.dialog.open(CopyLeadModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

  viewCalls(element) {
    this.callsListModalComponent = this.dialog.open(CallsListModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '100%',
      maxWidth: '100vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

  openTransferLead() {
    this.clientLeadTransferModalComponent = this.dialog.open(ClientLeadTransferModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.project
    });
    this.clientLeadTransferModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.selection.clear();
        this.refresh()
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

  copyToProject() {
    let body = {
      "projectInfo": this.project,
      "selectedLeads": this.selection.selected
    }
    this.copyMultipleLeadModalComponent = this.dialog.open(CopyMultipleLeadModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body,
    });
  }

  openAdminProjectSetting() {
    this.adminProjectModalComponent = this.dialog.open(AdminProjectModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.project
    });
    this.adminProjectModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.selection.clear();
        this.getProjectById()
      }
    });
  }

  webhook() {
    this.clientLeadWebhookCreateModalComponent = this.dialog.open(ClientLeadWebhookCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '100vw',
      maxWidth: '100vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.project
    });
  }

  openClientAdminProjectSetting() {
    this.adminClientProjectModalComponent = this.dialog.open(AdminClientProjectModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '50vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.clipBoardService.projectInfo
    });
    this.adminClientProjectModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.selection.clear();
        this.getProjectById()
      }
    });
  }

  copy(val: string) {
    val = this.serverService.apiUrl + val;
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.clipBoardService.showMessgeInText("Link Copied", "success-snackbar")
  }

  makeCall(element) {
    this.makeCallComponent = this.dialog.open(MakeCallComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      data: element
    });

    this.makeCallComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        return element = result
      }
    });
  }

  register() {
    this.registrationCreateModalComponent = this.dialog.open(RegistrationCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.project
    });
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

  removeSearch() {
    this.elasticSearch = ""
    this.getAllLeads()
  }

  viewDuplicateInfo(lead) {
    this.dialog.open(LeadDuplicateInfoComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '50vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: lead,
    });
  }

  createMeeting(lead) {
    this.dialog.open(CreateMeetingModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '50vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: lead
    });
  }

  createBooking(lead) {
    let body = {
      "bookingData": lead,
      "leadCreate": true
    }
    this.dialog.open(CreateBookingModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '30vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
  }

}
