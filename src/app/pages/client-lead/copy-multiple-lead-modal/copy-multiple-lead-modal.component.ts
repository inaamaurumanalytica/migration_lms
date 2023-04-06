
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'copy-multiple-lead-modal',
    templateUrl: './copy-multiple-lead-modal.component.html',
    styleUrls: ['./copy-multiple-lead-modal.component.scss']
})
export class CopyMultipleLeadModalComponent implements OnInit {

    public userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
    public projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"));
    authToken: any = localStorage.getItem("token")

    showAssignProject: boolean = false;
    selectedProject: any = {}
    searchProject: string = ""
    projects: any[] = [];
    filteredProjects: any[] = []
    selectedLeads: any[] = []
    project: any = ''
    action = "";
    btnStatus: boolean = false
    status: string = "Fresh"
    existingCriteria: boolean = true

    constructor(private dialog: MatDialog, public clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private serverService: ServerService,
        private dialogRef: MatDialogRef<CopyMultipleLeadModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
        this.selectedProject = data.projectInfo
        this.selectedLeads = data.selectedLeads
    }

    ngOnInit() {
        this.projectList()

    }

    projectList() {
        this.serverService.projectsList(this.authToken).subscribe(
            data => {
                this.projects = data;
                this.filteredProjects = data
                for (let i = 0; i < this.projects.length; i++) {
                    if (this.selectedProject.id == this.projects[i].id) {
                        this.projects.splice(i, 1);
                        this.filteredProjects.splice(i, 1)
                    }
                }
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    assignProject() {
        this.btnStatus = true
        let body = {
            "copy_from_project": this.selectedProject.id,
            "copy_to_project": this.project,
            "to_copy_leads_ids": this.selectedLeads,
        }
        if (!this.existingCriteria) {
            body["set_to_status"] = this.status
        }
        this.serverService.copyLeadsToProject(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText("Leads Copied Successfully", "success-snackbar")
                this.dialogRef.close(data);
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    changeCriteria(val) {
        this.existingCriteria = val
        this.status = "Fresh"
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

