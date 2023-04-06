import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDateRangeModel } from 'mydaterangepicker';
@Component({
    selector: 'dashboard-filter-modal',
    templateUrl: './dashboard-filter-modal.component.html',
    styleUrls: ['./dashboard-filter-modal.component.scss']
})
export class DashboardFilterModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    public projectInfo = JSON.parse(localStorage.getItem('projectInfo'));
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    action = "";

    selectedVendor: any = ""
    users: any[] = []
    lastVendorStatusModifiedDate: any = ""
    lastClientStatusModifiedDate: any = ""
    createdAt: any = ""
    modifiedAt: any = ""

    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };


    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<DashboardFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        if (data.lastVendorStatusModifiedDate != undefined) {
            this.lastVendorStatusModifiedDate = data.lastVendorStatusModifiedDate
        }
        if (data.lastClientStatusModifiedDate != undefined) {
            this.lastClientStatusModifiedDate = data.lastClientStatusModifiedDate
        }
        if (data.selectedVendor != undefined) {
            this.selectedVendor = data.selectedVendor
        }
        if (data.createdAt != undefined) {
            this.createdAt = data.createdAt
        }
        if (data.modifiedAt != undefined) {
            this.modifiedAt = data.modifiedAt
        }
    }

    ngOnInit() {
        this.getUsers()
    }

    getUsers() {
        this.serverService.usersList(this.authToken).subscribe(
            data => {
                this.users = data.users
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    filterLead() {
        let body = {}
        if (this.selectedVendor != undefined && this.selectedVendor != "") {
            body["selectedVendor"] = this.selectedVendor
        }
        if (this.lastVendorStatusModifiedDate != undefined && this.lastVendorStatusModifiedDate != "") {
            body["lastVendorStatusModifiedDate"] = this.lastVendorStatusModifiedDate
        }
        if (this.lastClientStatusModifiedDate != undefined && this.lastClientStatusModifiedDate != "") {
            body["lastClientStatusModifiedDate"] = this.lastClientStatusModifiedDate
        }
        if (this.createdAt != undefined && this.createdAt != "") {
            body["createdAt"] = this.createdAt
        }
        if (this.modifiedAt != undefined && this.modifiedAt != "") {
            body["modifiedAt"] = this.modifiedAt
        }
        this.dialogRef.close(body)
    }

    close() {
        this.dialogRef.close();
    }

    clear() {
        this.selectedVendor = ""
        this.lastVendorStatusModifiedDate = ""
        this.lastClientStatusModifiedDate = ""
        this.createdAt = ""
        this.modifiedAt = ""
    }
}

