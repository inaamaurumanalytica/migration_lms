import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'user-assign-project',
    templateUrl: './user-assign-project.component.html',
    styleUrls: ['./user-assign-project.component.scss']
})
export class UserAssignProjectComponent implements OnInit {
    authToken: any = localStorage.getItem("token")
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))

    showAssignProject: boolean = false;
    assignedProjects: any[] = []
    clients: any[] = [];
    projects: any[] = [];
    projectsByClient: any[] = [];
    projectAssignForm: FormGroup;

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UserAssignProjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {

    }

    ngOnInit() {
        if (this.userInfo.member_type == 'Vendor') {
            this.projectAssignForm = this.fb.group({
                client: "",
                assign: ""
            });
            this.getClients();
        } else {
            this.projectAssignForm = this.fb.group({
                assign: "",
            });
        }

        if (this.data.account_id != undefined) {
            this.getFBAdsAssignedProjects()
        } else {
            this.getAssignedProjects();
        }
    }

    getClients() {
        this.serverService.clientsList(this.authToken).subscribe(
            data => {
                this.clients = data.client;
            },
            err => {
                this.dialogRef.close();
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    projectList() {
        this.serverService.projectsList(this.authToken).subscribe(
            data => {
                this.projects = data;
                if (this.assignedProjects.length != 0) {
                    this.assignedProjects.forEach(element => {
                        for (let i = 0; i < this.projects.length; i++) {
                            if (element.id == this.projects[i].id) {
                                this.projects.splice(i, 1);
                            }
                        }
                    });
                }
                this.showAssignProject = true;
            },
            err => {
                this.showAssignProject = false;
                this.dialogRef.close();
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getAssignedProjects() {
        this.serverService.getAssignedProjects(this.data, this.authToken).subscribe(
            data => {
                this.assignedProjects = data.projects;
                this.projectList();
            },
            err => {
                this.dialogRef.close();
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
    assignProject() {
        if (this.data.account_id != undefined) {
            let body = {
                "advertisement_id": this.data.id,
                "project_id": this.projectAssignForm.value.assign.id
            }
            this.serverService.assignedFbIdToProject(body, this.authToken).subscribe(
                data => {
                    this.assignedProjects.push(this.projectAssignForm.value.assign);

                    for (let i = 0; i < this.projects.length; i++) {
                        if (this.projectAssignForm.value.assign.id == this.projects[i].id) {
                            this.projects.splice(i, 0);
                        }
                    }
                    this.clipBoardService.showMessgeInText(this.projectAssignForm.value.assign.name + " Assigned Succesfully", "success-snackbar")
                    this.projectsByClient = []
                    this.projectAssignForm.reset();
                },
                err => {
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
            )
        } else {
            let body = {
                "user_id": this.data.id,
                "project_id": this.projectAssignForm.value.assign.id
            }
            this.serverService.giveProjectAccess(body, this.authToken).subscribe(
                data => {
                    this.assignedProjects.push(this.projectAssignForm.value.assign);

                    for (let i = 0; i < this.projects.length; i++) {
                        if (this.projectAssignForm.value.assign.id == this.projects[i].id) {
                            this.projects.splice(i, 0);
                        }
                    }
                    this.clipBoardService.showMessgeInText(this.projectAssignForm.value.assign.name + " Assigned Succesfully", "success-snackbar")
                    this.projectsByClient = []
                    this.projectAssignForm.reset();
                },
                err => {
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
            )
        }
    }

    removeProject(assignedProject) {
        if (this.data.account_id != undefined) {
            let body = {
                "advertisement_id": this.data.id,
                "project_id": assignedProject.id
            }
            this.serverService.unAssignedFbIdToProject(body, this.authToken).subscribe(
                data => {
                    this.clipBoardService.showMessgeInText(data.message, "success-snackbar")
                    this.projectsByClient = []
                    this.projectAssignForm.reset();
                    this.projects.push(assignedProject);
                    this.assignedProjects.splice(this.assignedProjects.indexOf(assignedProject), 1);
                },
                err => {
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
            )
        } else {
            let body = {
                "user_id": this.data.id,
                "project_id": assignedProject.id
            }
            this.serverService.removeProjectAccess(body, this.authToken).subscribe(
                data => {
                    this.clipBoardService.showMessgeInText(assignedProject.name + " Unassigned Succesfully", "success-snackbar")
                    this.projectsByClient = []
                    this.projectAssignForm.reset();
                    this.projects.push(assignedProject);
                    this.assignedProjects.splice(this.assignedProjects.indexOf(assignedProject), 1);
                },
                err => {
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
            )
        }
    }

    close() {
        this.dialogRef.close();
    }

    filterProject() {
        let clientId = this.projectAssignForm.value.client.id;

        this.projectsByClient = this.projects.filter(ele => ele.disable == false && ele.client_id == clientId);
        this.assignedProjects.forEach(ele => {
            if (this.projectsByClient.length != 0) {
                for (let i = 0; i < this.projectsByClient.length; i++) {
                    if (ele.id == this.projectsByClient[i].id && ele.client_id == this.projectsByClient[i].client_id) {
                        this.projectsByClient.splice(this.projectsByClient.indexOf(this.projectsByClient[i]), 1);
                    }
                }
            }
        })
    }


    //  Facebook Apis for assigned Project

    getFBAdsAssignedProjects() {
        this.serverService.getAssignedProjectsByAds(this.data.id, this.authToken).subscribe(
            data => {
                this.assignedProjects = data;
                this.projectList();
            },
            err => {
                if (typeof err._body === 'string') {
                    if (JSON.parse(err._body) != undefined) {
                        let error = JSON.parse(err._body)
                        if (error.message != undefined) {
                            if (error.message == "Ad id not found ") {
                                this.projectList();
                            }
                        } else {
                            this.clipBoardService.checkServerError(err, this.authToken)
                        }
                    }
                } else {
                    this.clipBoardService.checkServerError(err, this.authToken)
                }

            }
        )
    }

    removeFbAdProject(assignedProject) {
        let body = {
            "user_id": this.data.id,
            "project_id": assignedProject.id
        }
        this.serverService.removeProjectAccess(body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText(assignedProject.name + " Unassigned Succesfully", "success-snackbar")
                this.projectsByClient = []
                this.projectAssignForm.reset();
                this.projects.push(assignedProject);
                this.assignedProjects.splice(this.assignedProjects.indexOf(assignedProject), 1);
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
}

