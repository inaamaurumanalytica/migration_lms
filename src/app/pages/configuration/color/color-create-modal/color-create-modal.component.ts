import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../../services/clipboard.service'
import { ServerService } from '../../../../services/server.service'
@Component({
    selector: 'color-create-modal',
    templateUrl: './color-create-modal.component.html',
    styleUrls: ['./color-create-modal.component.scss']
})
export class ColorCreateModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    action = "";
    btnStatus: boolean = false
    createColorForm: FormGroup;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ColorCreateModalComponent>) {
        this.createColorForm = this.fb.group({
            name: ['', Validators.required],
            color_code: ['', Validators.required],
            quality: ['', Validators.required],
        })
    }

    ngOnInit() {
    }

    save() {
        this.btnStatus = true
        let body = {
            "name": this.createColorForm.value.name,
            "color_code": this.createColorForm.value.color_code,
            "quality": this.createColorForm.value.quality,
        }
        this.serverService.createLeadColor(body, localStorage.getItem("token")).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText('Color Created Successfully', 'success-snackbar')
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

