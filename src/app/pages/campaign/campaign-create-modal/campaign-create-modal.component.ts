import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'campaign-create-modal',
    templateUrl: './campaign-create-modal.component.html',
    styleUrls: ['./campaign-create-modal.component.scss']
})
export class CampaignCreateModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    campaignForm: FormGroup;
    leadStatusForm: FormGroup;

    scheduleTime: boolean = false;
    sendToAll: boolean = false;
    showSchedule: boolean = false;
    saveLink: boolean = false;
    showNextForm: boolean = false

    clients: any[] = []
    filteredClients: any[] = []
    projects: any[] = []
    projectsByClient: any[] = [];
    filteredProjectsByClient: any[] = []

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CampaignCreateModalComponent>,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        this.campaignForm = this.fb.group({
            'name': ['', Validators.required],
            'client': ['', Validators.required],
            'searchClient': [''],
            'searchProject': [''],
            'project': ['', Validators.required],
            'link': ['', [Validators.required, Validators.pattern("((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)")]],
            'message': ['', Validators.required],
            'senderId': ['', Validators.required],
            'shortenLink': ['', Validators.required]
        });

    }

    ngOnInit() {
        this.leadStatusForm = this.fb.group({
            'leadStatuses': [[], Validators.required],
            'startDate': [''],
            'endDate': [''],
            'scheduleDate': [''],
            'scheduleTime': [''],
            'sendToAll': [false],
            'showSchedule': [false]
        })
        this.leadStatusForm.get('startDate').setValidators([Validators.required])
        this.leadStatusForm.get('endDate').setValidators([Validators.required])
        this.leadStatusForm.get('startDate').updateValueAndValidity()
        this.leadStatusForm.get('endDate').updateValueAndValidity()
        this.getAllClients();
        this.getAllProjects();
    }

    checkDates(group: FormGroup) {
        if (group.controls.endDate.value < group.controls.startDate.value) {
            return { notValid: true }
        }
        return null;
    }

    createCampaign() {
        let scheduleData = "";
        let body = {};
        if (this.leadStatusForm.value.scheduleDate != null && this.leadStatusForm.value.scheduleDate != '') {
            scheduleData = this.leadStatusForm.value.scheduleDate + ' ' + this.leadStatusForm.value.scheduleTime + ':00'
        }
        body = {
            "name": this.campaignForm.value.name,
            "project_id": this.campaignForm.value.project.id,
            "client_id": this.campaignForm.value.client.id,
            "link": this.campaignForm.value.link,
            "short_link": this.campaignForm.value.shortenLink,
            "message": this.campaignForm.value.message,
            "sender_id": this.campaignForm.value.senderId,
            "lead_statuses": this.leadStatusForm.value.leadStatuses,
            "send_to_all": this.sendToAll,
            "lead_select_from_date": this.leadStatusForm.value.startDate,
            "lead_select_to_date": this.leadStatusForm.value.endDate,
            "scheduled": this.showSchedule,
            "schedule_time": scheduleData,
        }
        this.btnStatus = true;
        this.serverService.createCampaign(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false;
                this.dialogRef.close(data);
                this.clipBoardService.showMessgeInText("Campaign Created Succesfully", "success-snackbar")
            },
            err => {
                this.btnStatus = false;
                if (err.status == 401) {
                    let msg = JSON.parse(err._body)
                    if (msg.message == "Some error occured in sending sms.") {
                        this.dialogRef.close(body);
                    }
                    this.clipBoardService.showMessgeInText(msg.message, "error-snackbar")
                } else {
                    this.clipBoardService.showMessgeInText("Something went wrong", "error-snackbar")
                }
            }
        )
    }

    getAllClients() {
        this.serverService.clientsList(this.authToken).subscribe(
            data => {
                this.clients = data.client;
                this.filteredClients = data.client;
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
        this.campaignForm.controls.searchClient.setValue('')
        this.campaignForm.controls.searchProject.setValue('')
        let clientId = this.campaignForm.value.client.id;
        this.projectsByClient = this.projects.filter(ele => ele.disable == false && ele.client_id == clientId);
        this.filteredProjectsByClient = this.projectsByClient
        this.onKeyClient('')
    }

    changeByproject() {
        this.campaignForm.controls.searchClient.setValue('')
        this.campaignForm.controls.searchProject.setValue('')
        this.onKeyProject('')
    }

    close() {
        this.dialogRef.close();
    }

    next() {
        this.showNextForm = !this.showNextForm
    }

    sendAll() {
        this.sendToAll = !this.sendToAll
        this.leadStatusForm.controls.startDate.setValue('')
        this.leadStatusForm.controls.endDate.setValue('')
        if (!this.sendToAll) {
            this.leadStatusForm.get('startDate').setValidators([Validators.required])
            this.leadStatusForm.get('endDate').setValidators([Validators.required])
        } else {
            this.leadStatusForm.get("startDate").setValidators([])
            this.leadStatusForm.get("endDate").setValidators([])
        }
        this.leadStatusForm.get('startDate').updateValueAndValidity()
        this.leadStatusForm.get('endDate').updateValueAndValidity()
    }

    setSchedule() {
        this.showSchedule = !this.showSchedule
        this.leadStatusForm.controls.scheduleDate.setValue('')
        this.leadStatusForm.controls.scheduleTime.setValue('')
        if (this.showSchedule) {
            this.leadStatusForm.get('scheduleDate').setValidators([Validators.required])
            this.leadStatusForm.get('scheduleTime').setValidators([Validators.required])
        } else {
            this.leadStatusForm.get("scheduleDate").setValidators([])
            this.leadStatusForm.get("scheduleTime").setValidators([])
        }
        this.leadStatusForm.get('scheduleDate').updateValueAndValidity()
        this.leadStatusForm.get('scheduleTime').updateValueAndValidity()
    }

    shortenUrl() {
        this.campaignForm.controls.shortenLink.setValue('')
        if (this.campaignForm.value.link == "") {
            this.clipBoardService.showMessgeInText("Please Enter Link First", "error-snackbar")
            return
        }
        this.saveLink = true;
        this.serverService.shortenUrl(this.campaignForm.value.link, this.authToken).subscribe(
            data => {
                this.saveLink = false;
                if (data.status_code == 500) {
                    this.clipBoardService.showMessgeInText("Invalid URL", "error-snackbar")
                } else {
                    this.campaignForm.controls.shortenLink.setValue(data.data.url)
                    this.clipBoardService.showMessgeInText("Link Shortened Successfully", "success-snackbar")
                }
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    checkAudience() {
        let scheduleData = "";
        let body = {};
        if (this.leadStatusForm.value.scheduleDate != null && this.leadStatusForm.value.scheduleDate != '') {
            scheduleData = this.leadStatusForm.value.scheduleDate + ' ' + this.leadStatusForm.value.scheduleTime + ':00'
        }
        body = {
            "name": this.campaignForm.value.name,
            "project_id": this.campaignForm.value.project.id,
            "client_id": this.campaignForm.value.client.id,
            "link": this.campaignForm.value.link,
            "short_link": this.campaignForm.value.shortenLink,
            "message": this.campaignForm.value.message,
            "sender_id": this.campaignForm.value.senderId,
            "lead_statuses": this.leadStatusForm.value.leadStatuses,
            "send_to_all": this.sendToAll,
            "lead_select_from_date": this.leadStatusForm.value.startDate,
            "lead_select_to_date": this.leadStatusForm.value.endDate,
            "scheduled": this.showSchedule,
            "schedule_time": scheduleData,
            "check_audience": true
        }
        this.btnStatus = true;
        this.serverService.createCampaign(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false;
                this.clipBoardService.showMessgeInText("Total Audience is : " + data.count, "success-snackbar")
            },
            err => {
                this.btnStatus = false;
                this.clipBoardService.showMessgeInText("Something went wrong", "error-snackbar")
            }
        )
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
        this.campaignForm.controls.searchClient.setValue('')
        this.campaignForm.controls.searchProject.setValue('')
        this.onKeyProject('')
        this.onKeyClient('')
    }
}

