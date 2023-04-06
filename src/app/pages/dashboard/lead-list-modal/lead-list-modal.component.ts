import { Component, OnInit, Inject, ElementRef, ViewChild, } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';
import { MatSnackBar, MatPaginator, MatSort, } from '@angular/material';
@Component({
    selector: 'lead-list-modal',
    templateUrl: './lead-list-modal.component.html',
    styleUrls: ['./lead-list-modal.component.scss']
})
export class LeadListModalComponent implements OnInit {

    showComponentLoader: boolean = false;
    authToken: string = localStorage.getItem("token")
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    action = "";
    pageIndex: number = 0;
    pageSize: number = 100;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    lead: any = {
        "leads": [],
        "pagination": {
            "total_count": 0
        }
    };
    constructor(private dialog: MatDialog, public clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private serverService: ServerService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<LeadListModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) { }

    ngOnInit() {
        this.getLeads();
    }

    close() {
        this.dialogRef.close();
    }

    getLeads() {
        let body = {
            "per_page": 100,
            "page": 1
        };
        let url = "leads?per_page=" + body.per_page + "&page=" + body.page + "&" + this.data.url;
        this.showComponentLoader = true
        this.serverService.leadsListByPage(url, this.authToken).subscribe(
            data => {
                this.lead = data;
                setTimeout(() => {
                    document.getElementById('mat-dailog-lead').scrollTop = 0;
                }, 500)
                this.showComponentLoader = false
            },
            err => {
                this.showComponentLoader = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getNext(event) {
        this.showComponentLoader = true
        let body = {
            "per_page": event.pageSize,
            "page": event.pageIndex + 1
        };
        let url = "leads?per_page=" + body.per_page + "&page=" + body.page + "&" + this.data.url;
        this.serverService.leadsListByPage(url, this.authToken).subscribe(
            data => {
                this.lead = data;
                setTimeout(() => {
                    document.getElementById('mat-dailog-lead').scrollTop = 0;
                }, 500)
                this.showComponentLoader = false
            },
            err => {
                this.showComponentLoader = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
}

