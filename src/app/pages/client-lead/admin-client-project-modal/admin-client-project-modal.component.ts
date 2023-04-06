import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'admin-client-project-modal',
    templateUrl: './admin-client-project-modal.component.html',
    styleUrls: ['./admin-client-project-modal.component.scss']
})
export class AdminClientProjectModalComponent implements OnInit {
    authToken: any = localStorage.getItem("token")
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    btnStatus: boolean = false
    project: any = {}
    autoClientAssign: boolean = false;
    showTimeLimit: boolean = false
    selection = new SelectionModel<string>(true, []);
    displayedColumns = ['select', 'name'];
    users: any[] = [];
    registrationTimeLimit: any = ""
    showAutoSetting: boolean = false;
    saveStatus: boolean = false
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AdminClientProjectModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.project = this.data
    }

    ngOnInit() {
        this.getProjectById()
    }

    getProjectById() {
        this.serverService.getProjectById(this.project, this.authToken).subscribe(
            data => {
                this.project = data;
                this.autoClientAssign = data.client_auto_assign;
                this.getUserList();
            },
            err => {
                this.dialogRef.close();

                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getUserList() {
        this.serverService.getUsersByProject(this.project.id, this.authToken).subscribe(
            data => {
                this.users = data.users;
                this.showAutoSetting = true;
            },
            err => {

                this.showAutoSetting = false;
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        if (this.saveStatus) {
            this.dialogRef.close("Save");
        } else {
            this.dialogRef.close();
        }
    }

    autoVerified(event) {
        this.autoClientAssign = event.checked;
        let body = {
            "client_auto_assign": this.autoClientAssign
        }
        this.serverService.updateClientAutoAssigned(this.project.id, body, this.authToken).subscribe(
            data => {
                this.saveStatus = true
                this.clipBoardService.showMessgeInText("Client Auto Assigned Updated Succesfully", "success-snackbar")
            },
            err => {

                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    masterToggle() {
        if (!this.users) { return; }

        if (this.isAllSelected()) {
            this.selection.clear();
        } else {
            this.users.forEach(data => this.selection.select(data.id));
        }
    }

    isAllSelected(): boolean {
        if (!this.users) { return false; }
        if (this.selection.isEmpty()) { return false; }
        return this.selection.selected.length == this.users.length;
    }

    editTimeLimit() {
        this.showTimeLimit = true
        this.registrationTimeLimit = this.project.my_registration_time_limit
    }
    saveTimeLimit() {
        this.btnStatus = true;
        let body = {
            "my_registration_time_limit": this.registrationTimeLimit
        }
        this.serverService.timeLimitRegistration(this.project.id, body, this.authToken).subscribe(
            data => {
                this.btnStatus = false;
                this.showTimeLimit = false
                this.project = data
                this.saveStatus = true
                this.clipBoardService.showMessgeInText("Time Limit Set SUccessfully", "success-snackbar")
            },
            err => {
                this.btnStatus = false;
                this.showTimeLimit = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    createWebhook() {
        this.showAutoSetting = false;
        let body = {
            "ids": this.selection.selected
        }
        this.serverService.multiAssignedUser(this.project.id, body, this.authToken).subscribe(
            data => {
                this.selection.clear();
                this.showAutoSetting = true;
                this.saveStatus = true
                this.clipBoardService.showMessgeInText(data.message, "success-snackbar")
            },
            err => {
                this.showAutoSetting = false;
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    public restrictNumeric(e) {
        let input;
        if (e.metaKey || e.ctrlKey) {
            return true;
        }
        if (e.which === 32) {
            return false;
        }
        if (e.which === 0) {
            return true;
        }
        if (e.which < 33) {
            return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[\d\s]/.test(input);
    }

    cancel() {
        this.showTimeLimit = false
    }
}

