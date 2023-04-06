import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';
import { MatSnackBar } from '@angular/material';
@Component({
    selector: 'calls-list-modal',
    templateUrl: './calls-list-modal.component.html',
    styleUrls: ['./calls-list-modal.component.scss']
})
export class CallsListModalComponent implements OnInit {
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
    authToken: any = localStorage.getItem("token");
    lead: any = {}
    action = "";
    callList: any = {}
    displayedColumns: string[] = ['from', 'to', 'status', 'duration', 'link', 'created_at'];

    firstAttempt: any = ""
    lastAttempt: any = ""
    firstSuccessfull: any = ""
    lastSuccessfull: any = ""
    totalAttempt: any = ""
    totalSuccessfullAttempt: any = ""
    longTalkTime: any = ""
    constructor(
        public clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private serverService: ServerService,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<CallsListModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.lead = data
    }

    ngOnInit() {
        this.getCallsList()
    }

    getCallsList() {
        this.serverService.callsList(this.lead.id, this.authToken).subscribe(
            data => {
                this.callList = data
                if (this.callList.calls.length != 0) {
                    this.totalAttempt = this.callList.calls.length
                    this.totalSuccessfullAttempt = this.callList.calls.filter(el => el.status == 'completed').length
                    this.firstAttempt = this.callList.calls[this.callList.calls.length - 1].created_at
                    this.lastAttempt = this.callList.calls[0].created_at
                    let successfullCalls = this.callList.calls.filter(el => el.status == 'completed')
                    if (successfullCalls.length != 0) {
                        this.firstSuccessfull = successfullCalls[successfullCalls.length - 1].created_at
                        this.lastSuccessfull = successfullCalls[0].created_at
                        this.longTalkTime = Math.max.apply(Math, this.callList.calls.map(function (o) { return o.duration; }))
                    }
                }
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

