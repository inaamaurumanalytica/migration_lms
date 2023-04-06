import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'user-edit-modal',
    templateUrl: './user-edit-modal.component.html',
    styleUrls: ['./user-edit-modal.component.scss']
})
export class UserEditModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    editUserForm: FormGroup;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UserEditModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        if (this.userInfo.member_type == "Vendor") {
            this.editUserForm = this.fb.group({
                name: [this.data.name],
                email: [this.data.email],
                phone: [this.data.telephony_number],
                address: [this.data.address]
            })
        } else {
            this.editUserForm = this.fb.group({
                name: [this.data.name],
                email: [this.data.email],
                address: [this.data.address]
            })
        }
    }

    ngOnInit() {
    }

    save() {
        this.btnStatus = true
        let body = {}
        if (this.userInfo.member_type == "Vendor") {
            body = {
                "address": this.editUserForm.value.address,
                "telephony_number": this.editUserForm.value.phone
            }
        } else {
            body = {
                "address": this.editUserForm.value.address
            }
        }
        this.serverService.updateUser(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText('Updated User Successfully', 'success-snackbar')
                this.dialogRef.close(data)
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

