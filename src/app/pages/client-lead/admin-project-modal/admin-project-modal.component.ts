import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'

@Component({
    selector: 'admin-project-modal',
    templateUrl: './admin-project-modal.component.html',
    styleUrls: ['./admin-project-modal.component.scss']
})
export class AdminProjectModalComponent implements OnInit {
    authToken: any = localStorage.getItem("token")
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    btnStatus: boolean = false
    project: any = {}
    autoEmailNotification: boolean = false;
    negativeStatus: boolean = false;
    isStatusChangedAfterTat: boolean = false;
    isTelephony: boolean = false
    isRecordingAccessToClient: boolean = false

    autoVerification: boolean = false

    showComponentLoader: boolean = false

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AdminProjectModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.project = this.data
    }


    ngOnInit() {
        // if (this.userInfo.admin) {
        //     this.getProjectInfoById()
        // } else {
        //     this.autoVerification = this.project.auto_verify;
        // }
        this.getProjectInfoById()
    }

    getProjectInfoById() {
        this.showComponentLoader = true
        this.serverService.getProjectById(this.data, this.authToken).subscribe(
            data => {
                debugger
                this.autoVerification = data.auto_verify;
                this.autoEmailNotification = data.notify_user_on_form_submit;
                this.negativeStatus = data.remove_negative
                this.isStatusChangedAfterTat = data.is_status_changed_after_tat
                this.isTelephony = data.telephony
                this.isRecordingAccessToClient = data.recording_access_to_client
                this.showComponentLoader = false
            },            
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
                this.showComponentLoader = false
            }
        )
    }

    close() {
        if (this.btnStatus) {
            this.dialogRef.close("Updated");
        } else {
            this.dialogRef.close();
        }
    }


    autoVerified(event) {
        this.autoVerification = event.checked;
        let body = {
            "auto_verify": this.autoVerification,
            "project_id": this.project.id

        }
        this.serverService.updateAutoVerified(this.project.id, body, this.authToken).subscribe(
            data => {
                let project = JSON.parse(localStorage.getItem("projectInfo"))
                project["auto_verify"] = this.autoVerification
                localStorage.setItem("projectInfo", JSON.stringify(project))
                this.clipBoardService.showMessgeInText("Auto Verified Updated Succesfully", "success-snackbar")
                this.btnStatus = true
            },
            err => {

                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    autoEmailNotify(event) {
        this.autoEmailNotification = event.checked;
        let body = {
            "notify_user_on_form_submit": this.autoEmailNotification
        }
        this.serverService.autoEmailNotify(this.project.id, body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText("Email Notifcation Updated Succesfully", "success-snackbar")
                this.btnStatus = true
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    removeNegativeStatus(event) {
        this.negativeStatus = event.checked;
        let body = {
            "remove_negative": this.negativeStatus,
            "project_id": this.project.id,
        }
        this.serverService.removeNegativeStatus(body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText("Remove Negative Status Updated Succesfully", "success-snackbar")
                this.btnStatus = true
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }


    statusChangedTat(event) {
        this.isStatusChangedAfterTat = event.checked;
        let body = {
            "is_status_changed_after_tat": this.isStatusChangedAfterTat,
            "project_id": this.project.id,
        }
        this.serverService.statusChangedAfterTat(body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText("Status Chnaged After Tat Updated Succesfully", "success-snackbar")
                this.btnStatus = true
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    telephonyChnaged(event) {
        this.isTelephony = event.checked;
        let body = {
            "telephony": this.isTelephony,
            "project_id": this.project.id,
        }
        this.serverService.telephonyCHange(body, this.authToken).subscribe(
            data => {
                let project = JSON.parse(localStorage.getItem("projectInfo"))
                project["telephony"] = this.isTelephony
                localStorage.setItem("projectInfo", JSON.stringify(project))
                this.clipBoardService.showMessgeInText("Telephone Status Updated Succesfully", "success-snackbar")
                this.btnStatus = true
            },
            err => {
                this.isTelephony = !this.isTelephony
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    recordingAccessToClientChanged(event) {
        this.isRecordingAccessToClient = event.checked;
        let body = {
            "recording_access_to_client": this.isRecordingAccessToClient,
            "project_id": this.project.id,
        }
        this.serverService.recordingAccessToClient(body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText("Recording Access To Client Updated Succesfully", "success-snackbar")
                this.btnStatus = true
            },
            err => {
                this.isRecordingAccessToClient = !this.isRecordingAccessToClient
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
}

