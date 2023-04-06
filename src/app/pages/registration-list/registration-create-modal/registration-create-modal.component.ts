import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'registration-create-modal',
    templateUrl: './registration-create-modal.component.html',
    styleUrls: ['./registration-create-modal.component.scss']
})
export class RegistrationCreateModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    registrationForm: FormGroup;
    projects: any[] = []
    filteredProjects: any[] = []
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<RegistrationCreateModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        if (this.data == null) {
            this.registrationForm = this.fb.group({
                name: [""],
                email: ["", [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
                Validators.email]],
                phone: ["", [Validators.required, , Validators.pattern('[1-9]{1}[0-9]{9}')]],
                projectId: ["", Validators.required],
                searchProject: [""]
            });
        } else {
            this.registrationForm = this.fb.group({
                name: [""],
                email: ["", [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
                Validators.email]],
                phone: ["", [Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]],
            });
        }
    }

    ngOnInit() {
        if (this.data == null) {
            this.getProjects()
        }
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


    addRegistration() {
        this.btnStatus = true;
        let body = {}
        if (this.data == null) {
            body = {
                "name": this.registrationForm.value.name,
                "email": this.registrationForm.value.email,
                "phone": this.registrationForm.value.phone,
                "project_id": this.registrationForm.value.projectId
            }
        } else {
            body = {
                "name": this.registrationForm.value.name,
                "email": this.registrationForm.value.email,
                "phone": this.registrationForm.value.phone,
                "project_id": this.data.id
            }
        }
        if (body["email"].trim() == "") {
            delete body["email"]
        }
        this.serverService.createRegistration(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false;
                if (data.error != undefined) {
                    this.clipBoardService.showMessgeInText(data.error, "error-snackbar");
                } else {
                    this.clipBoardService.showMessgeInText("Registered Successfully", "success-snackbar");
                    this.dialogRef.close(data)
                }
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

    restrictNumeric(e) {
        let input;
        if (e.metaKey || e.ctrlKey) {
            return true;
        }
        if (e.which === 32) {
            return false;
        }
        if (e.which === 0) {
            return true;
        }
        if (e.which < 33) {
            return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[\d\s]/.test(input);
    }

    onKeyProject(val) {
        let filter = val.toLowerCase();
        this.filteredProjects = this.projects.filter(option => option.name.toLowerCase().includes(filter));
    }

    onFocusOutEvent(event) {
        this.registrationForm.controls.searchProject.setValue('')
        this.onKeyProject('')
    }
}

