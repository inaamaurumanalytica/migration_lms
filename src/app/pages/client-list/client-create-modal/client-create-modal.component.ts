import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-create-modal',
    templateUrl: './client-create-modal.component.html',
    styleUrls: ['./client-create-modal.component.scss']
})
export class ClientCreateModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    createClientForm: FormGroup;

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientCreateModalComponent>,
    ) {
        this.createClientForm = this.fb.group({
            name: ['', Validators.required],
            city: [''],
            rera: [''],
            is_broker : [false],
        });
    }

    ngOnInit() {
    }

    addClient() {
        this.btnStatus = true;
        let body = {
            "name": this.createClientForm.value.name,
            "city": this.createClientForm.value.city,
            "rera": this.createClientForm.value.rera,
            "is_broker": this.createClientForm.value.is_broker,
        };
        this.btnStatus = false
        this.serverService.createClient(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false;
                this.dialogRef.close(data);
                this.clipBoardService.showMessgeInText("Client Added Succesfully", "success-snackbar");
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

