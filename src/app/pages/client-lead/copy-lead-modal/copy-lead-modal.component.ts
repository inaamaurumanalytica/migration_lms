
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'copy-lead-modal',
    templateUrl: './copy-lead-modal.component.html',
    styleUrls: ['./copy-lead-modal.component.scss']
})
export class CopyLeadModalComponent implements OnInit {
    btnStatus: boolean = false
    clients: any[] = []
    filteredClients: any[] = []
    projects: any[] = []
    projectsByClient: any[] = [];
    filteredProjectsByClient: any[] = []
    public userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
    public projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"));
    copyLeadForm: FormGroup;
    authToken: any = localStorage.getItem("token")

    constructor(private dialog: MatDialog, public clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private serverService: ServerService,
        private dialogRef: MatDialogRef<CopyLeadModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
        this.copyLeadForm = this.fb.group({
            name: [this.data.name],
            phone: [this.data.phone],
            email: [this.data.email],
            clientId: ["", Validators.required],
            projectId: ["", Validators.required],
            'searchClient': [''],
            'searchProject': [''],
        });
    }

    ngOnInit() {
        this.getAllClients();
        this.getAllProjects();
    }


    save() {
        this.btnStatus = true;
        let body = {
            "name": this.data.name,
            "email": this.data.email,
            "phone": this.data.phone,
            "budget": this.data.budget,
            "lead_status": "Fresh",
            "source": this.data.source,
            "client_id": this.copyLeadForm.value.clientId,
            "project_id": this.copyLeadForm.value.projectId
        }
        this.serverService.createLead(body, this.authToken).subscribe(
            data => {
                if (data.message == "Invalid request") {
                    this.clipBoardService.showMessgeInText("Invalid Request", "error-snackbar")
                } else {
                    this.dialogRef.close(data);
                    this.clipBoardService.showMessgeInText("Lead Copied Succesfully", "success-snackbar")
                }
                this.btnStatus = false;
            },
            err => {
                this.btnStatus = false;
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    getAllClients() {
        this.serverService.clientsList(this.authToken).subscribe(
            data => {
                this.clients = data.client.filter(ele => ele.disable == false);
                this.filteredClients = data.client.filter(ele => ele.disable == false);
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getAllProjects() {
        this.serverService.projectsList(this.authToken).subscribe(
            data => {
                this.projects = data;
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    changeByClient() {
        this.copyLeadForm.controls.searchClient.setValue('')
        this.copyLeadForm.controls.searchProject.setValue('')
        let clientId = this.copyLeadForm.value.clientId;
        this.projectsByClient = this.projects.filter(ele => ele.disable == false && ele.client_id == clientId);
        this.filteredProjectsByClient = this.projectsByClient
        this.onKeyClient('')
    }

    changeByproject() {
        this.copyLeadForm.controls.searchClient.setValue('')
        this.copyLeadForm.controls.searchProject.setValue('')
        this.onKeyProject('')
    }

    onKeyProject(val) {
        let filter = val.toLowerCase();
        this.filteredProjectsByClient = this.projectsByClient.filter(option => option.name.toLowerCase().includes(filter));
    }

    onKeyClient(val) {
        let filter = val.toLowerCase();
        this.filteredClients = this.clients.filter(option => option.name.toLowerCase().includes(filter));
    }

    onFocusOutEvent(event) {
        this.copyLeadForm.controls.searchClient.setValue('')
        this.copyLeadForm.controls.searchProject.setValue('')
        this.onKeyProject('')
        this.onKeyClient('')
    }
}

