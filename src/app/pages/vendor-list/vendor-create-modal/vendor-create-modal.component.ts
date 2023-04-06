import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'vendor-create-modal',
    templateUrl: './vendor-create-modal.component.html',
    styleUrls: ['./vendor-create-modal.component.scss']
})
export class VendorCreateModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    createVendorForm: FormGroup;

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<VendorCreateModalComponent>,
    ) {
        this.createVendorForm = this.fb.group({
            name: ['', Validators.required],
        });
    }

    ngOnInit() {
    }

    addVendor() {
        this.btnStatus = true;
        let body = {
            "name": this.createVendorForm.value.name,
        };
        this.btnStatus = false
        this.serverService.createVendor(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false;
                this.dialogRef.close(data);
                this.clipBoardService.showMessgeInText("Vendor Added Succesfully", "success-snackbar");
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
                this.btnStatus = false;
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

