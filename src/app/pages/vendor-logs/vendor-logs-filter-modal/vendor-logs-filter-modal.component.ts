import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDateRangeModel } from 'mydaterangepicker';
@Component({
    selector: 'vendor-logs-filter-modal',
    templateUrl: './vendor-logs-filter-modal.component.html',
    styleUrls: ['./vendor-logs-filter-modal.component.scss']
})
export class VendorLogsFilterModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    action = "";
    selectType: any = ""
    selectAction: any = ""
    createdDate: any = ""
    selectUser: any = ""
    users: any = []


    hideObjectType = false
    mailing = false
    hideProfile = false
    hideProject = false
    hideUser = false
    hideLeadAttachment = false
    showProject = false

    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };


    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<VendorLogsFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        if (this.data.createdDate != undefined) {
            this.createdDate = this.data.createdDate
        }
        if (this.data.selectAction != undefined) {
            this.selectAction = this.data.selectAction
        }
        if (this.data.selectType != undefined) {
            this.selectType = this.data.selectType
        }
        if (data.selectUser != undefined) {
            this.selectUser = this.data.selectUser
        }
    }

    ngOnInit() {
        this.getUsers()
        this.changeByAction()
    }

    getUsers() {

        this.serverService.allUsers("all_users", this.authToken).subscribe(
            data => {
                this.users = data.users
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
    save() {
        let body = {}
        if (this.selectAction != undefined && this.selectAction != "") {
            body["selectAction"] = this.selectAction
        }
        if (this.selectType != undefined && this.selectType != "") {
            body["selectType"] = this.selectType
        }
        if (this.selectUser != undefined && this.selectUser != "") {
            body["selectUser"] = this.selectUser
        }
        if (this.createdDate != undefined && this.createdDate != "") {
            body["createdDate"] = this.createdDate
        }
        this.dialogRef.close(body)
    }

    close() {
        let body = {
            "selectType": "",
            "selectAction": "",
            "selectUser": "",
            "createdDate": ""
        }
        this.dialogRef.close(body);
    }

    clear() {
        this.selectType = ""
        this.selectAction = ""
        this.selectUser = ""
        this.createdDate = ""
    }

    // createdDateRangeChanged(event: IMyDateRangeModel) {
    //     if (event.beginDate.year != 0) {
    //         this.createdDate = [event.formatted.split(" - ")[0], event.formatted.split(" - ")[1]]
    //     } else {
    //         this.createdDate = "";
    //     }
    // }

    changeByAction() {
        this.hideObjectType = false
        this.mailing = false
        this.hideProfile = false
        this.hideProject = false
        this.hideUser = false
        this.hideLeadAttachment = false
        this.showProject = false
        if (this.selectAction == "Deleted") {
            this.hideObjectType = true
            this.hideProfile = true
            this.mailing = true
            this.showProject = true
        }
        if (this.selectAction == "Created") {
            this.hideObjectType = true
            this.hideProfile = true
            this.showProject = true
        }
        if (this.selectAction == "Exported" || this.selectAction == "Enabled" || this.selectAction == "Disabled") {
            this.hideProject = true
        }
        if (this.selectAction == "Updated") {
            this.hideLeadAttachment = true
            this.showProject = true
            this.mailing = true
        }
        this.selectType = ""
    }
}

