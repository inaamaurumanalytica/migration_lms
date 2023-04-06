import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDateRangeModel } from 'mydaterangepicker';
@Component({
    selector: 'user-filter-modal',
    templateUrl: './user-filter-modal.component.html',
    styleUrls: ['./user-filter-modal.component.scss']
})
export class UserFilterModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    public projectInfo = JSON.parse(localStorage.getItem('projectInfo'));
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    action = "";

    createdAt: any = ""
    email_verified: boolean = false
    memberType: any = ''
    memberId: any = ""
    org_admin: boolean = false
    active: boolean = false
    phone_verified: boolean = false

    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };


    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<UserFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {


        if (data.createdAt != undefined) {
            this.createdAt = data.createdAt
        }
        this.email_verified = data.email_verified
        this.phone_verified = data.phone_verified
        this.active = data.active
        this.org_admin = data.org_admin
        if (data.memberType != undefined) {
            this.memberType = data.memberType
        }
        if (data.memberId != undefined) {
            this.memberId = data.memberId
        }

        if (data.createdAt != undefined) {
            this.createdAt = data.createdAt
        }
    }

    ngOnInit() {
    }


    filterLead() {
        let body = {}
        if (this.memberType != undefined && this.memberType != "") {
            body["memberType"] = this.memberType
        }

        if (this.memberId != undefined && this.memberId != "") {
            body["memberId"] = this.memberId
        }
        body["org_admin"] = this.org_admin
        body["phone_verified"] = this.phone_verified
        body["active"] = this.active
        body["email_verified"] = this.email_verified
        if (this.createdAt != undefined && this.createdAt != "") {
            body["createdAt"] = this.createdAt
        }
        this.dialogRef.close(body)
    }

    close() {
        this.dialogRef.close();
    }

    clear() {
        this.org_admin = false
        this.active = false
        this.phone_verified = false
        this.email_verified = false
        this.memberId = ""
        this.memberType = ""
        this.createdAt = ""
    }

}

