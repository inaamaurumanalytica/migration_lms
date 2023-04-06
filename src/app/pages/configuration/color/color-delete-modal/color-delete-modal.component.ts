import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../../services/clipboard.service'
import { ServerService } from '../../../../services/server.service'
@Component({
    selector: 'color-delete-modal',
    templateUrl: './color-delete-modal.component.html',
    styleUrls: ['./color-delete-modal.component.scss']
})
export class ColorDeleteModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    action = "";
    btnStatus: boolean = false
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ColorDeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
    }

    ngOnInit() {
    }

    yes() {
        this.btnStatus = true
        this.serverService.deleteLeadColor(this.data.id, localStorage.getItem("token")).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText('Color Deleted Successfully', 'success-snackbar')
                this.dialogRef.close(data)
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

