import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service'
import { MatSnackBar } from '@angular/material';
@Component({
    selector: 'confirm-lead-modal',
    templateUrl: './confirm-lead-modal.component.html',
    styleUrls: ['./confirm-lead-modal.component.scss']
})
export class ConfirmLeadModalComponent implements OnInit {
    dataSource: any;
    action = 'exit'
    clientRemark: any = ""
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
    authToken: string = localStorage.getItem("token");
    constructor(private dialog: MatDialog, public clipBoardService: ClipBoardService,
        private snackBar: MatSnackBar,
        private serverService: ServerService,
        private dialogRef: MatDialogRef<ConfirmLeadModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) { }

    ngOnInit() {
        this.dataSource = this.data;
    }

    yes() {
        if (this.userInfo.member_type == 'Client') {
            if (this.clientRemark.trim() == "") {
                this.clipBoardService.showMessgeInText("Client Remark cannot be blank", "error-snackbar")
            } else {
                this.dialogRef.close(this.clientRemark.replace(/\n/g, ' ').trim());
            }

        } else {
            this.dialogRef.close("yes");
        }
    }

    close() {
        this.dialogRef.close();
    }
}

