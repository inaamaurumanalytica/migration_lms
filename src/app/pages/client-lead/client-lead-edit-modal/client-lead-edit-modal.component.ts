import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-edit-modal',
    templateUrl: './client-lead-edit-modal.component.html',
    styleUrls: ['./client-lead-edit-modal.component.scss']
})
export class ClientLeadEditModalComponent implements OnInit {
    public authToken = localStorage.getItem("token");
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    types: any[] = []
    public min = new Date()
    btnStatus: boolean = false
    editLeadForm: FormGroup;
    showEmail: boolean = false
    showPhone: boolean = false
    vendorRequired: boolean = false
    isShowMoreField:boolean=false;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadEditModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
            //console.log(data)
        this.editLeadForm = this.fb.group({
            name: [this.data.name, Validators.required],
            phone: [this.data.phone, Validators.required],
            email: [this.data.email, [Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            score: [JSON.stringify(this.data.score)],
            leadStatus: [this.data.lead_status, Validators.required],
            source: [this.data.source],
            budget: [this.data.budget],
            vendorRemark: [this.data.vendor_remark],
            dateTime: [this.data.vendor_appointment_date],

            // clientRemark:[''],
            utmSource:[this.data.utm_source],
            utmMedium:[this.data.utm_medium],
            utmCampaign:[this.data.utm_campaign],
            utmTerm:[this.data.utm_term],
            utmContent:[this.data.utm_content],
            metaChecksum:[this.data.meta_checksum],
            fbCampaignId:[this.data.fb_campaign_id],
            fbCampaignName:[this.data.fb_campaign_name],
            fbAdsetId:[this.data.fb_adset_id],
            fbAdsetName:[this.data.fb_adset_name],
            fbAdId:[this.data.fb_ad_id],
            fbAdName:[this.data.fb_ad_name],
            googleCampaignId:[this.data.google_campaign_id],
            googleCampaignName:[this.data.google_campaign_name],
            googleAdgroupId:[this.data.google_adgroup_id],
            googleAdgroupName:[this.data.google_adgroup_name],
            googleKeywordId:[this.data.google_keyword_id],
            googleKeywordName:[this.data.google_keyword_name],
            googleAdId:[this.data.google_ad_id],
            googleAdName:[this.data.google_ad_name],
            // meta:[''],
        })

        this.userInfo.permissions.forEach(element => {
            if (element.name == "email") {
                this.showEmail = true
            }
            if (element.name == "phone") {
                this.showPhone = true
            }
        });

        this.changeLeadStatus()


        if (!this.showEmail) {
            this.editLeadForm.controls["email"].setValidators([]);
            this.editLeadForm.controls["email"].updateValueAndValidity()
        }

        if (!this.showPhone) {
            this.editLeadForm.controls["phone"].setValidators([]);
            this.editLeadForm.controls["phone"].updateValueAndValidity()
        }

    }

    ngOnInit() {

    }

    changeLeadStatus() {
        if (this.editLeadForm.value.leadStatus == 'Not Interested' || this.editLeadForm.value.leadStatus == 'Not Responding' ||
            this.editLeadForm.value.leadStatus == 'Not Available' || this.editLeadForm.value.leadStatus == 'V Not Interested' ||
            this.editLeadForm.value.leadStatus == 'V Not Responding' || this.editLeadForm.value.leadStatus == 'V Not Available') {

            this.vendorRequired = true
            this.editLeadForm.controls["vendorRemark"].setValidators([Validators.required]);
        } else {
            this.vendorRequired = false
            this.editLeadForm.controls["vendorRemark"].setValidators([]);
        }
        this.editLeadForm.controls["vendorRemark"].updateValueAndValidity()
    }

    save() {
        this.btnStatus = true
        let body = {
            "name": this.editLeadForm.value.name,
            "budget": this.editLeadForm.value.budget,
            "lead_status": this.editLeadForm.value.leadStatus,
            "source": this.editLeadForm.value.source,
            "score": this.editLeadForm.value.score,

            "client_remark": '',
            "utm_source": this.editLeadForm.value.utmSource,
            "utm_medium": this.editLeadForm.value.utmMedium,
            "utm_campaign": this.editLeadForm.value.utmCampaign,
            "utm_term": this.editLeadForm.value.utmTerm,
            "utm_content": this.editLeadForm.value.utmContent,
            "meta_checksum": this.editLeadForm.value.metaChecksum,
            "fb_campaign_id": this.editLeadForm.value.fbCampaignId,
            "fb_campaign_name": this.editLeadForm.value.fbCampaignName,
            "fb_adset_id": this.editLeadForm.value.fbAdsetId,
            "fb_adset_name": this.editLeadForm.value.fbAdsetName,
            "fb_ad_id": this.editLeadForm.value.fbAdId,
            "fb_ad_name": this.editLeadForm.value.fbAdName,
            "google_campaign_id": this.editLeadForm.value.googleCampaignId,
            "google_campaign_name": this.editLeadForm.value.googleCampaignName,
            "google_adgroup_id": this.editLeadForm.value.googleAdgroupId,
            "google_adgroup_name": this.editLeadForm.value.googleAdgroupName,
            "google_keyword_id": this.editLeadForm.value.googleKeywordId,
            "google_keyword_name": this.editLeadForm.value.googleKeywordName,
            "google_ad_id": this.editLeadForm.value.googleAdId,
            "google_ad_name": this.editLeadForm.value.googleAdName,
            "meta": {},
        }
        if (this.userInfo.member_type == "Vendor" && this.editLeadForm.value.leadStatus == 'Appointment Proposed') {
            body["vendor_appointment_date"] = this.editLeadForm.value.dateTime
        }
        if (this.showEmail) {
            body["email"] = this.editLeadForm.value.email;
        }
        if (this.showPhone) {
            body["phone"] = this.editLeadForm.value.phone;
        }
        // if (this.editLeadForm.value.vendorRemark.trim() != null && this.editLeadForm.value.vendorRemark.trim() != "") {
        //     body["vendor_remark"] = this.editLeadForm.value.vendorRemark.trim()
        // }
        // if (this.editLeadForm.value.vendorRemark.trim() == null || this.editLeadForm.value.vendorRemark.trim() == "") {
        //     body["vendor_remark"] = this.editLeadForm.value.vendorRemark
        // }
        body["vendor_remark"] = this.editLeadForm.value.vendorRemark == null?''.toString().trim():this.editLeadForm.value.vendorRemark.trim();
        // body["vendor_remark"] = this.editLeadForm.value.vendorRemark.trim() != null && this.editLeadForm.value.vendorRemark.trim() != ""?this.editLeadForm.value.vendorRemark.trim():this.editLeadForm.value.vendorRemark
        this.serverService.updateLead(this.data, body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText("Lead Updated Successfully", "success-snackbar")
                this.dialogRef.close(data)
            },
            err => {
                this.btnStatus = true
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    showMoreField(){
        this.isShowMoreField=!this.isShowMoreField;
    }

}

