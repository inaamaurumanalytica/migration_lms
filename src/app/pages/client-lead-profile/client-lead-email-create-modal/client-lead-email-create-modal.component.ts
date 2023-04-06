import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-email-create-modal',
    templateUrl: './client-lead-email-create-modal.component.html',
    styleUrls: ['./client-lead-email-create-modal.component.scss']
})
export class ClientLeadEmailCreateModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    authToken = localStorage.getItem("token")
    authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
    projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
    leadInfo: any = JSON.parse(localStorage.getItem("leadInfo"))
    action = "";
    saveStatus: boolean = false
    emailVerified: boolean = false
    email: any = {
        "to_user": "",
        "cc_user": [],
        "bcc_user": [],
        "subject": "",
        "description": "",
        "email_templates": false,
        "schedule_date": ""
    }
    leadData: any = {};
    brouchers: any = [];
    projectBrouchers: any = [];
    config: any = {
        height: 150,
        theme: 'modern',
        branding: false,
        toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
        image_advtab: true,
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
        content_css: [
            '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
            '//www.tinymce.com/css/codepen.min.css'
        ]
    };
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadEmailCreateModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {

    }

    ngOnInit() {
        if (this.data.email != undefined && this.data.email != "") {
            this.email.to = this.data.email
            this.email.subject = this.projectInfo.name
            this.verifyEmail()
        }
        this.getBroucherFile()
    }

    sendMail() {
        this.saveStatus = true
        if (this.email.message.trim() == "") {
            if (confirm("Are you Sure you want to Send Email Without Message?")) {

            } else {
                this.saveStatus = false
                return
            }
        }
        let body = {
            "to_user": this.email.to,
            "subject": this.email.subject,
            "message": this.email.message,
            "lead_id": this.data.id,
            "file_links": []
        }
        if (this.projectBrouchers.length != 0) {
            this.projectBrouchers.forEach(element => {
                let file = {
                    "link": element.link,
                    "name": element.name
                }
                body.file_links.push(file)
            });
        }
        this.serverService.createLeadMailing(body, this.authToken).subscribe(
            data => {
                this.saveStatus = false
                this.dialogRef.close("Send Email Successfully");
                if (this.email.schedule_date != "") {
                    this.clipBoardService.showMessgeInText("Email will send on scheduled date", "success-snackbar");
                } else {
                    this.clipBoardService.showMessgeInText("Email Send Successfully", "success-snackbar");
                }
            },
            err => {
                this.saveStatus = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    verifyEmail() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(this.email.to).toLowerCase())) {
            this.emailVerified = true
        } else {
            this.emailVerified = false
        }
    }

    getBroucherFile() {
        this.serverService.getProjectBrochure(this.leadData.project_id, this.authToken).subscribe(
            data => {
                if (data.brochure != null) {
                    this.brouchers = data.brochure;
                }
                this.email.subject = data.name
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
}

