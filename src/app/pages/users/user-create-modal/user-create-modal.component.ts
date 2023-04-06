import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'user-create-modal',
    templateUrl: './user-create-modal.component.html',
    styleUrls: ['./user-create-modal.component.scss']
})
export class UserCreateModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    createUserForm: FormGroup;
    passwordMatch: boolean = false;
    vendors: any[] = [];
    clients: any[] = [];
    showClient: boolean = false;
    showVendor: boolean = false;
    isVendorAdmin:boolean= this.userInfo.member_type == "Vendor"?true:false;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UserCreateModalComponent>,
    ) {
        this.createUserForm = this.fb.group({
            name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', [
                Validators.required,
                Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
                Validators.email]
            ],
            memberType: [],
            member: [],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(25)]],
            password_confirmation: ['', Validators.required],
            role:[],
        }, { validator: this.checkIfMatchingPasswords('password', 'password_confirmation') });
    }

    ngOnInit() {
        this.getAllClients();
        this.getAllVendors();
    }

    getAllVendors() {
        this.serverService.vendorsList(this.authToken).subscribe(
            data => {
                this.vendors = data;
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getAllClients() {
        this.serverService.clientsList(this.authToken).subscribe(
            data => {
                this.clients = data.client;
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getTypeList() {
        if (this.createUserForm.value.memberType == "Vendor") {
            this.showClient = false;
            this.showVendor = true;
        } else {
            this.showVendor = false;
            this.showClient = true;
        }
    }


    addUser() {
        this.btnStatus = true;
        let body = {};
        if (this.userInfo.admin) {
            body = {
                "name": this.createUserForm.value.name,
                "username": this.createUserForm.value.username,
                "email": this.createUserForm.value.email,
                "member_type": this.createUserForm.value.memberType,
                "member_id": this.createUserForm.value.member,
                "password": this.createUserForm.value.password,
                "password_confirmation": this.createUserForm.value.password_confirmation
            }
        } 
        else if(this.userInfo.org_admin && this.userInfo.member_type == "Vendor"){
            body = {
                "name": this.createUserForm.value.name,
                "username": this.createUserForm.value.username,
                "email": this.createUserForm.value.email,
                "member_type": this.userInfo.member_type,
                "member_id": this.userInfo.member_id,
                "password": this.createUserForm.value.password,
                "password_confirmation": this.createUserForm.value.password_confirmation,
                "role":this.createUserForm.value.role
            }
        }
        
        else {
            body = {
                "name": this.createUserForm.value.name,
                "username": this.createUserForm.value.username,
                "email": this.createUserForm.value.email,
                "member_type": this.userInfo.member_type,
                "member_id": this.userInfo.member_id,
                "password": this.createUserForm.value.password,
                "password_confirmation": this.createUserForm.value.password_confirmation
            }
        }
        this.btnStatus = false
        this.serverService.createUser(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false;
                this.dialogRef.close(data);
                this.clipBoardService.showMessgeInText("User Added Succesfully", "success-snackbar");
            },
            err => {
                let message = JSON.parse(err._body);
                if (err.status == 422) {
                    this.clipBoardService.showMessgeInText(JSON.stringify(message.errors), "error-snackbar");
                } else {
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
                this.btnStatus = false;
            }
        )
    }


    close() {
        this.dialogRef.close();
    }

    checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
        return (group: FormGroup) => {
            const passwordInput = group.controls[passwordKey],
                passwordConfirmationInput = group.controls[passwordConfirmationKey];
            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({ notEquivalent: true })
            }
            else {
                return passwordConfirmationInput.setErrors(null);
            }
        }
    }
}

