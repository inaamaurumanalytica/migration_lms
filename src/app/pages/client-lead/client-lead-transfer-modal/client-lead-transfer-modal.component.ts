import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDrpOptions, IMyDateRangeModel } from 'mydaterangepicker';
@Component({
    selector: 'client-lead-transfer-modal',
    templateUrl: './client-lead-transfer-modal.component.html',
    styleUrls: ['./client-lead-transfer-modal.component.scss']
})
export class ClientLeadTransferModalComponent implements OnInit {
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    project: any = JSON.parse(localStorage.getItem("projectInfo"))

    showAutoSetting: boolean = false;
    authToken: string = localStorage.getItem("token");
    selectedRadio = "All"
    limit: any = "";
    leadStatuses: any[] = [];
    userCount: any = {}
    assignedUsers: any[] = []
    sourceUsers: any[] = [];
    sourceUser: any = {}
    isLinear = true;
    filterCreateDate: any = "";
    filterVendorDate: any = "";
    filterClientDate: any = "";
    action = 'exit';
    showFilter: boolean = false;
    showSkeleton: boolean = true;
    users: any[] = [];
    filteredUsers: any[] = [];
    selectedUsers: any[] = [];

    score: any[] = []
    lead_status: any[] = []
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    leadCount: any = {};

    showSubmit: boolean = false

    btnStatus: boolean = false

    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private changeDetectorRef: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadTransferModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
        this.firstFormGroup = this.fb.group({
            sourceUser: ['', Validators.required],
            assignedUser: [[], Validators.required]
        });
        this.secondFormGroup = this.fb.group({
            score: [[]],
            lead_status: [[]],
            last_modified_by_client: [''],
            last_modified_by_vendor: [''],
            created_at: ['']
        });
    }

    ngOnInit() {
        this.getUsers()
        this.getActiveUser()
    }

    getUsers() {
        this.serverService.usersList(this.authToken).subscribe(
            data => {
                this.users = data.users;
                this.assignLeadProjectCount()
            },
            err => {
                this.showAutoSetting = true;
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    assignLeadProjectCount() {
        let body = {
            "project_id": this.data.id
        }
        this.serverService.assignLeadCountOfProject(body, this.authToken).subscribe(
            data => {
                for (let key in data) {
                    this.users.forEach(element => {
                        if (element.id == key) {
                            element["count"] = data[key];
                            this.sourceUsers.push(element)
                        }
                    })
                    if (key == "") {
                        let body = {
                            "id": 0,
                            "count": data[key],
                            "name": "Unassigned Lead"
                        }
                        this.sourceUsers.push(body)
                    }
                }
                this.showAutoSetting = true;
                this.showSkeleton = false
            },
            err => {
                this.showAutoSetting = true;
                this.showSkeleton = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getActiveUser() {
        this.serverService.activeUserByProject(this.data.id, this.authToken).subscribe(
            data => {
                this.assignedUsers = data.users;
                // this.assignLeadProjectCount()
            },
            err => {
                this.showAutoSetting = true;
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    filterUser() {
        this.userCount = this.firstFormGroup.value.sourceUser
        if (this.firstFormGroup.value.sourceUser.id != 0) {
            this.filteredUsers = this.assignedUsers.filter(el => el.id != this.firstFormGroup.value.sourceUser.id)
        } else {
            this.filteredUsers = this.assignedUsers;
        }
    }

    filterByUser() {
        this.selectedUsers = this.firstFormGroup.value.assignedUser;
    }

    chooseFilter(event) {
        if (event.value == "All") {
            this.showFilter = false
            this.selectedRadio = "All"
            this.score = [];
            this.lead_status = [];
            this.filterCreateDate = ""
            this.filterVendorDate = ""
            this.filterClientDate = ""
        } else {
            this.showFilter = true
            this.selectedRadio = "custom"
        }
    }

    onCreateDateRangeChanged(event: IMyDateRangeModel) {
        if (event.beginDate.year != 0) {
            this.filterCreateDate = [event.beginDate.year + '-' + event.beginDate.month + '-' + event.beginDate.day, event.endDate.year + '-' + event.endDate.month + '-' + event.endDate.day];
        } else {
            this.filterCreateDate = "";
        }
    }

    onLastVendorRange(event: IMyDateRangeModel) {
        if (event.beginDate.year != 0) {
            this.filterVendorDate = [event.beginDate.year + '-' + event.beginDate.month + '-' + event.beginDate.day, event.endDate.year + '-' + event.endDate.month + '-' + event.endDate.day];
        } else {
            this.filterVendorDate = "";
        }
    }

    onLastClientRange(event: IMyDateRangeModel) {
        if (event.beginDate.year != 0) {
            this.filterClientDate = [event.beginDate.year + '-' + event.beginDate.month + '-' + event.beginDate.day, event.endDate.year + '-' + event.endDate.month + '-' + event.endDate.day];
        } else {
            this.filterClientDate = "";
        }
    }

    submit() {
        // let all = true;
        let all = true;
        let assignedUser = []
        if (this.selectedRadio == "All") {
            all = true;
        } else {
            all = false;
        }
        if (this.firstFormGroup.value.assignedUser.length != 0) {
            assignedUser = this.firstFormGroup.value.assignedUser.map(a => a.id);
        }

        let body = {
            "project_id": this.data.id,
            "assign_user_ids": assignedUser,
            "all": all,
            "lead_filters": {},
            "limit": false,
            "limit_range": 1
        }
        if (this.firstFormGroup.value.sourceUser.id == 0) {
            body["source_user_id"] = null
        } else {
            body["source_user_id"] = this.firstFormGroup.value.sourceUser.id
        }
        if (this.limit == "") {
            body["limit"] = false;
            body["limit_range"] = 0;
        } else {
            body["limit"] = true;
            body["limit_range"] = parseInt(this.limit);
        }
        if (!all) {
            if (this.score.length != 0) {
                var result = this.score.map(x => {
                    return parseInt(x);
                });
                body.lead_filters["score"] = result;
            }
            if (this.lead_status.length != 0) {
                body.lead_filters["statuses"] = this.lead_status;
            }
            if (this.filterVendorDate != "") {
                body.lead_filters["last_vendor_status_updated_at"] = this.filterVendorDate;
            }
            if (this.filterClientDate != "") {
                body.lead_filters["last_client_status_updated_at"] = this.filterClientDate;
            }
            if (this.filterCreateDate != "") {
                body.lead_filters["created_at"] = this.filterCreateDate;
            }
        } else {
            body.lead_filters = {}
        }

        this.serverService.transferLeads(body, this.authToken).subscribe(
            data => {
                if (data.error) {
                    this.clipBoardService.showMessgeInText(data.error, "error-snackbar")
                } else {
                    this.clipBoardService.showMessgeInText(data.message, "success-snackbar")
                    this.dialogRef.close(data);
                }
                this.btnStatus = false
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
                this.btnStatus = false
            }
        )
    }

    nextPage() {
        this.showSubmit = true
    }
}

