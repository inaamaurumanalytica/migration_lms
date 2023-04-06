import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'preview-number-modal',
    templateUrl: './preview-number-modal.component.html',
    styleUrls: ['./preview-number-modal.component.scss']
})
export class PreviewNumberModalComponent {
    action = 'exit'
    form: FormGroup

    constructor(private fb: FormBuilder, public clipBoardService: ClipBoardService,
        private snackBar: MatSnackBar,
        private serverService: ServerService,
        private dialogRef: MatDialogRef<PreviewNumberModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.form = this.fb.group({
            contactNumber: [parseInt(data.phone), Validators.required]
        })
    }

    confirm() {
        window.open('https://api.whatsapp.com/send?phone=' + JSON.stringify(this.form.value.contactNumber).replace('+', ''))
    }

    close() {
        this.dialogRef.close();
    }
}

