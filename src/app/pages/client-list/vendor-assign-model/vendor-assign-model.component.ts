import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'vendor-assign-model',
    templateUrl: './vendor-assign-model.component.html',
    styleUrls: ['./vendor-assign-model.component.scss']
})
export class VendorAssignModelComponent implements OnInit {
    authToken: any = localStorage.getItem("token")
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    showComponentLoader: boolean = false
    unassignedVendors: any[] = [];
    assignedVendors: any[] = []
    vendors: any[] = [];
    vendorsClientForm: FormGroup;

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<VendorAssignModelComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {

    }

    ngOnInit() {
        this.showComponentLoader = true
        this.vendorsClientForm = this.fb.group({
            assign: "",
        });
        this.getAssignedVendorsByClient();
        this.getUnassignedVendors();
    }

    getUnassignedVendors() {
        let body = {
            "client_id": this.data.id
        }
        this.serverService.getUnassignedVendors(body, this.authToken).subscribe(
            data => {
                this.unassignedVendors = data.vendors;
                this.showComponentLoader = false
            },
            err => {
                this.showComponentLoader = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getAssignedVendorsByClient() {
        let body = {
            "client_id": this.data.id
        }
        this.serverService.getVendorsByClient(body, this.authToken).subscribe(
            data => {
                this.assignedVendors = data.vendors;
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    assignVendor() {
        let body = {
            "client_id": this.data.id,
            "vendor_id": this.vendorsClientForm.value.assign.id
        }
        this.serverService.createRelation(body, this.authToken).subscribe(
            data => {
                this.getUnassignedVendors();
                this.clipBoardService.showMessgeInText(this.vendorsClientForm.value.assign.name + " Assigned Succesfully", "success-snackbar")
                this.assignedVendors.push(this.vendorsClientForm.value.assign);
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    removeVendor(assignedVendor) {
        let body = {
            "client_id": this.data.id,
            "vendor_id": assignedVendor.id
        }
        this.serverService.removeRelation(body, this.authToken).subscribe(
            data => {
                this.getUnassignedVendors();
                this.clipBoardService.showMessgeInText(assignedVendor.name + " Unassigned Succesfully", "success-snackbar")
                this.assignedVendors.splice(this.assignedVendors.indexOf(assignedVendor), 1);
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

