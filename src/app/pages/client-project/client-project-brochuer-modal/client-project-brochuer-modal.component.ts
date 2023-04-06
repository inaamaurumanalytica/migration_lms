import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-project-brochuer-modal',
    templateUrl: './client-project-brochuer-modal.component.html',
    styleUrls: ['./client-project-brochuer-modal.component.scss']
})
export class ClientProjectBrochuerModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    showProjectAccess: boolean = false
    public authInfo = JSON.parse(localStorage.getItem("authInfo"));
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    project: any = {}
    files: any = []
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientProjectBrochuerModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.files = this.data.brochure
    }

    ngOnInit() { }

    close() {
        if (this.btnStatus) {
            this.dialogRef.close("Some Data Deleted");
        } else {
            this.dialogRef.close();
        }
    }
}

