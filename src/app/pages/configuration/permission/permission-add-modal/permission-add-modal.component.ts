import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../../services/clipboard.service'
import { ServerService } from '../../../../services/server.service'
@Component({
    selector: 'permission-add-modal',
    templateUrl: './permission-add-modal.component.html',
    styleUrls: ['./permission-add-modal.component.scss']
})
export class PermissionAddModalComponent implements OnInit {
    action = "";
    btnStatus: boolean = false
    authToken = localStorage.getItem("token")
    permissionForm: FormGroup;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<PermissionAddModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.permissionForm = this.fb.group({
            name: ["", Validators.required],
        });
    }

    ngOnInit() {
    }

    save() {
        this.btnStatus = true
        let body = {
            "name": this.permissionForm.value.name,
        }
        this.serverService.createPermission(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText('Permission Created Successfully', 'success-snackbar')
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

