import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-assign-model',
    templateUrl: './client-assign-model.component.html',
    styleUrls: ['./client-assign-model.component.scss']
})
export class ClientAssignModelComponent implements OnInit {
    authToken: any = localStorage.getItem("token")
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    showComponentLoader: boolean = false
    unassignedClients: any[] = [];
    assignedClients: any[] = []
    clients: any[] = [];
    clientsVendorForm: FormGroup;

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientAssignModelComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {

    }

    ngOnInit() {
        this.showComponentLoader = true
        this.clientsVendorForm = this.fb.group({
            assign: "",
        });
        this.getAssignedClientsByVendor();
        this.getUnassignedClients();
    }

    getUnassignedClients() {
        let body = {
            "vendor_id": this.data.id
        }
        this.serverService.getUnassignedClients(body, this.authToken).subscribe(
            data => {
                this.unassignedClients = data.clients;
                this.showComponentLoader = false
            },
            err => {
                this.showComponentLoader = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getAssignedClientsByVendor() {
        let body = {
            "vendor_id": this.data.id
        }
        this.serverService.getClientsByVendor(body, this.authToken).subscribe(
            data => {
                this.assignedClients = data.clients;
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    assignClient() {
        let body = {
            "client_id": this.clientsVendorForm.value.assign.id,
            "vendor_id": this.data.id
        }
        this.serverService.createRelation(body, this.authToken).subscribe(
            data => {
                this.getUnassignedClients();
                this.clipBoardService.showMessgeInText(this.clientsVendorForm.value.assign.name + " Assigned Succesfully", "success-snackbar")
                this.assignedClients.push(this.clientsVendorForm.value.assign);
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    removeClient(assignedClient) {
        let body = {
            "client_id": assignedClient.id,
            "vendor_id": this.data.id
        }
        this.serverService.removeRelation(body, this.authToken).subscribe(
            data => {
                this.getUnassignedClients();
                this.clipBoardService.showMessgeInText(assignedClient.name + " Unassigned Succesfully", "success-snackbar")
                this.assignedClients.splice(this.assignedClients.indexOf(assignedClient), 1);
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

