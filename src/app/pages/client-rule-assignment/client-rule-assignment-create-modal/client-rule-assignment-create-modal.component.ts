import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-rule-assignment-create-modal',
    templateUrl: './client-rule-assignment-create-modal.component.html',
    styleUrls: ['./client-rule-assignment-create-modal.component.scss']
})
export class ClientRuleAssignmentCreateModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    project: any = JSON.parse(localStorage.getItem("projectInfo"))
    action = "";
    btnStatus: boolean = false
    createRuleForm: FormGroup;
    projects: any[] = []
    filteredProjects: any[] = []
    authToken = localStorage.getItem("token")
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientRuleAssignmentCreateModalComponent>) {
        this.createRuleForm = this.fb.group({
            name: ['', Validators.required],
            project: ['', Validators.required],
            searchProject: ['']
        })
        this.getProject()
    }

    ngOnInit() {

    }

    getProject() {
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

    close() {
        this.dialogRef.close();
    }

    save() {
        this.btnStatus = true
        let body = {
            "rule_name": this.createRuleForm.value.name,
            "project_id": this.createRuleForm.value.project
        }
        this.serverService.createAssignment(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText("Rule Assignment Created Successfully", "success-snackbar")
                this.dialogRef.close("Rule Assignment Created Successfully")
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    onKeyProject(val) {
        let filter = val.toLowerCase();
        this.filteredProjects = this.projects.filter(option => option.name.toLowerCase().includes(filter));
    }

    onFocusOutEvent(event) {
        this.createRuleForm.controls.searchProject.setValue('')
        this.onKeyProject('')
    }
}

