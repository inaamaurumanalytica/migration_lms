import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-project-qualified-modal',
    templateUrl: './client-project-qualified-modal.component.html',
    styleUrls: ['./client-project-qualified-modal.component.scss']
})
export class ClientProjectQualifiedModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public authInfo = JSON.parse(localStorage.getItem("authInfo"));
    btnStatus: boolean = false
    dataSource: any = {
        "name": "",
        "qualified": false,
        "lead_expiry": "0"
    };
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientProjectQualifiedModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.dataSource.name = this.data.name;
        this.dataSource.qualified = this.data.qualified;
        this.dataSource.lead_expiry = this.data.lead_expiry;
    }

    ngOnInit() { }

    close() {
        this.dialogRef.close();
    }

    save() {
        this.btnStatus = true
        let body = {
            "qualified": this.dataSource.qualified,
        }
        if (this.dataSource.qualified) {
            body["lead_expiry"] = this.dataSource.lead_expiry
        }
        this.serverService.updateQualified(this.data.id, body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText("Updated Successfully", "success-snackbar")
                this.dialogRef.close("Updated Successfully");
                this.btnStatus = false
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, this.authToken);
            }
        )
    }
}

