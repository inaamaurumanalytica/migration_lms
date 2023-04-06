import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { IMyDrpOptions, IMyDateRangeModel } from 'mydaterangepicker';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { ClientLeadProfileTaskCreateModalComponent } from './client-lead-profile-task-create-modal/client-lead-profile-task-create-modal.component';
import { ClientLeadProfileNoteCreateModalComponent } from './client-lead-profile-note-create-modal/client-lead-profile-note-create-modal.component';
import { ClientLeadAddressCreateModalComponent } from './client-lead-address-create-modal/client-lead-address-create-modal.component';
import { ClientLeadAddressEditModalComponent } from './client-lead-address-edit-modal/client-lead-address-edit-modal.component';
import { ClientLeadEmailCreateModalComponent } from './client-lead-email-create-modal/client-lead-email-create-modal.component';
import { ClientLeadAttachmentCreateModalComponent } from './client-lead-attachment-create-modal/client-lead-attachment-create-modal.component';
import { ClientLeadProfileEditModalComponent } from './client-lead-profile-task-edit-modal/client-lead-profile-task-edit-modal.component';
import { ClientLeadProfileNoteEditModalComponent } from './client-lead-profile-note-edit-modal/client-lead-profile-note-edit-modal.component';
import { ClientTaskMarkDoneModalComponent } from './client-task-mark-done-modal/client-task-mark-done-modal.component';
import { ClientTaskDeleteModalComponent } from './client-task-delete-modal/client-task-delete-modal.component'
import { ClientNoteDeleteModalComponent } from './client-note-delete-modal/client-note-delete-modal.component'
import { ClientDocumentDeleteModalComponent } from './client-document-delete-modal/client-document-delete-modal.component'
import { ClientAddressDeleteModalComponent } from './client-address-delete-modal/client-address-delete-modal.component'
import { ClientEditProfileModalComponent } from './client-edit-profile-modal/client-edit-profile-modal.component'
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-client-lead-profile',
  templateUrl: './client-lead-profile.component.html',
  styleUrls: ['./client-lead-profile.component.scss']
})
export class ClientLeadProfileComponent {

  Object = Object;
  showComponentLoader: boolean = false
  showComponentLoader1: boolean = false
  callAllLinks: boolean = true
  authToken = localStorage.getItem("token")
  authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  projectInfo: any = JSON.parse(sessionStorage.getItem("projectInfo"))
  leadInfo: any = JSON.parse(sessionStorage.getItem("leadInfo"))
  // Profile Fileds
  profile: any = {}

  // Task Fields
  taskCategory: any[] = []
  profileTask = {
    "tasks": [],
    "pagination": {}
  }
  filterTaskCreateDate: any;
  filterTaskDueDate: any;
  filterTask = {
    "task_category": "",
    "priority": "",
  }
  pageTaskIndex: number = 1;
  pageTaskSize: number = 25;

  // Notes Field
  profileNote = {
    "notes": [],
    "pagination": {}
  }
  pageNoteIndex: number = 1
  pageNoteSize: number = 25
  filterNoteCreateDate: any;
  filterNoteModified: any;
  // Mail Field
  profileMail = {
    "mailings": [],
    "pagination": {}
  }
  filterMailingCreateDate: any;
  pageMailIndex: number = 1;
  pageMailSize: number = 25;
  // Attachment Field
  profileAttachment = {
    "lead_attachments": [],
    "pagination": {}
  }
  leadAttachment = {}
  pageAttachmentIndex: number = 1;
  pageAttachmentSize: number = 25;
  // Reamrk
  leadRemark = {}
  // Logs Keys
  profileLogs: any = {
    "time_lines": [],
    "pagination": {}
  }
  filterLogsCreateDate: any;
  filterLogs = {
    "lms_object_type": "",
    "action": "",
    "user": ""
  }

  // Vendor Remark
  pageLeadVendorRemarkIndex: number = 1
  pageLeadVendorRemarkSize: number = 25
  leadVendorRemark: any = {
    "vendor_remarks": [],
    "pagination": {}
  }

  // Client Remark
  pageLeadClientRemarkIndex: number = 1
  pageLeadClientRemarkSize: number = 25
  leadClientRemark: any = {
    "client_remarks": [],
    "pagination": {}
  }


  showSkeleton: boolean = true;
  hideObjectType: boolean = false
  hideProfile: boolean = false
  hideLeadAttachment: boolean = false
  hideSms: boolean = false
  mailing: boolean = false;
  pageLogIndex: number = 1;
  pageLogSize: number = 25;
  primaryAddress: any = {}

  showMoreInfo: boolean = false

  projectPermission: any[] = []
  showProfilePermsissions: boolean = false

  users: any[] = []

  callList = {
    calls: []
  }

  project = {}

  ClientLeadProfileTaskCreateModalComponent: MatDialogRef<ClientLeadProfileTaskCreateModalComponent>;
  clientLeadProfileEditModalComponent: MatDialogRef<ClientLeadProfileEditModalComponent>;
  clientLeadProfileNoteCreateModalComponent: MatDialogRef<ClientLeadProfileNoteCreateModalComponent>;
  clientLeadProfileNoteEditModalComponent: MatDialogRef<ClientLeadProfileNoteEditModalComponent>;
  clientLeadAddressCreateModalComponent: MatDialogRef<ClientLeadAddressCreateModalComponent>;
  clientLeadAddressEditModalComponent: MatDialogRef<ClientLeadAddressEditModalComponent>;
  clientLeadEmailCreateModalComponent: MatDialogRef<ClientLeadEmailCreateModalComponent>;
  clientLeadAttachmentCreateModalComponent: MatDialogRef<ClientLeadAttachmentCreateModalComponent>;
  clientTaskMarkDoneModalComponent: MatDialogRef<ClientTaskMarkDoneModalComponent>;
  clientTaskDeleteModalComponent: MatDialogRef<ClientTaskDeleteModalComponent>;
  clientNoteDeleteModalComponent: MatDialogRef<ClientNoteDeleteModalComponent>;
  clientAddressDeleteModalComponent: MatDialogRef<ClientAddressDeleteModalComponent>;
  clientDocumentDeleteModalComponent: MatDialogRef<ClientDocumentDeleteModalComponent>;
  clientEditProfileModalComponent: MatDialogRef<ClientEditProfileModalComponent>;

  myDateRangePickerOptions = {     
    dateFormat: 'dd.mm.yyyy'      
};


  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private serverService: ServerService,
    private router: Router,
    private route: ActivatedRoute,
    private clipBoardService: ClipBoardService
    ) {
    this.titleService.setTitle('AutomateLeads - Lead Profile');
    if (sessionStorage.getItem("leadInfo") == null) {
      this.router.navigate(["/page/project/leads"]);
      return
    }
    this.route.params.subscribe(params => {
			if (params != undefined) {
				this.project = params
			}
		});
    this.leadInfo = JSON.parse(sessionStorage.getItem("leadInfo"))
    this.leadInfo["shortName"] = this.leadInfo.name.match(/\b(\w)/g).join('')
    // sessionStorage.removeItem('masterLead');
    // sessionStorage.removeItem('leadInfo')
  }

  ngOnInit() {
    this.showComponentLoader = true
    this.getProfiles()
    this.usersList()
    // sessionStorage.removeItem('masterLead');
    // sessionStorage.removeItem('leadInfo')
  }

  usersList() {
    this.serverService.usersList(this.authToken).subscribe(
      data => {
        this.users = data.users
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getProfiles() {
    this.serverService.getLeadProfile(this.leadInfo, this.authToken).subscribe(
      data => {
        this.profile = data;
        if (data.addresses.length != 0) {
          this.primaryAddress = data.addresses.filter(el => el.is_primary)[0];
        }

        if (this.callAllLinks) {
          this.getProfileTasks()
          this.getProfileNote()
          this.getProfileMail()
          this.getProfileAttachment()


          if (this.userInfo.member_type == 'Vendor' || this.projectInfo.recording_access_to_client) {
            this.getCallsList()
          }
          if (this.userInfo.member_type == "Vendor") {
            this.getProfileLogs()
            this.getVendorRemarkList()
          }
          this.getClientRemarkList()
        }
        this.showComponentLoader = false
        this.showComponentLoader1 = false
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
        this.showComponentLoader = false
        this.showComponentLoader1 = false
      }
    )
  }

  getProfileTasks() {
    let url = "lead_id=" + this.leadInfo.id + "&per_page=" + this.pageTaskSize + "&page=" + this.pageTaskIndex
    if (this.filterTask.task_category != "") {
      url += '&task_category=' + this.filterTask.task_category
    }
    if (this.filterTask.priority != "") {
      url += '&priority=' + this.filterTask.priority
    }
    if (this.filterTaskCreateDate != undefined && this.filterTaskCreateDate != "") {
      if (this.filterTaskCreateDate.length != undefined && this.filterTaskCreateDate.length != 0) {
        url += '&created_at=' + JSON.stringify(this.filterTaskCreateDate)
      } else {
        this.filterTaskCreateDate = [this.filterTaskCreateDate.beginDate.year + '-' + this.filterTaskCreateDate.beginDate.month + '-' + this.filterTaskCreateDate.beginDate.day, this.filterTaskCreateDate.endDate.year + '-' + this.filterTaskCreateDate.endDate.month + '-' + this.filterTaskCreateDate.endDate.day];
        url += '&created_at=' + JSON.stringify(this.filterTaskCreateDate)
      }
    }

    if (this.filterTaskDueDate != undefined && this.filterTaskDueDate != "") {
      if (this.filterTaskDueDate.length != undefined && this.filterTaskDueDate.length != 0) {
        url += '&due_date=' + JSON.stringify(this.filterTaskDueDate)
      } else {
        this.filterTaskDueDate = [this.filterTaskDueDate.beginDate.year + '-' + this.filterTaskDueDate.beginDate.month + '-' + this.filterTaskDueDate.beginDate.day, this.filterTaskDueDate.endDate.year + '-' + this.filterTaskDueDate.endDate.month + '-' + this.filterTaskDueDate.endDate.day];
        url += '&due_date=' + JSON.stringify(this.filterTaskDueDate)
      }
    }

    this.serverService.leadProfileTask(url, this.authToken).subscribe(
      data => {
        this.profileTask = data
        this.showComponentLoader1 = false
      },
      err => {
        this.showComponentLoader1 = true
        this.clipBoardService.checkServerError(err, this.authToken)
        this.showComponentLoader = false
      }
    )
  }

  getProfileNote() {
    let url = "lead_id=" + this.leadInfo.id + "&per_page=" + this.pageNoteSize + "&page=" + this.pageNoteIndex;
    if (this.filterNoteCreateDate != null && this.filterNoteCreateDate != undefined && this.filterNoteCreateDate != "") {
      if (this.filterNoteCreateDate.length != undefined && this.filterNoteCreateDate.length != 0) {
        url += '&created_at=' + JSON.stringify(this.filterNoteCreateDate)
      } else {
        this.filterNoteCreateDate = [this.filterNoteCreateDate.beginDate.year + '-' + this.filterNoteCreateDate.beginDate.month + '-' + this.filterNoteCreateDate.beginDate.day, this.filterNoteCreateDate.endDate.year + '-' + this.filterNoteCreateDate.endDate.month + '-' + this.filterNoteCreateDate.endDate.day];
        url += '&created_at=' + JSON.stringify(this.filterNoteCreateDate)
      }
    }
    if (this.filterNoteModified != null && this.filterNoteModified != undefined && this.filterNoteModified != "") {
      if (this.filterNoteModified.length != undefined && this.filterNoteModified.length != 0) {
        url += '&modified_at=' + JSON.stringify(this.filterNoteModified)
      } else {
        this.filterNoteModified = [this.filterNoteModified.beginDate.year + '-' + this.filterNoteModified.beginDate.month + '-' + this.filterNoteModified.beginDate.day, this.filterNoteModified.endDate.year + '-' + this.filterNoteModified.endDate.month + '-' + this.filterNoteModified.endDate.day];
        url += '&modified_at=' + JSON.stringify(this.filterNoteModified)
      }
    }
    this.serverService.leadProfileNote(url, this.authToken).subscribe(
      data => {
        this.profileNote = data
        this.showComponentLoader1 = false
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
        this.showComponentLoader = false
        this.showComponentLoader1 = false
      }
    )
  }

  getProfileMail() {
    let url = "lead_id=" + this.leadInfo.id + "&per_page=25&page=1";
    if (this.filterMailingCreateDate != undefined && this.filterMailingCreateDate != "") {
      if (this.filterMailingCreateDate.length != undefined && this.filterMailingCreateDate.length != 0) {
        url += '&created_at=' + JSON.stringify(this.filterMailingCreateDate)
      } else {
        this.filterMailingCreateDate = [this.filterMailingCreateDate.beginDate.year + '-' + this.filterMailingCreateDate.beginDate.month + '-' + this.filterMailingCreateDate.beginDate.day, this.filterMailingCreateDate.endDate.year + '-' + this.filterMailingCreateDate.endDate.month + '-' + this.filterMailingCreateDate.endDate.day];
        url += '&created_at=' + JSON.stringify(this.filterMailingCreateDate)
      }
    }
    this.serverService.leadProfileMail(url, this.authToken).subscribe(
      data => {
        this.profileMail = data
        this.showComponentLoader1 = false
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
        this.showComponentLoader = false
        this.showComponentLoader1 = false
      }
    )
  }

  getProfileAttachment() {
    let url = "lead_id=" + this.leadInfo.id + "&per_page=" + this.pageAttachmentSize + "&page=" + this.pageAttachmentIndex
    this.serverService.leadAttachment(url, this.authToken).subscribe(
      data => {
        this.profileAttachment = data
        this.profileAttachment["lead_attachments"].forEach(element => {
          element["ext"] = element.name.substr(element.name.lastIndexOf('.') + 1)
        });
        this.showComponentLoader1 = false
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
        this.showComponentLoader = false
        this.showComponentLoader1 = false
      }
    )
  }

  getProfileLogs() {
    let url = "lead_id=" + this.leadInfo.id + "&per_page=" + this.pageLogSize + "&page=" + this.pageLogIndex
    if (this.filterLogs.action != "") {
      url += '&actions=' + this.filterLogs.action
    }
    if (this.filterLogs.lms_object_type != "") {
      url += '&lms_object_type=' + this.filterLogs.lms_object_type
    }
    if (this.filterLogs.user != "") {
      url += '&user_id=' + this.filterLogs.user
    }
    if (this.filterLogsCreateDate != undefined && this.filterLogsCreateDate != "") {
      if (this.filterLogsCreateDate.length != undefined && this.filterLogsCreateDate.length != 0) {
        url += '&created_at=' + JSON.stringify(this.filterLogsCreateDate)
      } else {
        this.filterLogsCreateDate = [this.filterLogsCreateDate.beginDate.year + '-' + this.filterLogsCreateDate.beginDate.month + '-' + this.filterLogsCreateDate.beginDate.day, this.filterLogsCreateDate.endDate.year + '-' + this.filterLogsCreateDate.endDate.month + '-' + this.filterLogsCreateDate.endDate.day];
        url += '&created_at=' + JSON.stringify(this.filterLogsCreateDate)
      }
    }
    this.serverService.leadProfileTimeline(url, this.authToken).subscribe(
      data => {
        this.profileLogs = data;
        this.showSkeleton = false;
        this.showComponentLoader1 = false
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
        this.showComponentLoader = false
        this.showComponentLoader1 = false
        this.showSkeleton = false;
      }
    )
  }

  getVendorRemarkList() {
    let url = "get_lead_vendor_remarks/?lead_id=" + this.leadInfo.id + "&per_page=" + this.pageLeadVendorRemarkSize + "&page=" + this.pageLeadVendorRemarkIndex
    this.serverService.getLeadRemarks(url, this.authToken).subscribe(
      data => {
        this.leadVendorRemark = data;
        this.showComponentLoader1 = false
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader1 = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getClientRemarkList() {
    let url = "get_lead_client_remarks/?lead_id=" + this.leadInfo.id + "&per_page=" + this.pageLeadVendorRemarkSize + "&page=" + this.pageLeadVendorRemarkIndex
    this.serverService.getLeadRemarks(url, this.authToken).subscribe(
      data => {
        this.leadClientRemark = data;
        this.showComponentLoader1 = false
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader1 = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getCallsList() {
    this.serverService.callsList(this.leadInfo.id, this.authToken).subscribe(
      data => {
        this.callList = data
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  /*********** Task Integration ***********/
  openCreateTaskModal() {
    this.ClientLeadProfileTaskCreateModalComponent = this.dialog.open(ClientLeadProfileTaskCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.leadInfo
    });
    this.ClientLeadProfileTaskCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.getProfileTasks()
      }
    })
  }

  markAsDoneModal(data) {
    this.clientTaskMarkDoneModalComponent = this.dialog.open(ClientTaskMarkDoneModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      data: data
    });
    this.clientTaskMarkDoneModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.getProfileTasks()
      }
    })
  }

  openEditTaskModal(data) {
    data["profileView"] = true
    this.clientLeadProfileEditModalComponent = this.dialog.open(ClientLeadProfileEditModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: data
    });
    this.clientLeadProfileEditModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.getProfileTasks()
      }
    })
  }

  deleteTask(task) {
    this.clientTaskDeleteModalComponent = this.dialog.open(ClientTaskDeleteModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      data: task
    });
    this.clientTaskDeleteModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.ngOnInit()
      }
    })
  }


  filterTaskApply() {
    if (this.filterTask.task_category == "" &&
      this.filterTask.priority == "" &&
      (this.filterTaskCreateDate == null ||
        this.filterTaskCreateDate == undefined ||
        this.filterTaskCreateDate == "") &&
      (this.filterTaskDueDate == null ||
        this.filterTaskDueDate == undefined ||
        this.filterTaskDueDate == "")) {
      this.clipBoardService.showMessgeInText("Please fill some field in filter", "error-snackbar")
      return
    } else {
      this.showComponentLoader1 = true
      this.pageTaskIndex = 1
      this.pageTaskSize = 25
      this.getProfileTasks()
    }
  }

  clearfilterTask() {
    this.showComponentLoader1 = true
    this.filterTask.task_category = ""
    this.filterTask.priority = ""
    this.filterTaskCreateDate = ""
    this.filterTaskDueDate = ""
    this.pageTaskIndex = 1
    this.pageTaskSize = 25
    this.getProfileTasks()
  }

  onCreateDateRangeChanged(event: IMyDateRangeModel) {
    if (event.beginDate.year != 0) {
      this.filterTaskCreateDate = [event.formatted.split(" - ")[0], event.formatted.split(" - ")[1]];
    } else {
      this.filterTaskCreateDate = "";
    }
  }

  onDueDateChanged(event: IMyDateRangeModel) {
    if (event.beginDate.year != 0) {
      this.filterTaskDueDate = [event.formatted.split(" - ")[0], event.formatted.split(" - ")[1]];
    } else {
      this.filterTaskDueDate = "";
    }
  }

  getNextTask(event) {
    this.showComponentLoader1 = true
    let body = {
      "per_page": event.pageSize,
      "page": event.pageIndex + 1
    };
    this.pageTaskSize = body.per_page;
    this.pageTaskIndex = body.page;
    this.getProfileTasks()
  }

  /*********** Note Integration ***********/
  openCreateNoteModal() {
    this.clientLeadProfileNoteCreateModalComponent = this.dialog.open(ClientLeadProfileNoteCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.leadInfo
    });
    this.clientLeadProfileNoteCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.getProfileNote()
      }
    })
  }

  openEditNoteModal(note) {
    this.clientLeadProfileNoteEditModalComponent = this.dialog.open(ClientLeadProfileNoteEditModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: note
    });
    this.clientLeadProfileNoteEditModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.getProfileNote()
      }
    })
  }

  openDeleteNoteModal(note) {
    this.clientNoteDeleteModalComponent = this.dialog.open(ClientNoteDeleteModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      data: note
    });
    this.clientNoteDeleteModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.getProfileNote()
      }
    })
  }

  filterNoteApply() {
    if ((this.filterNoteCreateDate == null ||
      this.filterNoteCreateDate == undefined ||
      this.filterNoteCreateDate == "") &&
      (this.filterNoteModified == null ||
        this.filterNoteModified == undefined ||
        this.filterNoteModified == "")) {
      this.clipBoardService.showMessgeInText("Please fill some feild in filter", "error-snackbar")
      return
    } else {
      this.showComponentLoader1 = true
      this.pageNoteIndex = 1
      this.pageNoteSize = 25
      this.getProfileNote()
    }
  }

  clearfilterNote() {
    this.showComponentLoader1 = true
    this.pageNoteIndex = 1
    this.pageNoteSize = 25
    this.filterNoteCreateDate = ""
    this.filterNoteModified = ""
    this.getProfileNote()
  }

  onNoteCreateDateRangeChanged(event: IMyDateRangeModel) {
    if (event.beginDate.year != 0) {
      this.filterNoteCreateDate = [event.beginDate.year + '-' + event.beginDate.month + '-' + event.beginDate.day, event.endDate.year + '-' + event.endDate.month + '-' + event.endDate.day];
    } else {
      this.filterNoteCreateDate = "";
    }
  }

  onNoteModifiedDateChanged(event: IMyDateRangeModel) {
    if (event.beginDate.year != 0) {
      this.filterNoteModified = [event.beginDate.year + '-' + event.beginDate.month + '-' + event.beginDate.day, event.endDate.year + '-' + event.endDate.month + '-' + event.endDate.day];
    } else {
      this.filterNoteModified = "";
    }
  }

  getNextNotes(event) {
    this.showComponentLoader1 = true
    let body = {
      "per_page": event.pageSize,
      "page": event.pageIndex + 1
    };
    this.pageNoteSize = body.per_page;
    this.pageNoteIndex = body.page;
    this.getProfileNote()
  }

  /*********** Address Integration ***********/
  openCreateAddressModal() {
    this.clientLeadAddressCreateModalComponent = this.dialog.open(ClientLeadAddressCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.profile
    });
    this.clientLeadAddressCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.callAllLinks = false
        this.getProfiles()
      }
    })
  }

  openEditAddressModal(address) {
    let body = {
      "address": address,
      "profile": this.profile
    }
    this.clientLeadAddressEditModalComponent = this.dialog.open(ClientLeadAddressEditModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
    this.clientLeadAddressEditModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.callAllLinks = false
        this.getProfiles()
      }
    })
  }

  deleteAddressModal(address) {
    this.clientAddressDeleteModalComponent = this.dialog.open(ClientAddressDeleteModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      data: address
    });
    this.clientAddressDeleteModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.callAllLinks = false
        this.getProfiles()
      }
    })
  }

  clickToMakePrimary(address) {
    let body = {
      "is_primary": true,
    }
    this.serverService.makeAddressPrimary(address.id, body, this.authToken).subscribe(
      data => {
        this.callAllLinks = false
        this.getProfiles()
        this.clipBoardService.showMessgeInText("Address marked As Primary", "success-snackbar")
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  /*********** Email Integration ***********/
  openSendEmailModal() {
    this.clientLeadEmailCreateModalComponent = this.dialog.open(ClientLeadEmailCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.leadInfo
    });
    this.clientLeadEmailCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.getProfileMail()
      }
    })
  }

  filterMailApply() {
    if (
      this.filterMailingCreateDate == null ||
      this.filterMailingCreateDate == undefined ||
      this.filterMailingCreateDate == "") {
      this.clipBoardService.showMessgeInText("Please fill some feild in filter", "error-snackbar")
      return
    } else {
      this.showComponentLoader1 = true
      this.pageMailIndex = 1
      this.pageMailSize = 25
      this.getProfileMail()
    }
  }

  clearfilterMail() {
    this.showComponentLoader1 = true
    this.pageMailIndex = 1
    this.pageMailSize = 25
    this.filterMailingCreateDate = ""
    this.getProfileMail()
  }

  onMailCreatedDateChanged(event: IMyDateRangeModel) {
    if (event.beginDate.year != 0) {
      this.filterMailingCreateDate = [event.beginDate.year + '-' + event.beginDate.month + '-' + event.beginDate.day, event.endDate.year + '-' + event.endDate.month + '-' + event.endDate.day];
    } else {
      this.filterMailingCreateDate = "";
    }
  }

  getProfileMailNext(event) {
    this.showComponentLoader1 = true
    let body = {
      "per_page": event.pageSize,
      "page": event.pageIndex + 1
    };
    this.pageMailSize = body.per_page;
    this.pageMailIndex = body.page;
    this.getProfileMail()
  }

  /*********** Attachment Integration ***********/
  openAttachmentModal() {
    this.clientLeadAttachmentCreateModalComponent = this.dialog.open(ClientLeadAttachmentCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: this.leadInfo
    });
    this.clientLeadAttachmentCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.getProfileAttachment()
      }
    })
  }

  deleteDoc(doc) {
    this.clientDocumentDeleteModalComponent = this.dialog.open(ClientDocumentDeleteModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      data: doc
    });
    this.clientDocumentDeleteModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.getProfileAttachment()
      }
    })
  }

  getProfileDocNext(event) {
    this.showComponentLoader1 = true
    let body = {
      "per_page": event.pageSize,
      "page": event.pageIndex + 1
    };
    this.pageAttachmentSize = body.per_page;
    this.pageAttachmentIndex = body.page;
    this.getProfileAttachment()
  }

  /***************** LOGS Integration **************/

  onTimelineCreateDateRangeChanged(event: IMyDateRangeModel) {
    if (event.beginDate.year != 0) {
      this.filterLogsCreateDate = [event.formatted.split(" - ")[0], event.formatted.split(" - ")[1]];
    } else {
      this.filterLogsCreateDate = "";
    }
  }

  changeByAction() {
    this.hideObjectType = false
    this.mailing = false
    this.hideSms = false
    this.hideProfile = false
    this.hideLeadAttachment = false
    if (this.filterLogs.action == "Created") {
      this.hideObjectType = true
      this.hideProfile = true
    }
    if (this.filterLogs.action == "Deleted") {
      this.hideObjectType = true
      this.hideProfile = true
      this.mailing = true
    }
    if (this.filterLogs.action == "Updated") {
      this.hideLeadAttachment = true
      this.mailing = true
    }
    if (this.filterLogs.action == "Sms") {
      this.hideSms = true
    }
    this.filterLogs.lms_object_type = ""
  }

  filterLogsApply() {
    if (this.filterLogs.action == "" &&
      this.filterLogs.lms_object_type == "" &&
      this.filterLogs.user == "" &&
      (this.filterLogsCreateDate == null ||
        this.filterLogsCreateDate == undefined ||
        this.filterLogsCreateDate == "")) {
      this.clipBoardService.showMessgeInText("Please fill some feild in filter", "error-snackbar")
      return
    } else {
      this.showComponentLoader1 = true
      this.pageLogIndex = 1
      this.pageLogSize = 25
      this.getProfileLogs()
    }
  }

  clearfilterLogs() {
    this.showComponentLoader1 = true
    this.filterLogsCreateDate = ""
    this.filterLogs.action = ""
    this.filterLogs.user = ""
    this.filterLogs.lms_object_type = ""
    this.hideObjectType = false
    this.pageLogIndex = 1
    this.pageLogSize = 25
    this.changeByAction()
    this.getProfileLogs()
  }

  getNextLogs(event) {
    this.showComponentLoader1 = true
    let body = {
      "per_page": event.pageSize,
      "page": event.pageIndex + 1
    };
    this.pageLogSize = body.per_page;
    this.pageLogIndex = body.page;
    this.getProfileLogs()
  }

  /******************** Vendor Remark List ******************/
  getLeadVendorRemarkNext(event) {
    this.showComponentLoader1 = true
    let body = {
      "per_page": event.pageSize,
      "page": event.pageIndex + 1
    };
    this.pageLeadVendorRemarkSize = body.per_page;
    this.pageLeadVendorRemarkIndex = body.page;
    this.getVendorRemarkList()
  }

  /******************** CLIENT Remark List ******************/
  getLeadClientRemarkNext(event) {
    this.showComponentLoader1 = true
    let body = {
      "per_page": event.pageSize,
      "page": event.pageIndex + 1
    };
    this.pageLeadClientRemarkSize = body.per_page;
    this.pageLeadClientRemarkIndex = body.page;
    this.getClientRemarkList()
  }

  /************************* Edit Profile *******************/

  editProfile(profile, value) {
    let body = {
      "profile": profile,
      "header": value,
    }
    this.clientEditProfileModalComponent = this.dialog.open(ClientEditProfileModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
    this.clientEditProfileModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader1 = true
        this.callAllLinks = false
        this.getProfiles()
      }
    })
  }

  enrichLead() {
    this.showComponentLoader1 = true
    this.serverService.leadEnrichment(this.leadInfo.id, this.authToken).subscribe(
      data => {
        this.callAllLinks = false
        this.getProfiles()
        this.clipBoardService.showMessgeInText("Lead Enriched Successfully", "success-snackbar")
      },
      err => {
        this.showComponentLoader1 = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  fileChangeEvent(event) {
    const formData: FormData = new FormData();
    formData.append('avatar', event.target.files[0]);
    this.serverService.uploadLeadAvatar(this.profile.id, formData, this.authToken).subscribe(
      data => {
        this.profile.avatar = data.avatar
        this.clipBoardService.showMessgeInText("Profile Image Updated Successfully", "success-snackbar")
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)

      }
    )
  }

  backToLeads() {
    //console.log(this.project)
    if (sessionStorage.getItem("masterLead") == null) {
      this.router.navigate(["/page/project/leads/"+ this.project["id"]])
    } else {
      this.router.navigate(["/page/leads"])
    }
    sessionStorage.removeItem("masterLead");
    sessionStorage.removeItem("leadInfo");
  }

  readMore() {
    this.showMoreInfo = !this.showMoreInfo;
  }
}