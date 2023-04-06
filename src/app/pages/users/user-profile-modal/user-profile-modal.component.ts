import { Component, OnInit, Inject, TestabilityRegistry } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { UserEditModalComponent } from '../user-edit-modal/user-edit-modal.component';
@Component({
    selector: 'user-profile-modal',
    templateUrl: './user-profile-modal.component.html',
    styleUrls: ['./user-profile-modal.component.scss']
})
export class UserProfileModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public authInfo = JSON.parse(localStorage.getItem("authInfo"));
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    showChangePassword: boolean = false
    userEditModalComponent: MatDialogRef<UserEditModalComponent>
    createUserForm: FormGroup;
    passwordMatch: boolean = false;
    showImgLoader: boolean = false;
    workingDays = []
    timeSlotByHour = [
        {
            "name": "0 Hour",
            "value": "00-a"
        },
        {
            "name": "1 Hour",
            "value": "01-a"
        },
        {
            "name": "2 Hour",
            "value": "02-a"
        },
        {
            "name": "3 Hour",
            "value": "03-a"
        },
        {
            "name": "4 Hour",
            "value": "04-a"
        },
        {
            "name": "5 Hour",
            "value": "05-a"
        },
        {
            "name": "6 Hour",
            "value": "06-a"
        },
        {
            "name": "7 Hour",
            "value": "07-a"
        },
        {
            "name": "8 Hour",
            "value": "08-a"
        },
        {
            "name": "9 Hour",
            "value": "09-a"
        },
        {
            "name": "10 Hour",
            "value": "10-a"
        },
        {
            "name": "11 Hour",
            "value": "11-a"
        },
        {
            "name": "12 Hour",
            "value": "12-p"
        },
        {
            "name": "13 Hour",
            "value": "01-p"
        },
        {
            "name": "14 Hour",
            "value": "02-p"
        },
        {
            "name": "15 Hour",
            "value": "03-p"
        },
        {
            "name": "16 Hour",
            "value": "04-p"
        },
        {
            "name": "17 Hour",
            "value": "05-p"
        },
        {
            "name": "18 Hour",
            "value": "06-p"
        },
        {
            "name": "19 Hour",
            "value": "07-p"
        },
        {
            "name": "20 Hour",
            "value": "08-p"
        },
        {
            "name": "21 Hour",
            "value": "09-p"
        },
        {
            "name": "22 Hour",
            "value": "10-p"
        },
        {
            "name": "23 Hour",
            "value": "11-p"
        }
    ];
    timeSlotByMinute = [
        {
            "name": "0 Min",
            "value": "00"
        },
        {
            "name": "1 Min",
            "value": "01"
        },
        {
            "name": "2 Min",
            "value": "02"
        },
        {
            "name": "3 Hour",
            "value": "03"
        },
        {
            "name": "4 Min",
            "value": "04"
        },
        {
            "name": "5 Min",
            "value": "05"
        },
        {
            "name": "6 Min",
            "value": "06"
        },
        {
            "name": "7 Min",
            "value": "07"
        },
        {
            "name": "8 Min",
            "value": "08"
        },
        {
            "name": "9 Min",
            "value": "09"
        },
        {
            "name": "10 Min",
            "value": "10"
        },
        {
            "name": "11 Min",
            "value": "11"
        },
        {
            "name": "12 Min",
            "value": "12"
        },
        {
            "name": "13 Min",
            "value": "13"
        },
        {
            "name": "13 Min",
            "value": "13"
        },
        {
            "name": "14 Min",
            "value": "14"
        },
        {
            "name": "15 Min",
            "value": "15"
        },
        {
            "name": "16 Min",
            "value": "16"
        },
        {
            "name": "17 Min",
            "value": "17"
        },
        {
            "name": "18 Min",
            "value": "18"
        },
        {
            "name": "19 Min",
            "value": "19"
        },
        {
            "name": "20 Min",
            "value": "20"
        },
        {
            "name": "21 Min",
            "value": "21"
        },
        {
            "name": "22 Min",
            "value": "22"
        },
        {
            "name": "23 Min",
            "value": "23"
        },
        {
            "name": "24 Min",
            "value": "24"
        },
        {
            "name": "25 Min",
            "value": "25"
        },
        {
            "name": "26 Min",
            "value": "26"
        },
        {
            "name": "27 Min",
            "value": "27"
        },
        {
            "name": "28 Min",
            "value": "28"
        },
        {
            "name": "29 Min",
            "value": "29"
        },
        {
            "name": "30 Min",
            "value": "30"
        },
        {
            "name": "31 Min",
            "value": "31"
        },
        {
            "name": "32 Min",
            "value": "32"
        },
        {
            "name": "33 Min",
            "value": "33"
        },
        {
            "name": "34 Min",
            "value": "34"
        },
        {
            "name": "35 Min",
            "value": "35"
        },
        {
            "name": "36 Min",
            "value": "36"
        },
        {
            "name": "37 Min",
            "value": "37"
        },
        {
            "name": "38 Min",
            "value": "38"
        },
        {
            "name": "39 Min",
            "value": "39"
        },
        {
            "name": "40 Min",
            "value": "40"
        },
        {
            "name": "41 Min",
            "value": "41"
        },
        {
            "name": "42 Min",
            "value": "42"
        },
        {
            "name": "43 Min",
            "value": "43"
        },
        {
            "name": "44 Min",
            "value": "44"
        },
        {
            "name": "45 Min",
            "value": "45"
        },
        {
            "name": "46 Min",
            "value": "46"
        },
        {
            "name": "47 Min",
            "value": "47"
        },
        {
            "name": "48 Min",
            "value": "48"
        },
        {
            "name": "49 Min",
            "value": "49"
        },
        {
            "name": "50 Min",
            "value": "50"
        },
        {
            "name": "51 Min",
            "value": "51"
        },
        {
            "name": "52 Min",
            "value": "52"
        },
        {
            "name": "53 Min",
            "value": "53"
        },
        {
            "name": "54 Min",
            "value": "54"
        },
        {
            "name": "55 Min",
            "value": "55"
        },
        {
            "name": "56 Min",
            "value": "56"
        },
        {
            "name": "57 Min",
            "value": "57"
        },
        {
            "name": "58 Min",
            "value": "58"
        },
        {
            "name": "59 Min",
            "value": "59"
        }

    ]
    timeSlote = {
        "startHour": "",
        "endHour": "",
        "startMinute": "",
        "endMinute": "",
        "startValue": "am",
        "endValue": "am",
    }
    imageChangedEvent: any = '';
    showTimeSlot: boolean = false;
    text: string;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<UserProfileModalComponent>,
    ) {
        this.userInfo["shortName"] = this.userInfo.name.match(/\b(\w)/g).join('')
        this.createUserForm = this.fb.group({
            current_password: ['', Validators.required],
            password: ['', Validators.required],
            password_confirmation: ['', Validators.required],
        }, { validator: this.checkPasswords })
    }

    ngOnInit() {

    }

    dateValidation() {


    }

    fileChangeEvent(event: any): void {
        const formData: FormData = new FormData();
        formData.append('avatar', event.target.files[0]);
        this.showImgLoader = true;
        this.serverService.clientUploadUserImage(formData, this.authToken).subscribe(
            data => {
                this.userInfo.avatar = data.avatar
                localStorage.setItem("userInfo", JSON.stringify(data))
                this.clipBoardService.showMessgeInText("Profile Image Updated Successfully", "success-snackbar")
                this.showImgLoader = false;
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
                this.showImgLoader = false;

            }
        )
    }


    close() {
        this.dialogRef.close();
    }

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        let pass = group.controls.password.value;
        let confirmPass = group.controls.password_confirmation.value;

        return pass === confirmPass ? null : { notSame: true }
    }

    confirmPass() {
        this.passwordMatch = false;
        if (this.createUserForm.value.password_confirmation.length > 4) {
            if (this.createUserForm.value.password_confirmation != this.createUserForm.value.password) {
                this.passwordMatch = true;
            }
        }
    }

    cancle() {
        this.showChangePassword = false
        this.showTimeSlot = false
        this.createUserForm.reset()
    }

    clickToShowPassword() {
        this.showChangePassword = true
        this.showTimeSlot = false;
        this.createUserForm.reset()
    }
    clickToShowTime() {
        this.showTimeSlot = true
        this.showChangePassword = false;
        this.createUserForm.reset()
    }

    save() {
        this.btnStatus = true
        let body = {
            "current_password": this.createUserForm.value.current_password,
            "password": this.createUserForm.value.password,
            "password_confirmation": this.createUserForm.value.password_confirmation
        }
        this.serverService.changePassword(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.showChangePassword = false
                this.createUserForm.reset()
                this.clipBoardService.showMessgeInText("Password Changed Successfully", "success-snackbar")
            },
            err => {
                this.btnStatus = false
                this.showChangePassword = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    working() {
        // this.dateValidation()
        this.btnStatus = true
        let startHourTime = this.timeSlote.startHour.split("-")
        let startZone = ""
        if (startHourTime[1] == 'a') {
            startZone = "am"
        } else {
            startZone = "pm"
        }

        let endHourTime = this.timeSlote.endHour.split("-")
        let endZone = ""
        if (endHourTime[1] == 'a') {
            endZone = "am"
        } else {
            endZone = "pm"
        }

        const body = {
            "working": {
                "days": this.workingDays,
                "beginning_of_workday": startHourTime[0] + ':' + this.timeSlote.startMinute + ' ' + startZone,
                "end_of_workday": endHourTime[0] + ':' + this.timeSlote.endMinute + ' ' + endZone,
            },
            "user_id": this.userInfo.id
        }
        this.serverService.updateUser(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText("Working Days Set Successfully", "success-snackbar");
                this.userInfoData()
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    addDays(event, value) {

        let day = this.workingDays.filter(el => el == value)
        if (day.length == 0) {
            this.workingDays.push(value)
            event.target.classList.add("bg-active")
        } else {
            event.target.classList.remove("bg-active")
            this.workingDays = this.workingDays.filter(el => el != value)
        }
    }

    checkActive(value) {
        if (this.userInfo.working != null) {
            let day = this.userInfo.working.days.filter(el => el == value)
            if (day.length != 0) {
                return 'bg-active'
            }
        }
    }

    changeMode(event) {
        let body = {
            "positive_work_mode": event.checked,
            "user_id": this.userInfo.id
        }
        this.serverService.updateUser(body, this.authToken).subscribe(
            data => {
                if (event.checked) {
                    this.clipBoardService.showMessgeInText("Work Mode Enabled", "success-snackbar");
                } else {
                    this.clipBoardService.showMessgeInText("Work Mode Disabaled", "success-snackbar");
                }
                this.userInfoData()
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    clickToEditUser() {
        this.userEditModalComponent = this.dialog.open(UserEditModalComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            width: '500px',
            panelClass: 'cdk-overlay-panel-right-side',
            data: this.userInfo
        });
        this.userEditModalComponent.afterClosed().subscribe(result => {
            if (result != undefined) {
                this.userInfoData()
                // this.userInfo = result
                // localStorage.setItem("userInfo", JSON.stringify(result))
            }
        })
    }

    userInfoData() {
        this.serverService.userInfo(this.authToken).subscribe(
            data => {
                this.userInfo = data
                localStorage.setItem("userInfo", JSON.stringify(data))
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }
}

