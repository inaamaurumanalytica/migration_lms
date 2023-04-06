import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef,MatSnackBar, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';

import { ClientProjectCreateModalComponent } from './client-project-create-modal/client-project-create-modal.component'
import { ClientProjectEditModalComponent } from './client-project-edit-modal/client-project-edit-modal.component'
import { ClientProjectInfoModalComponent } from './client-project-info-modal/client-project-info-modal.component'
import { ClientProjectBrochuerModalComponent } from './client-project-brochuer-modal/client-project-brochuer-modal.component'
import { ClientProjectDeleteModalComponent } from './client-project-delete-modal/client-project-delete-modal.component';
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { ProjectEmailNotifyModalComponent } from './project-email-notify-modal/project-email-notify-modal.component';
import { RegistrationCreateModalComponent } from '../registration-list/registration-create-modal/registration-create-modal.component';
import { ProjectUploadAvatarModalComponent } from './project-upload-avatar-modal/project-upload-avatar-modal.component';
import { ClientProjectQualifiedModalComponent } from './client-project-qualified-modal/client-project-qualified-modal.component';
import { ProjectFeedbackModalComponent } from './project-feedback-modal/project-feedback-modal.component';
import { Title } from '@angular/platform-browser';
import { ProjectFilterModalComponent } from './project-filter-modal/project-filter-modal.component';
import { ClientProjectStatsModalComponent } from './client-project-stats-modal/client-project-stats-modal.component';
import { ProjectStatusModalComponent } from './project-status-modal/project-status-modal.component';
import { LeadSendMiModalComponent } from './lead-send-mi-modal/lead-send-mi-modal.component';
import { ProjectMediaPlanComponent } from './project-media-plan/project-media-plan.component';
import { WhatsappProfileModalComponent } from '../whatsapp-profile-modal/whatsapp-profile-modal.component';
import { UserListModalComponent } from './user-list-modal/user-list-modal.component';
// import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-client-project',
  templateUrl: './client-project.component.html',
  styleUrls: ['./client-project.component.scss']
})
export class ClientProjectComponent implements OnInit {
  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  showComponentLoader: boolean = false;
  action = 'exit';
  project: any = {
    projects: [],
    pagination: {}
  }
  elasticSearch: any = ""
  statusSpinner: boolean = false;

  newRequest: boolean = false;
  url="";

  projectCreateModalComponent: MatDialogRef<ClientProjectCreateModalComponent>;
  projectEditModalComponent: MatDialogRef<ClientProjectEditModalComponent>
  projectDeleteModalComponent: MatDialogRef<ClientProjectDeleteModalComponent>
  sendDataMIModalComponent: MatDialogRef<LeadSendMiModalComponent>
  projectInfoModalComponent: MatDialogRef<ClientProjectInfoModalComponent>
  projectBrochuerModalComponent: MatDialogRef<ClientProjectBrochuerModalComponent>
  projectEmailNotifyModalComponent: MatDialogRef<ProjectEmailNotifyModalComponent>
  registrationCreateModalComponent: MatDialogRef<RegistrationCreateModalComponent>
  projectUploadAvatarModalComponent: MatDialogRef<ProjectUploadAvatarModalComponent>
  clientProjectQualifiedModalComponent: MatDialogRef<ClientProjectQualifiedModalComponent>
  projectFeedbackModalComponent: MatDialogRef<ProjectFeedbackModalComponent>
  ProjectMediaPlanComponent: MatDialogRef<ProjectMediaPlanComponent>
  projectFilterModalComponent: MatDialogRef<ProjectFilterModalComponent>
  projectStatusModalComponent: MatDialogRef<ProjectStatusModalComponent>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageIndex: number = 0;
  pageSize: number = 100;
  smsPermissions: boolean = false

  auto_verify: boolean = false
  qualified: boolean = false
  disable: boolean = false
  client_id: string = ""
  createdAt: any = ""

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
    private snackBar: MatSnackBar
  ) {
    // sessionStorage.clear();
    this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Projects');
    this.userInfo.permissions.forEach(element => {
      if (element.id == 5 && this.userInfo.member_type == 'Client') {
        this.smsPermissions = true
      }
    });
  }

  ngOnInit() {

    this.allClientProjects()
    sessionStorage.clear();
    // console.log(this.allClientProjects());
  }

  allClientProjects() {
    let body = {
      lead_count_n_latest: true
    }
    if (this.elasticSearch.trim() != "") {
      body["name"] = this.elasticSearch
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
    }
    if (this.client_id != undefined && this.client_id != "") {
      body["client_id"] = this.client_id
    }
    if (this.disable) {
      body["disable"] = this.disable
    }
    if (this.qualified) {
      body["qualified"] = this.qualified
    }
    if (this.auto_verify) {
      body["auto_verify"] = this.auto_verify
    }
    if (this.newRequest) {
      body["no_lead"] = true
    }
    this.pageIndex = 0;
    this.pageSize = 50;
    this.showComponentLoader = true;
    if(this.userInfo.role != 'SalesAdmin'){
    this.url = "projects_with_filter/?per_page=" + this.pageSize + "&page=" + this.pageIndex;
    }
    else{
    this.url = "sales/projects_with_filter/?per_page=" + this.pageSize + "&page=" + this.pageIndex;
    }

    // if (this.newRequest) {
    //   url += "&no_lead=true"
    // }
    this.serverService.projectsListByFilter(this.url, body, this.authToken).subscribe(
      data => {
        this.project = data;
        // console.log(this.project)
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
    let body = {
      lead_count_n_latest: true
    }
    this.pageSize = body1.per_page;
    this.pageIndex = body1.page
    let indexPage = this.pageIndex + 1
    if (this.elasticSearch.trim() != "") {
      body["name"] = this.elasticSearch
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
    }
    if (this.client_id != undefined && this.client_id != "") {
      body["client_id"] = this.client_id
    }
    if (this.disable) {
      body["disable"] = this.disable
    }
    if (this.qualified) {
      body["qualified"] = this.qualified
    }
    if (this.auto_verify) {
      body["auto_verify"] = this.auto_verify
    }
    if (this.newRequest) {
      body["no_lead"] = true
    }
    this.showComponentLoader = true
    let url = "projects_with_filter/?per_page=" + this.pageSize + "&page=" + indexPage;
    this.serverService.projectsListByFilter(url, body, this.authToken).subscribe(
      data => {
        this.project = data
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
    body['auto_verify'] = this.auto_verify
    body['disable'] = this.disable
    body['qualified'] = this.qualified

    if (this.client_id != undefined && this.client_id != "") {
      body["client_id"] = this.client_id
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["createdAt"] = this.createdAt
    }
    this.projectFilterModalComponent = this.dialog.open(ProjectFilterModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
    this.projectFilterModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        if (result.client_id != undefined && result.client_id != "") {
          this.client_id = result.client_id
        } else {
          this.client_id = ""
        }
        this.disable = result.disable
        this.auto_verify = result.auto_verify
        this.qualified = result.qualified
        if (result.createdAt != undefined && result.createdAt != "") {
          this.createdAt = result.createdAt
        } else {
          this.createdAt = ""
        }
        this.allClientProjects()
      }
    })
  }

  create() {
    this.projectCreateModalComponent = this.dialog.open(ClientProjectCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '50vw',
      panelClass: 'cdk-overlay-panel-right-side'
    });
    this.projectCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.allClientProjects()
      }
    })
  }

  viewInsight(project) {
    this.router.navigate([]).then(result => { window.open('/page/audience-recommendation-engine/' + project.id, '_blank'); });
  }

  leadRequest(project) {
    this.router.navigate([]).then(result => { window.open('/page/new-client-project/', '_blank'); });
  }

  viewLeadsByProjects(project) {
    if (!project.disable) {
      // localStorage.setItem("projectInfo", JSON.stringify(project))
      sessionStorage.setItem("projectInfo",JSON.stringify(project))
      // this.router.navigate(["/page/project/leads"])
      this.router.navigate([]).then(result => { window.open('/page/project/leads/' + project.id, '_blank'); });
    }
  }

  edit(project) {
    if (project.disable) {
      return
    }
    this.projectEditModalComponent = this.dialog.open(ClientProjectEditModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: project
    });
    this.projectEditModalComponent.afterClosed().subscribe(result => {
      debugger
      if (result != undefined) {
        this.showComponentLoader = true
        this.ngOnInit()
        this.allClientProjects();
      }
    })
  }

  sendLeadMI(project) {
    this.sendDataMIModalComponent = this.dialog.open(LeadSendMiModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      data: project
    });
    this.sendDataMIModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.ngOnInit()
      }
    })
  }

  delete(project) {
    this.projectDeleteModalComponent = this.dialog.open(ClientProjectDeleteModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      data: project
    });
    this.projectDeleteModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.ngOnInit()
      }
    })
  }

  info(project) {
    if (project.disable) {
      return
    }
    this.projectInfoModalComponent = this.dialog.open(ClientProjectInfoModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: project
    });
  }

  brochureList(project) {
    this.projectBrochuerModalComponent = this.dialog.open(ClientProjectBrochuerModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: project
    });
    this.projectBrochuerModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.ngOnInit()
      }
    })
  }

  disableProject(element, event) {
    this.statusSpinner = true
    let body = {
      "disable": !event.checked
    }
    element.disable = !event.checked
    this.serverService.updateProject(element, body, this.authToken).subscribe(
      data => {
        if (data.disable) {
          this.clipBoardService.showMessgeInText("Project Disabled Succesfully", "success-snackbar")
        } else {
          this.clipBoardService.showMessgeInText("Project Enabled Succesfully", "success-snackbar")
        }
        this.statusSpinner = false
      },
      err => {
        this.statusSpinner = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  ///Whatsapp status change

  whatsappStatusChange(element, event) {
    this.statusSpinner = true
    let body = {
      "whatsapp_enabled": event.checked
    }
    element.whatsapp_enabled = event.checked
    this.serverService.updateProject(element, body, this.authToken).subscribe(
      data => {
        if (data.whatsapp_enabled) {
          this.clipBoardService.showMessgeInText("Whatsapp Enabled Succesfully", "success-snackbar")
        } else {
          this.clipBoardService.showMessgeInText("Whatsapp Disabled Succesfully", "success-snackbar")
        }
        this.statusSpinner = false
      },
      err => {
        this.statusSpinner = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }


  ///


  clientById(element) {
    if (this.userInfo.admin) {
      this.showComponentLoader = true
      //document.getElementsByClassName("spinner")[0].classList.remove("hidden");
      this.serverService.getClientById(element.client_id, this.authToken).subscribe(
        data => {
          localStorage.setItem("clientInfo", JSON.stringify(data));
          this.router.navigate(['auth/lms/client/info']);
          //document.getElementsByClassName("spinner")[0].classList.add("hidden");
          this.showComponentLoader = false
        },
        err => {
          this.showComponentLoader = false

          this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
        }
      )
    }
  }

  styleObject() {
    if (this.userInfo.admin) {
      return { "cursor": "pointer" }
    }
    return {}
  }

  emailNotify(element) {
    this.projectEmailNotifyModalComponent = this.dialog.open(ProjectEmailNotifyModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '50vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });

    this.projectEmailNotifyModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.allClientProjects()
        element = result
      }
    });
  }

  registration(element) {
    this.registrationCreateModalComponent = this.dialog.open(RegistrationCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

  smsAccess(val, event) {
    let body = {
      "id": val.id,
      "client_sms_enabled": event.checked
    }
    this.serverService.updateSmsConfiguration(body, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText('Successfully Updated', 'success-snackbar')
      },
      err => {
        this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
      }
    )
  }

  uploadAvatar(element) {
    this.projectUploadAvatarModalComponent = this.dialog.open(ProjectUploadAvatarModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
    this.projectUploadAvatarModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.ngOnInit()
      }
    });
  }

  openQualifiedModal(element) {
    this.clientProjectQualifiedModalComponent = this.dialog.open(ClientProjectQualifiedModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
    this.clientProjectQualifiedModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.ngOnInit()
      }
    });
  }


  feedback(element) {
    this.projectFeedbackModalComponent = this.dialog.open(ProjectFeedbackModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

  mediaPlan(element) {
    this.ProjectMediaPlanComponent = this.dialog.open(ProjectMediaPlanComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '800px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    });
  }

  removeSearch() {
    this.elasticSearch = ""
    this.allClientProjects()
  }

  liveProject(element) {
    this.showComponentLoader = true
    element.is_live = !element.is_live;
    let body = {
      "is_live": element.is_live
    }
    this.serverService.updateProject(element, body, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("Project Marked as Dead Successfully", "success-snackbar")
        this.showComponentLoader = false
      },
      err => {
        element.is_live = !element.is_live;
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  

  approvedProject(id, event) {
    this.statusSpinner = true
    let body = {
      "id": id,
      "approved": true
    }
    this.serverService.approvedProject(body, this.authToken).subscribe(
      data => {
        if (data.disable) {
          this.clipBoardService.showMessgeInText("Project Succesfully Disapprove", "success-snackbar")
        } else {
          this.clipBoardService.showMessgeInText("Project Succesfully Approved", "success-snackbar")
        }
        this.statusSpinner = false
      },
      err => {
        this.statusSpinner = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  viewStats(project) {
    this.dialog.open(ClientProjectStatsModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '80vw',
      data: project
    })
  }

  updateProjectStatus(element) {
    this.dialog.open(ProjectStatusModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '40vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: element
    }).afterClosed().subscribe(result => {
      if (result != undefined) {
        this.liveProject(element)
      }
    })
  }
 //
 enabledWhatsapp(val, event) {
  let body = {
    "id": val.id,
    "whatsapp_enabled": event.checked
  }
  this.serverService.enableWhatsapp(body, this.authToken).subscribe(
    data => {
      this.snackBar.open("Successfully Updated", this.action, {
        duration: 1000,
        verticalPosition: 'top',
        horizontalPosition: 'end',
        panelClass: 'blue-snackbar'
      })
    },
    err => {
      this.clipBoardService.checkServerError(err, localStorage.getItem("auth_token"))
    }
  )
}



 //
  postToMLS() {
    let url = 'http://admin.housingman.com/admin/projects/new';
    window.open(url, "_blank");
  }

  makeActive(event) {
    this.newRequest = event.checked
    this.allClientProjects()
  }

  updateAllowShuffling(element) {
    this.showComponentLoader = true
    element.allow_shuffling = !element.allow_shuffling;
    let body = {
      "allow_shuffling": element.allow_shuffling
    }
    this.serverService.updateAlowShuffling(element.id, body, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("Project Updated Succesfully", "success-snackbar")
        this.showComponentLoader = false
      },
      err => {
        element.allow_shuffling = !element.allow_shuffling;
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }
  updateAllowDuplicateLeads(element) {
    this.showComponentLoader = true
    element.allowed_duplicate_lead = !element.allowed_duplicate_lead;
    let body = {
      "allowed_duplicate_lead": element.allowed_duplicate_lead
    }
    this.serverService.updateProject(element, body, this.authToken).subscribe(
      data => {
        this.clipBoardService.showMessgeInText("Project Updated Succesfully", "success-snackbar")
        this.showComponentLoader = false
      },
      err => {
        element.allowed_duplicate_lead = !element.allowed_duplicate_lead;
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  whatsappProfileView(element) {
		this.dialog.open(WhatsappProfileModalComponent, {
			hasBackdrop: true,
			disableClose: true,
			autoFocus: true,
			data: element
		}).afterClosed().subscribe(result => {
			if (result != undefined) {
				return element.whats_app_profile = result
			}
		});
	}
  viewAssignedUsers(project){
    this.dialog.open(UserListModalComponent,{
      hasBackdrop:true,
      disableClose:true,
      width: '350px',
      panelClass: 'cdk-overlay-panel-right-side',
      autoFocus:true,
      data:project

    }).afterClosed().subscribe(result => {
      if(result != undefined){
        return project = result;
      }
    })
  //   this.serverService.getAssignedUsersByProjectId(project.id,this.authToken).subscribe((data)=>{
  //     console.log(data);
  //   })
  // }
}

}

