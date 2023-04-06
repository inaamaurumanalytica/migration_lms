import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-remark-modal',
    templateUrl: './client-remark-modal.component.html',
    styleUrls: ['./client-remark-modal.component.scss']
})
export class ClientRemarkModalComponent implements OnInit {
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    authToken: any = localStorage.getItem("token")
    btnStatus: boolean = false
    createLeadForm: FormGroup;
    newClientRemark: any = ""
    clientRemarks: any[] = []
    newVendorRemark: any = ""
    vendorRemarks: any[] = []
    suggestions = [
        {
            "status": "Not Interested",
            "values": [
                "Low Budget",
                "Not Looking for property",
                "Looking into other area",
                "Looking for Under Construction",
                "Looking for Ready to Move",
                "Loan Eligibility Issue",
                "Already purchased",
                "Looking for well know builder",
                "Looking for other builder",
                "Did not enquired"
            ]
        },
        {
            "status": "Follow Up",
            "values": [
                "Details sent",
                "Will do booking",
                "Will callback myself",
                "Site visit planned",
                "Negotiating",
                "Discuss with family or friend",
                "Inventory Issue",
                "Plan dropped",
                "Interested in resale",
                "Legal Issue"
            ]
        },
        {
            "status": "Contacted",
            "values": [
                "Call after sometime",
            ]
        },
        {
            "status": "Site Visit",
            "values": [
                "Negotiation",
                "Will do booking",
                "Inventory issue",
                "Location Issue",
                "Project Issue",
                "Legal Issue",
                "Visit again",
                "Interested in resale",
                "Plan dropped"
            ]
        },
        {
            "status": "Closed/Won",
            "values": [
                "Details of purchased unit",
            ]
        },
        {
            "status": "Interested",
            "values": [
                "Interested but Call after sometime",
                "Will callback myself",
                "Plan dropped"
            ]
        },
    ]
    selectedStatus: any = ''
    showComponentLoader: boolean = false
    showSuggestion: boolean = false
    autoRemark: any[] = []
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientRemarkModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) {
        if (this.data.lead_status == "Contacted" || this.data.lead_status == "Interested" || this.data.lead_status == "Closed/Won" || this.data.lead_status == "Site Visit" || this.data.lead_status == "Follow Up" || this.data.lead_status == "Not Interested") {
            this.showSuggestion = true
            this.autoRemark = this.suggestions.filter(el => el.status == this.data.lead_status)[0].values
        }
    }

    ngOnInit() {
        this.showComponentLoader = true
        if (this.data.member_type == "Client") {
            let url = "get_lead_client_remarks/?lead_id=" + this.data.id + "&per_page=50&page=1"
            this.serverService.getLeadRemarks(url, this.authToken).subscribe(
                data => {
                    data.client_remarks.forEach(element => {
                        if (element.remark.includes('||')) {
                            let body = element.remark.split("||")
                            element["clientRemark"] = body[0]
                            element["remarkDesc"] = body[1]
                            this.clientRemarks.push(element)
                        } else {
                            element["clientRemark"] = element.remark
                            this.clientRemarks.push(element)
                        }
                    });
                    this.showComponentLoader = false
                },
                err => {
                    this.showComponentLoader = false
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
            )
        } else {
            let url = "get_lead_vendor_remarks/?lead_id=" + this.data.id + "&per_page=50&page=1"
            this.serverService.getLeadRemarks(url, this.authToken).subscribe(
                data => {
                    this.vendorRemarks = data.vendor_remarks;
                    this.showComponentLoader = false
                },
                err => {
                    this.showComponentLoader = false
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
            )
        }
    }

    yes() {
        if (this.userInfo.member_type == "Client") {
            if (this.newClientRemark.trim() != '') {
                this.data.client_remark = this.newClientRemark.trim()
                this.data.client_remark_new = this.data.client_remark.trim();
                if (this.showSuggestion) {
                    this.data.status_description = this.selectedStatus
                } else {
                    delete this.data.status_description
                }
                this.dialogRef.close(this.data);
            } else {
                this.clipBoardService.showMessgeInText("Please enter proper remark", "error-snackbar")
            }
        } else {
            if (this.newVendorRemark.trim() != '') {
                this.data.vendor_remark = this.newVendorRemark.trim()
                this.data.vendor_remark_new = this.newVendorRemark.trim();
                this.dialogRef.close(this.data);
            } else {
                this.clipBoardService.showMessgeInText("Please enter proper remark", "error-snackbar")
            }
        }
    }

    close() {
        this.dialogRef.close();
    }
}

