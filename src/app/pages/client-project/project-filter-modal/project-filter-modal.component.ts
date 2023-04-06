import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDateRangeModel } from 'mydaterangepicker';
@Component({
    selector: 'project-filter-modal',
    templateUrl: './project-filter-modal.component.html',
    styleUrls: ['./project-filter-modal.component.scss']
})
export class ProjectFilterModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    public projectInfo = JSON.parse(localStorage.getItem('projectInfo'));
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    action = "";

    clients: any[] = []

    createdAt: any = ""
    auto_verify: boolean = false
    disable: any = ''
    client_id: any = ""
    qualified: boolean = false


    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };

    
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<ProjectFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {


        if (data.createdAt != undefined) {
            this.createdAt = data.createdAt
        }
        this.auto_verify = data.auto_verify
        this.disable = data.disable
        this.qualified = data.qualified
        if (data.client_id != undefined) {
            this.client_id = data.client_id
        }
        if (this.userInfo.member_type == "Vendor") {
            this.getClients()
        }
    }

    ngOnInit() {
    }


    filterLead() {
        let body = {}
        if (this.client_id != undefined && this.client_id != "") {
            body["client_id"] = this.client_id
        }
        body["disable"] = this.disable
        body["auto_verify"] = this.auto_verify
        body["qualified"] = this.qualified
        if (this.createdAt != undefined && this.createdAt != "") {
            body["createdAt"] = this.createdAt
        }
        this.dialogRef.close(body)
    }

    close() {
        this.dialogRef.close();
    }

    clear() {
        this.auto_verify = false
        this.disable = false
        this.qualified = false
        this.client_id = ""
        this.createdAt = ""
    }

    getClients() {
        this.serverService.clientsList(this.authToken).subscribe(
            data => {
                this.clients = data.client
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
}

