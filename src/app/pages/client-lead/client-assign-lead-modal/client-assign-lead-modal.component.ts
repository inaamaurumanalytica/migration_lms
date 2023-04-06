import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDateRangeModel } from 'mydaterangepicker';
import { Router } from '@angular/router';
@Component({
    selector: 'client-assign-lead-modal',
    templateUrl: './client-assign-lead-modal.component.html',
    styleUrls: ['./client-assign-lead-modal.component.scss']
})
export class ClientAssignLeadModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    project: any = JSON.parse(localStorage.getItem("projectInfo"))
    selectUser: any
    showAssignUser: boolean = false;
    showSubmit: boolean = false
    assignedUser: any[] = []
    users: any[] = [];
    userAssignId: any;
    unAssignedUser: any[] = [];
    userAssignForm: FormGroup;
    constructor(
        private dialogRef: MatDialogRef<ClientAssignLeadModalComponent>,
        private serverService: ServerService,
        private fb: FormBuilder,
        private router: Router,
        private clipBoardService: ClipBoardService,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.userAssignForm = this.fb.group({
            user: "",
        });
        this.getUsers();
    }

    ngOnInit() {
    }

    getUsers() {
        this.serverService.usersList(this.authToken).subscribe(
            data => {
                this.users = data.users
                this.getUsersProject();
            },
            err => {
                this.showAssignUser = false;
                this.dialogRef.close();
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getUsersProject() {
        this.serverService.getUsersByProject(this.project.id, this.authToken).subscribe(
            data => {
                if (this.data.multiple == undefined) {
                    this.unAssignedUser = Object.assign([], this.users);
                    if (this.userInfo.member_type == "Vendor") {
                        if (this.data.vendor_assignee_id != null) {
                            for (let i = 0; i < this.unAssignedUser.length; i++) {
                                if (this.unAssignedUser[i].id == this.data.vendor_assignee_id) {
                                    this.assignedUser.push(this.unAssignedUser[i]);
                                    this.unAssignedUser.splice(i, 1);
                                }
                            }
                        }
                    } else {
                        if (this.data.client_assignee_id != null) {
                            for (let i = 0; i < this.unAssignedUser.length; i++) {
                                if (this.unAssignedUser[i].id == this.data.client_assignee_id) {
                                    this.assignedUser.push(this.unAssignedUser[i]);
                                    this.unAssignedUser.splice(i, 1);
                                }
                            }
                        }
                    }
                    data.users.forEach(element => {
                        this.unAssignedUser.forEach(el => {
                            if (element.id == el.id) {
                                el["disable"] = "yes"
                            }
                        })
                    });
                } else {
                    this.unAssignedUser = data.users
                }
                this.showAssignUser = true;
            },
            err => {
                this.dialogRef.close();
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    assignUser() {
        let body = {}
        if (this.userInfo.member_type == "Vendor") {
            body = {
                "id": this.data.id,
                "vendor_assignee_id": this.userAssignForm.value.user.id
            }
        } else {
            body = {
                "id": this.data.id,
                "client_assignee_id": this.userAssignForm.value.user.id
            }
        }
        this.serverService.assignedUser(body, this.authToken).subscribe(
            data => {
                if (this.assignedUser.length != 0) {
                    let body = this.users.filter(element => element.id == this.assignedUser[0].id)
                    this.unAssignedUser.push(body[0]);
                }
                this.assignedUser = [];
                this.assignedUser.push(this.userAssignForm.value.user);
                for (let i = 0; i < this.unAssignedUser.length; i++) {
                    if (this.userAssignForm.value.user.id == this.unAssignedUser[i].id) {
                        this.unAssignedUser.splice(i, 1);
                    }
                }
                this.showSubmit = true
                this.clipBoardService.showMessgeInText(this.userAssignForm.value.user.name + " Assigned Succesfully", "success-snackbar")
                this.userAssignForm.reset();
                this.dialogRef.close(data);
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    assignUserMultiple() {
        let body = {};
        if (this.userInfo.member_type == "Vendor") {
            body = {
                "lead_ids": this.data.id,
                "vendor_assignee_id": this.userAssignForm.value.user.id
            }
        } else {
            body = {
                "lead_ids": this.data.id,
                "client_assignee_id": this.userAssignForm.value.user.id
            }
        }
        this.serverService.multiLeadAssignedUser(body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText(this.userAssignForm.value.user.name + " Assigned Succesfully", "success-snackbar")
                this.userAssignForm.reset();
                this.dialogRef.close()
            },
            err => {
                this.dialogRef.close()
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    routeToUser() {
        this.dialogRef.close();
        this.router.navigate(['/page/user']);
    }
}

