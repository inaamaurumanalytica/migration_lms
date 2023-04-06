import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'lead-report-delete-modal',
    templateUrl: './lead-report-delete-modal.component.html',
    styleUrls: ['./lead-report-delete-modal.component.scss']
})
export class LeadReportDeleteModalComponent implements OnInit {
    authToken: any = localStorage.getItem("token")
    btnStatus: boolean = false
    selectedLeads: any[] = []
    dataSource: any;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<LeadReportDeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.dataSource = data
    }

    ngOnInit() {
    }

    yes() {
        this.btnStatus = true
        this.serverService.deleteReport(this.data.id, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText("Report Deleted Successfully", "success-snackbar")
                this.dialogRef.close("yes");
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

