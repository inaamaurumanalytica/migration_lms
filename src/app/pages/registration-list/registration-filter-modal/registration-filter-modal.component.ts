import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDateRangeModel } from 'mydaterangepicker';
@Component({
    selector: 'registration-filter-modal',
    templateUrl: './registration-filter-modal.component.html',
    styleUrls: ['./registration-filter-modal.component.scss']
})
export class RegistrationFilterModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    action = "";
    selectType: any = ""
    selectAction: any = ""
    createdDate: any = ""
    selectUser: any = ""
    selectProject: any = ""
    users: any = []
    projects: any = []
    filteredProjects: any[] = []
    searchProject = ""

    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };


    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<RegistrationFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        if (this.data.createdDate != undefined) {
            this.createdDate = this.data.createdDate
        }
        if (data.selectProject != undefined) {
            this.selectProject = this.data.selectProject
        }
        if (data.selectUser != undefined) {
            this.selectUser = this.data.selectUser
        }
    }

    ngOnInit() {
        this.getUsers()
        this.getProjects()
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
        if (this.selectProject != undefined && this.selectProject != "") {
            body["selectProject"] = this.selectProject
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
            "selectProject": "",
            "selectUser": "",
            "createdDate": ""
        }
        this.dialogRef.close(body);
    }

    clear() {
        this.selectProject = ""
        this.selectUser = ""
        this.createdDate = ""
    }

    onKeyProject(val) {
        let filter = val.toLowerCase();
        this.filteredProjects = this.projects.filter(option => option.name.toLowerCase().includes(filter));
    }

    onFocusOutEvent(event) {
        this.searchProject = ""
        this.onKeyProject('')
    }
}

