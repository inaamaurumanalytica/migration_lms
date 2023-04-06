import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';
@Component({
    selector: 'booking-filter-modal',
    templateUrl: './booking-filter-modal.component.html',
    styleUrls: ['./booking-filter-modal.component.scss']
})
export class BookingFilterModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    action = "";

    selectedClient: any = ""
    clients: any[] = []
    filteredClients: any[] = []

    selectedProject: any = ''
    projects: any[] = []
    filteredProjects: any[] = []


    bookingDate: any = ""
    createdAt: any = ""

    selectStatus: any = []
    selectUser: any = ''
    searchProject: any = ""
    searchClient: any = ""

    showComponentLoader: boolean = false
    pageIndex: number = 0;
    pageSize: number = 100;
    userList:any;

    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<BookingFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        if (data.bookingDate != undefined) {
            this.bookingDate = data.bookingDate
        }
        if (data.selectedProject != undefined) {
            this.selectedProject = data.selectedProject
        }
        if (data.selectedClient != undefined) {
            this.selectedClient = data.selectedClient
        }
        if (data.selectStatus != undefined) {
            this.selectStatus = data.selectStatus
        }
        if (data.user_id != undefined) {
            this.selectUser = data.user_id
        }
        if (data.createdAt != undefined) {
            this.createdAt = data.createdAt
        }
    }

    ngOnInit() {
        this.getAllUsers();
        this.getProjects()
        this.getClients()
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
        if (this.selectStatus.length != 0) {
            body["selectStatus"] = this.selectStatus
        }
        if (this.selectUser != undefined && this.selectUser != "") {
            body["user_id"] = this.selectUser
        }
        if (this.bookingDate != undefined && this.bookingDate != "") {
            body["bookingDate"] = this.bookingDate
        }
        if (this.createdAt != undefined && this.createdAt != "") {
            body["createdAt"] = this.createdAt
        }

        //console.log(this.selectUser)
        //console.log(body)

        this.dialogRef.close(body)
    }

    close() {
        this.dialogRef.close();
    }

    clear() {
        this.selectedProject = ""
        this.selectedClient = ""
        this.bookingDate = ""
        this.selectStatus = []
        this.selectUser = ""
        this.createdAt = ""
    }


    getAllUsers() {    
        this.pageIndex = 0;
        this.pageSize = 1000;
        let body = {
        }
        this.showComponentLoader = true
        let url = "all_users_search_n_filter/?per_page=" + this.pageSize + "&page=" + this.pageIndex;
        this.serverService.getUsersByFilter(url, body, this.authToken).subscribe(
          data => {
            this.userList = data.users
            //console.log(data)
            this.showComponentLoader = false
          },
          err => {
            this.showComponentLoader = false
            this.clipBoardService.checkServerError(err, this.authToken)
          }
        )
      }

}

