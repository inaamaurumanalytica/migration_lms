import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../../services/clipboard.service'
import { ServerService } from '../../../../services/server.service'
@Component({
    selector: 'color-edit-modal',
    templateUrl: './color-edit-modal.component.html',
    styleUrls: ['./color-edit-modal.component.scss']
})
export class ColorEditModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    action = "";
    authToken = localStorage.getItem("token")
    btnStatus: boolean = false
    editColorForm: FormGroup;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ColorEditModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.editColorForm = this.fb.group({
            name: [this.data.name, Validators.required],
            color_code: [this.data.color_code, Validators.required],
            quality: [this.data.quality, Validators.required],
        })
    }

    ngOnInit() {
    }

    save() {
        this.btnStatus = true
        let body = {
            "name": this.editColorForm.value.name,
            "color_code": this.editColorForm.value.color_code,
            "quality": this.editColorForm.value.quality,
        }
        this.serverService.updateLeadColor(this.data.id, body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText('Color Updated Successfully', 'success-snackbar')
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

