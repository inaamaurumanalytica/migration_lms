import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDateRangeModel, IMyDrpOptions } from 'mydaterangepicker';
@Component({
    selector: 'client-lead-filter-modal',
    templateUrl: './client-lead-filter-modal.component.html',
    styleUrls: ['./client-lead-filter-modal.component.scss']
})
export class ClientLeadFilterModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    public projectInfo = JSON.parse(localStorage.getItem('projectInfo'));
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    action = "";

    selectedClient: any = ""
    clients: any[] = []
    filteredClients: any[] = []

    selectedVendor: any = ""
    vendors: any[] = []

    selectedProject: any = ''
    projects: any[] = []
    filteredProjects: any[] = []

    selectedColor: any = ""
    colors: any[] = []

    createdDate: any = ""

    lastVendorStatusModifiedDate: any = ""
    lastClientStatusModifiedDate: any = ""
    createdAt: any = ""

    selectStatus: any = []
    leadStatuses: any = []
    isMaster: boolean = false

    users: any[] = []
    filterByVendorUser: any = ""
    filterByClientUser: any = ""

    searchProject: any = ""
    searchClient: any = ""

    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };
    
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<ClientLeadFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        if (data.master != undefined) {
            this.isMaster = true
        }
        if (data.lastVendorStatusModifiedDate != undefined) {
            this.lastVendorStatusModifiedDate = data.lastVendorStatusModifiedDate
        }
        if (data.lastVendorStatusModifiedDate != undefined) {
            this.lastVendorStatusModifiedDate = data.lastVendorStatusModifiedDate
        }
        if (data.lastClientStatusModifiedDate != undefined) {
            this.lastClientStatusModifiedDate = data.lastClientStatusModifiedDate
        }
        if (data.selectedProject != undefined) {
            this.selectedProject = data.selectedProject
        }
        if (data.selectedVendor != undefined) {
            this.selectedVendor = data.selectedVendor
        }
        if (data.filterByVendorUser != undefined) {
            this.filterByVendorUser = data.filterByVendorUser
        }
        if (data.filterByClientUser != undefined) {
            this.filterByClientUser = data.filterByClientUser
        }
        if (data.selectedColor != undefined) {
            this.selectedColor = data.selectedColor
        }
        if (data.selectedClient != undefined) {
            this.selectedClient = data.selectedClient
        }
        if (data.selectStatus != undefined) {
            this.selectStatus = data.selectStatus
        }
        if (data.createdAt != undefined) {
            this.createdAt = data.createdAt
        }
    }

    ngOnInit() {
        this.getProjects()
        this.getClients()
        this.getVendors()
        this.getColor()
        if (!this.isMaster) {
            this.getUsers()
        }
    }

    getUsers() {
        this.serverService.usersList(this.authToken).subscribe(
            data => {
                this.users = data.users;
            },
            err => {
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    getClients() {
        this.serverService.clientsList(this.authToken).subscribe(
            data => {
                this.clients = data.client
                this.filteredClients = data.client

            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    onKeyClient(val) {
        let filter = val.toLowerCase();
        this.filteredClients = this.clients.filter(option => option.name.toLowerCase().includes(filter));
    }

    onFocusOutEvent(event) {
        this.searchProject = ""
        this.searchClient = ""
        this.onKeyClient('')
        this.onKeyProject('')
    }

    getVendors() {
        this.serverService.vendorsList(this.authToken).subscribe(
            data => {
                this.vendors = data
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
    getColor() {
        this.serverService.getLeadColor(this.authToken).subscribe(
            data => {
                this.colors = data
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
    getProjects() {
        this.serverService.projectsList(this.authToken).subscribe(
            data => {
                this.projects = data
                this.filteredProjects = data
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    onKeyProject(val) {
        let filter = val.toLowerCase();
        this.filteredProjects = this.projects.filter(option => option.name.toLowerCase().includes(filter));
    }

    filterLead() {
        let body = {}
        if (this.selectedProject != undefined && this.selectedProject != "") {
            body["selectedProject"] = this.selectedProject
        }
        if (this.selectedClient != undefined && this.selectedClient != "") {
            body["selectedClient"] = this.selectedClient
        }
        if (this.selectedVendor != undefined && this.selectedVendor != "") {
            body["selectedVendor"] = this.selectedVendor
        }

        if (this.selectedColor != undefined && this.selectedColor != "") {
            body["selectedColor"] = this.selectedColor
        }
        if (this.filterByVendorUser != undefined && this.filterByVendorUser != "") {
            body["filterByVendorUser"] = this.filterByVendorUser
        }
        if (this.filterByClientUser != undefined && this.filterByClientUser != "") {
            body["filterByClientUser"] = this.filterByClientUser
        }
        if (this.selectStatus.length != 0) {
            body["selectStatus"] = this.selectStatus
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
        this.dialogRef.close(body)
    }

    close() {
        this.dialogRef.close();
    }

    clear() {
        this.filterByVendorUser = ""
        this.filterByClientUser = ""
        this.selectedProject = ""
        this.selectedClient = ""
        this.selectedVendor = ""
        this.selectedColor = ""
        this.lastVendorStatusModifiedDate = ""
        this.selectStatus = []
        this.lastClientStatusModifiedDate = ""
        this.createdAt = ""
    }

    selectColor(status) {
        return {
            "background-color": status.color_code,
            "margin-right": "10px"
        };
    }

}

