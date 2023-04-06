import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-create-modal',
    templateUrl: './client-lead-create-modal.component.html',
    styleUrls: ['./client-lead-create-modal.component.scss']
})
export class ClientLeadCreateModalComponent implements OnInit {
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    btnStatus: boolean = false
    createLeadForm: FormGroup;
    clients: any[] = []
    public min = new Date()
    filteredClients: any[] = []
    projects: any[] = []
    projectsByClient: any[] = [];
    filteredProjectsByClient: any[] = []
    vendorRequired: boolean = false
    authToken = localStorage.getItem("token")
    showProject: boolean = false
    isShowMoreField:boolean=false;
    showArrowRight:boolean=true;
    showArrowDown:boolean=false;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadCreateModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
        this.createLeadForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            phone: [''],
            leadStatus: ['', Validators.required],
            source: [''],
            leadState:['',Validators.required],
            score: ['', Validators.required],
            budget: [''],
            dateTime: [''],
            vendorRemark: [''],
            clientId: [''],
            projectId: [''],
            searchClient: [''],
            searchProject: [''],
            
            // clientRemark:[''],
            utmSource:[''],
            utmMedium:[''],
            utmCampaign:[''],
            utmTerm:[''],
            utmContent:[''],
            metaChecksum:[''],
            fbCampaignId:[''],
            fbCampaignName:[''],
            fbAdsetId:[''],
            fbAdsetName:[''],
            fbAdId:[''],
            fbAdName:[''],
            googleCampaignId:[''],
            googleCampaignName:[''],
            googleAdgroupId:[''],
            googleAdgroupName:[''],
            googleKeywordId:[''],
            googleKeywordName:[''],
            googleAdId:[''],
            googleAdName:[''],
            // meta:[''],
            
        })
        if (data == null) {
            this.showProject = true
            this.getProjects()
            this.getClients()
        }
    }

    ngOnInit() {

    }

    changeLeadStatus() {
        if (this.createLeadForm.value.leadStatus == 'Not Interested' || this.createLeadForm.value.leadStatus == 'Not Responding' ||
            this.createLeadForm.value.leadStatus == 'Not Available' || this.createLeadForm.value.leadStatus == 'V Not Interested' ||
            this.createLeadForm.value.leadStatus == 'V Not Responding' || this.createLeadForm.value.leadStatus == 'V Not Available') {

            this.vendorRequired = true
            this.createLeadForm.controls["vendorRemark"].setValidators([Validators.required]);
        } else {
            this.vendorRequired = false
            this.createLeadForm.controls["vendorRemark"].setValidators([]);
        }
        this.createLeadForm.controls["vendorRemark"].updateValueAndValidity()
    }

    save() {
        this.btnStatus = true
        let body = {
            "name": this.createLeadForm.value.name,
            "email": this.createLeadForm.value.email,
            "phone": this.createLeadForm.value.phone,
            "budget": this.createLeadForm.value.budget,
            "source": this.createLeadForm.value.source,
            "score": this.createLeadForm.value.score,
            "lead_status": this.createLeadForm.value.leadStatus,
            "lead_state":this.createLeadForm.value.leadState,
            "vendor_remark": this.createLeadForm.value.vendorRemark,
            "client_id": this.createLeadForm.value.clientId,
            "project_id": this.createLeadForm.value.projectId,

            "client_remark": '',
            "utm_source": this.createLeadForm.value.utmSource,
            "utm_medium": this.createLeadForm.value.utmMedium,
            "utm_campaign": this.createLeadForm.value.utmCampaign,
            "utm_term": this.createLeadForm.value.utmTerm,
            "utm_content": this.createLeadForm.value.utmContent,
            "meta_checksum": this.createLeadForm.value.metaChecksum,
            "fb_campaign_id": this.createLeadForm.value.fbCampaignId,
            "fb_campaign_name": this.createLeadForm.value.fbCampaignName,
            "fb_adset_id": this.createLeadForm.value.fbAdsetId,
            "fb_adset_name": this.createLeadForm.value.fbAdsetName,
            "fb_ad_id": this.createLeadForm.value.fbAdId,
            "fb_ad_name": this.createLeadForm.value.fbAdName,
            "google_campaign_id": this.createLeadForm.value.googleCampaignId,
            "google_campaign_name": this.createLeadForm.value.googleCampaignName,
            "google_adgroup_id": this.createLeadForm.value.googleAdgroupId,
            "google_adgroup_name": this.createLeadForm.value.googleAdgroupName,
            "google_keyword_id": this.createLeadForm.value.googleKeywordId,
            "google_keyword_name": this.createLeadForm.value.googleKeywordName,
            "google_ad_id": this.createLeadForm.value.googleAdId,
            "google_ad_name": this.createLeadForm.value.googleAdName,
            "meta": {},

        }
        console.log(body)
        if (this.userInfo.member_type == "Vendor" && this.createLeadForm.value.leadStatus == 'Appointment Proposed') {
            body["vendor_appointment_date"] = this.createLeadForm.value.dateTime
        }
        if (this.data == undefined) {
            body["client_id"] = this.createLeadForm.value.clientId
            body["project_id"] = this.createLeadForm.value.projectId
        } else {
            body["client_id"] = this.data.client.id
            body["project_id"] = this.data.id
        }

        this.serverService.createLead(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                if (data.message == "Invalid request") {
                    this.clipBoardService.showMessgeInText("Invalid Request", "error-snackbar")
                } else {
                    this.dialogRef.close(data);
                    this.clipBoardService.showMessgeInText("Lead Created Successfully", "success-snackbar")
                }
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getClients() {
        this.serverService.clientsList(this.authToken).subscribe(
            data => {
                this.clients = data.client
                this.filteredClients = data.client;
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getProjects() {
        this.serverService.projectsList(this.authToken).subscribe(
            data => {
                this.projects = data
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    changeByClient() {
        this.createLeadForm.controls.searchClient.setValue('')
        this.createLeadForm.controls.searchProject.setValue('')
        let clientId = this.createLeadForm.value.clientId;
        this.projectsByClient = this.projects.filter(ele => ele.disable == false && ele.client_id == clientId);
        this.filteredProjectsByClient = this.projectsByClient
        this.onKeyClient('')
    }

    changeByproject() {
        this.createLeadForm.controls.searchClient.setValue('')
        this.createLeadForm.controls.searchProject.setValue('')
        this.onKeyProject('')
    }

    close() {
        this.dialogRef.close();
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
        this.createLeadForm.controls.searchClient.setValue('')
        this.createLeadForm.controls.searchProject.setValue('')
        this.onKeyProject('')
        this.onKeyClient('')
    }
    
    showMoreField(){
        this.isShowMoreField=!this.isShowMoreField;
        this.showArrowRight=!this.showArrowRight;
        this.showArrowDown=!this.showArrowDown;

    }

}

