import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-info-modal',
    templateUrl: './client-lead-info-modal.component.html',
    styleUrls: ['./client-lead-info-modal.component.scss']
})
export class ClientLeadInfoModalComponent implements OnInit {
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    authToken = localStorage.getItem("token")
    action = "";
    lead: any = {
        user: {},
        vendor: {},
        client: {}
    }
    webHookLog: any;
    Object = Object;
    showComponentLoader: boolean = false
    projectName: any;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<ClientLeadInfoModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.showComponentLoader = true
    }

    ngOnInit() {
        // console.log(this.userInfo.role)
        // console.log(this.data);
        let body = {
            lead_id:this.data.id,
            project_id:this.data.project_id,
        }
        if(this.userInfo.role == "SalesAdmin")
        {
            this.serverService.getLeadByIdSalesAccount(body, this.authToken).subscribe(
                data => {
                    this.lead = data;
                    // console.log(this.lead.name)
                    let projectInfo = JSON.parse(sessionStorage.getItem('projectInfo'));
                    // console.log(projectInfo.name);
                    // this.projectName = this.lead.project.name
                    this.projectName = projectInfo.name;
                    this.showComponentLoader = false
                },
                err => {
                    this.showComponentLoader = false
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
            )
        }
        else
        {
        this.serverService.getLeadById(this.data, this.authToken).subscribe(
            data => {
                this.lead = data;
                this.projectName = this.lead.project.name
                this.showComponentLoader = false
            },
            err => {
                this.showComponentLoader = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
    
    }
    close() {
        this.dialogRef.close();
    }

    over(event) {
        event.preventDefault()
        if (event.target.textContent.includes("http")) {
            event.target.style["cursor"] = "pointer"
            event.target.style["color"] = "blue"
        } else {
            event.target.style["cursor"] = ""
            for (let index = 0; index < document.getElementsByClassName("form-data-link").length; index++) {
                document.getElementsByClassName("form-data-link")[index].removeAttribute("style");
            }
        }
    }

    link(event) {
        if (event.target.textContent.includes("http")) {
            window.open(JSON.parse(event.target.textContent), '_blank');
        }
    }

    getWebHook() {
        this.serverService.getWebhookLogs(this.data, this.authToken).subscribe(
            data => {
                this.webHookLog = data;
                this.showComponentLoader = false
            },
            err => {
                this.showComponentLoader = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
}

