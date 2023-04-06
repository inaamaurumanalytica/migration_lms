import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-address-edit-modal',
    templateUrl: './client-lead-address-edit-modal.component.html',
    styleUrls: ['./client-lead-address-edit-modal.component.scss']
})
export class ClientLeadAddressEditModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    authToken = localStorage.getItem("token")
    authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
    projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
    leadInfo: any = JSON.parse(localStorage.getItem("leadInfo"))
    action = "";
    saveStatus: boolean = false
    addressForm: FormGroup;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadAddressEditModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.addressForm = this.fb.group({
            "address_category": [this.data.address.address_category, Validators.required],
            "line": [this.data.address.line, Validators.required],
            "city": [this.data.address.city, Validators.required],
            "state": [this.data.address.state, Validators.required],
            "country": [this.data.address.country, Validators.required],
            "postal_code": [this.data.address.postal_code, Validators.required],
        });
    }

    ngOnInit() {
    }

    addAddress() {
        this.saveStatus = true
        let body = {
            "address_category": this.addressForm.value.address_category,
            "line": this.addressForm.value.line,
            "city": this.addressForm.value.city,
            "state": this.addressForm.value.state,
            "country": this.addressForm.value.country,
            "postal_code": this.addressForm.value.postal_code,
            "profile_id": this.data.profile.id,
        }
        this.serverService.updateLeadAddress(this.data.address.id, body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText('Address Updated Successfully', 'success-snackbar')
                this.dialogRef.close("Address Updated Successfully")
                this.saveStatus = false
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
}

