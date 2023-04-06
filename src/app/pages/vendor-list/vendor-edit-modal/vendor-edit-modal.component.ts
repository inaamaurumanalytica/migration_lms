import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'vendor-edit-modal',
    templateUrl: './vendor-edit-modal.component.html',
    styleUrls: ['./vendor-edit-modal.component.scss']
})
export class VendorEditModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    editVendorForm: FormGroup;
    vendor: any = {}
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<VendorEditModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.vendor = data
        this.editVendorForm = this.fb.group({
            name: [this.data.name, Validators.required],
        });
    }

    ngOnInit() {
    }


    editVendor() {
        this.btnStatus = true;
        let body = {
            "name": this.editVendorForm.value.name,
        };
        this.btnStatus = false
        this.serverService.updateVendor(this.vendor.id, body, this.authToken).subscribe(
            data => {
                this.btnStatus = false;
                this.dialogRef.close(data);
                this.clipBoardService.showMessgeInText("Vendor Updated Succesfully", "success-snackbar");
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

