
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';
import { MatSnackBar } from '@angular/material';
import { WebhookCopyComponent } from '../webhook-copy/webhook-copy.component';

@Component({
    selector: 'webhook-by-project',
    templateUrl: './webhook-by-project.component.html',
    styleUrls: ['./webhook-by-project.component.scss']
})
export class WebhookByProjectComponent implements OnInit {
    authToken: any = localStorage.getItem("token")
    btnStatus: boolean = false
    showAssignProject: boolean = false;
    projects: any[] = [];
    filteredProjects: any[] = []
    selectedProject: any = {}
    action = "";
    webhooks: any[] = []
    selectedWebhook: any = {}
    baseSearchInput: any = ""
    projectId: any = ""
    webhookCopyComponent : MatDialogRef<WebhookCopyComponent>

    constructor(public clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private serverService: ServerService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<WebhookByProjectComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
            this.projectId = data.id
    }

    ngOnInit() {
        this.projectList()
    }


    projectList() {
        this.serverService.projectsList(this.authToken).subscribe(
            data => {
                this.projects = data;
                this.filteredProjects = data
            },
            err => {
                this.dialogRef.close();
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    changeProject() {
        this.showAssignProject = false
        this.selectedWebhook = {}
        this.serverService.getWebhookList(this.selectedProject.id, this.authToken).subscribe(
            data => {
                this.showAssignProject = true
                this.webhooks = data;
                this.baseSearchInput = ""
                this.onKeyProject("")
            },
            err => {
                this.showAssignProject = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }



    close() {
        this.dialogRef.close();
    }

    onKeyProject(val) {
        if (val.trim() != '') {
            let filter = val.toLowerCase();
            this.filteredProjects = this.projects.filter(option => option.name.toLowerCase().includes(filter));
        } else {
            this.filteredProjects = this.projects
        }
    }

    submit() {
        let body = {
            project: this.projectId,
            webhook: this.selectedWebhook
        }
        this.btnStatus = true
        this.webhookCopyComponent = this.dialog.open(WebhookCopyComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            width: '100vw',
            maxWidth: '100vw',
            height: '100vh',
            panelClass: 'cdk-overlay-panel-right-side',
            data: body
        });
        this.webhookCopyComponent.afterClosed().subscribe(result => {
            if (result != undefined) {
                this.btnStatus = false
                this.dialogRef.close("Created Successfully")
            }
        })
    }
}

