import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDateRangeModel } from 'mydaterangepicker';
@Component({
    selector: 'client-filter-modal',
    templateUrl: './client-filter-modal.component.html',
    styleUrls: ['./client-filter-modal.component.scss']
})
export class ClientFilterModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    public projectInfo = JSON.parse(localStorage.getItem('projectInfo'));
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    action = "";

    createdAt: any = ""
    updatedAt: any = ""

    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<ClientFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {


        if (data.createdAt != undefined) {
            this.createdAt = data.createdAt
        }
        if (data.updatedAt != undefined) {
            this.updatedAt = data.updatedAt
        }
    }

    ngOnInit() {
    }


    filterLead() {
        let body = {}

        if (this.createdAt != undefined && this.createdAt != "") {
            body["createdAt"] = this.createdAt
        }
        if (this.updatedAt != undefined && this.updatedAt != "") {
            body["updatedAt"] = this.updatedAt
        }
        this.dialogRef.close(body)
    }

    close() {
        this.dialogRef.close();
    }

    clear() {
        this.updatedAt = ""
        this.createdAt = ""
    }

}

