import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDateRangeModel } from 'mydaterangepicker';
@Component({
    selector: 'client-export-lead-modal',
    templateUrl: './client-export-lead-modal.component.html',
    styleUrls: ['./client-export-lead-modal.component.scss']
})
export class ClientExportLeadModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    createdDate: any = ""
    modifiedDate: any = ""
    allLeads: boolean = false
    exportLeadShow: boolean = false
    selectStatus: any = []
    vendors: any = []
    filterByVen: any = ''

    filterClientDate: any = ''
    filterCreateDate: any = ''
    filterDate: any = ''

    showComponentLoader: boolean = false

    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };

    constructor(
        private dialogRef: MatDialogRef<ClientExportLeadModalComponent>,
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
    }

    ngOnInit() {
        if (this.userInfo.member_type == 'Client' || this.userInfo.admin) {
            this.getAllVendors()
        }
    }

    getAllVendors() {
        this.serverService.vendorsList(this.authToken).subscribe(
            data => {
                this.vendors = data
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    save() {        
                
        this.exportLeadShow = true
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        let csvContent = "";
        let body = {}

        if (!this.allLeads) {
            if (this.filterByVen != "") {
                body["vendor_id"] = this.filterByVen;
            }
            if (this.selectStatus.length != 0) {
                body["statuses"] = this.selectStatus
            }
            if (this.userInfo.member_type == 'Client') {
                if (this.filterClientDate != undefined && this.filterClientDate != "") {
                    body["last_client_status_updated_at"] = [this.filterClientDate.formatted.split(" - ")[0], this.filterClientDate.formatted.split(" - ")[1]]
                }
            } else {
                if (this.filterCreateDate != undefined && this.filterCreateDate != "") {
                    body["created_at"] = [this.filterCreateDate.formatted.split(" - ")[0], this.filterCreateDate.formatted.split(" - ")[1]]
                }
            }
            if (this.filterDate != undefined && this.filterDate != "") {
                body["last_vendor_status_updated_at"] = [this.filterDate.formatted.split(" - ")[0], this.filterDate.formatted.split(" - ")[1]]
            }
        }

        let filename = "";

        if (this.data == "mLExport") {
            body["project_id"] = this.data.id
            if (this.selectStatus.length != 0) {
                filename = this.selectStatus[0] + "-" + dd + "-" + mm + "-" + yyyy + ".csv";
            } else {
                filename = "Export-lead" + "-" + dd + "-" + mm + "-" + yyyy + ".csv";
            }
        } else {
            body["project_id"] = this.data.id
            filename = this.data.name + "-" + dd + "-" + mm + "-" + yyyy + ".csv";
        }
        this.showComponentLoader = true
        
        this.serverService.exportLead(body, this.authToken).subscribe(
            data => {
                var csvData = new Blob([csvContent + data._body], { type: 'text/csv' });
                var csvUrl = URL.createObjectURL(csvData);
                var link = document.createElement("a");
                link.setAttribute("href", csvUrl);
                link.setAttribute("id", "csvUrl");
                link.setAttribute("download", filename);
                link.innerHTML = "";
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.getElementById("csvUrl").remove()
                }, 1000)
                this.showComponentLoader = false
                this.exportLeadShow = false
                this.dialogRef.close();
            },
            err => {
                this.showComponentLoader = false
                this.exportLeadShow = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    clear() {
        this.selectStatus = []
        this.filterDate = ""
        this.filterClientDate = ""
        this.filterCreateDate = ""
    }

    createdDateRangeChanged(event: IMyDateRangeModel) {
        if (event.beginDate.year != 0) {
            this.filterCreateDate = [event.formatted.split(" - ")[0], event.formatted.split(" - ")[1]]
        } else {
            this.filterCreateDate = "";
        }
    }

    modifiedClientDateRangeChanged(event: IMyDateRangeModel) {
        if (event.beginDate.year != 0) {
            this.filterClientDate = [event.formatted.split(" - ")[0], event.formatted.split(" - ")[1]]
        } else {
            this.filterClientDate = "";
        }
    }

    modifiedDateRangeChanged(event: IMyDateRangeModel) {
        if (event.beginDate.year != 0) {
            this.filterDate = [event.formatted.split(" - ")[0], event.formatted.split(" - ")[1]]
        } else {
            this.filterDate = "";
        }
    }

    checkAutoExportLead() {
        this.allLeads = !this.allLeads
        if (!this.allLeads) {
            this.clear()
        }
        // console.log(this.allLeads)
    }

}

