import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { element } from 'protractor';
import { Body } from '@angular/http/src/body';
@Component({
    selector: 'permission-modal',
    templateUrl: './permission-modal.component.html',
    styleUrls: ['./permission-modal.component.scss']
})
export class PermissionModalComponent implements OnInit {
    authToken: any = localStorage.getItem("token")
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    btnStatus: boolean = false
    permissions: any[] = JSON.parse(localStorage.getItem("permissions"));
    export: boolean = false;
    action: string = "exit";
    email: boolean = false;
    phone: boolean = false;
    sms: boolean = false;
    exportValue: boolean = false;
    emailValue: boolean = false;
    phoneValue: boolean = false;
    smsConfiguration: boolean = false;
    userData: any


    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<PermissionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.userData = this.data
    }

    ngOnInit() {
        this.getAllPermissions();
        if (this.data.permissions.length != 0) {
            this.data.permissions.forEach(element => {
                if (element.name == "export") {
                    this.exportValue = true
                } else if (element.name == "phone") {
                    this.phoneValue = true
                } else if (element.name == "email") {
                    this.emailValue = true
                } else if (element.name == "Sms Configuration") {
                    this.smsConfiguration = true
                }
            });
        }
    }


    getAllPermissions() {
        if (this.permissions.length != 0) {
            this.permissions.forEach(el => {
                if (el.name == "export") {
                    this.export = true;
                }
                if (el.name == "phone") {
                    this.phone = true;
                }
                if (el.name == "email") {
                    this.email = true;
                }
                if (el.name == "Sms Configuration") {
                    this.sms = true;
                }
            });
        }
    }

    close() {
        this.dialogRef.close();
    }

    updatePermission(val, event) {
        let body = {
            "user_id": this.data.id,
        }
        if (val == 'export') {
            body["permission_id"] = 1
        } else if (val == 'email') {
            body["permission_id"] = 2
        } else if (val == 'phone') {
            body["permission_id"] = 3
        } else if (val == 'Sms Configuration') {
            body["permission_id"] = 5
        }
        if (event.checked) {
            this.serverService.givePermissionToUser(body, this.authToken).subscribe(
                data => {
                    this.clipBoardService.showMessgeInText(data.message, "success-snackbar")
                },
                err => {
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
            )
        } else {
            this.serverService.removePermissionToUser(body, this.authToken).subscribe(
                data => {
                    this.clipBoardService.showMessgeInText(data.message, "success-snackbar")
                },
                err => {
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
            )
        }
    }
}

