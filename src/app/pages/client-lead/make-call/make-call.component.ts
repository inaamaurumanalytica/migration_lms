import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';
import { LeadVndorUpdatedModalComponent } from '../../client-master-lead/lead-vendor-updated-modal/lead-vendor-updated-modal.component';
import { LeadUpdatedToVerifiedStatusModalComponent } from '../../client-master-lead/lead-updated-to-verified-status-modal/lead-updated-to-verified-status-modal.component';

@Component({
    selector: 'make-call',
    templateUrl: './make-call.component.html',
    styleUrls: ['./make-call.component.scss']
})
export class MakeCallComponent implements OnInit {
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
    authToken: any = localStorage.getItem("token");
    lead: any = {}
    startCallBtn: any = false
    makeCallAction: FormGroup;
    action = "";
    callMessage: string = ''
    showSuggestion: boolean = false
    autoRemark: any[] = []
    selectedStatus: any
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
    showRemark: boolean = false
    leadVndorUpdatedModalComponent: MatDialogRef<LeadVndorUpdatedModalComponent>
    leadUpdatedToVerifiedStatusModalComponent: MatDialogRef<LeadUpdatedToVerifiedStatusModalComponent>
    constructor(
        public clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private serverService: ServerService,
        private router: Router,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<MakeCallComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.lead = data
        if (this.lead.lead_status != "Verified" && this.lead.lead_status != "V Not Interested") {
            this.showRemark = true
        }
    }

    ngOnInit() {
        if (this.lead.vendor_appointment_date != null) {
            this.makeCallAction = this.fb.group({
                remark: [''],
            });
        } else {
            this.makeCallAction = this.fb.group({
                selectedStatus: ['', Validators.required],
                status: [this.lead.lead_status_new],
                remark: [''],
            });
        }
    }

    close() {
        this.dialogRef.close();
    }

    makeCall(lead) {
        this.callMessage = "Calling..."
        this.startCallBtn = true
        let body = {
            "client_id": lead.client_id,
            "project_id": lead.project_id,
            "lead_id": lead.id
        }
        this.serverService.makeCall(body, this.authToken).subscribe(
            data => {
                setTimeout(() => {
                    this.callMessage = "Call In Progress"
                }, 5000)
                setTimeout(() => {
                    this.startCallBtn = false
                    this.callMessage = ""
                }, 10000)
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        );
    }

    routeToUser() {
        this.dialogRef.close();
        this.router.navigate(['/page/user']);
    }

    checkData() {
        if (this.lead.vendor_appointment_date == null) {
            if (this.showRemark) {
                if (this.makeCallAction.value.remark.trim() == '' && this.makeCallAction.value.status == this.lead.lead_status) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        } else {
            if (this.makeCallAction.value.remark.trim() == '') {
                return true
            } else {
                return false
            }
        }
    }

    submit() {
        if (this.makeCallAction.value.status == "Verified") {
            this.lead.lead_status = "Verified"
            this.leadUpdatedToVerifiedStatusModalComponent = this.dialog.open(LeadUpdatedToVerifiedStatusModalComponent, {
                hasBackdrop: true,
                disableClose: false,
                autoFocus: true,
                width: '50vw',
                panelClass: 'cdk-overlay-panel-right-side',
                data: this.lead
            });
            this.leadUpdatedToVerifiedStatusModalComponent.afterClosed().subscribe(result => {
                if (result != undefined) {
                    this.leadUpdate(result);
                }
            });
        } else if (this.makeCallAction.value.status == "V Not Interested") {
            this.lead.lead_status = "V Not Interested"
            this.leadVndorUpdatedModalComponent = this.dialog.open(LeadVndorUpdatedModalComponent, {
                hasBackdrop: true,
                disableClose: false,
                autoFocus: true,
                width: '50vw',
                panelClass: 'cdk-overlay-panel-right-side',
                data: this.lead
            });
            this.leadVndorUpdatedModalComponent.afterClosed().subscribe(result => {
                if (result != undefined) {
                    this.leadUpdate(result);
                }
            })
        } else {
            this.leadUpdate('')
        }
    }

    leadUpdate(result) {
        let body = {}
        if (this.lead.vendor_appointment_date != null) {
            if (this.makeCallAction.value.remark.trim() != '') {
                body["vendor_remark"] = this.makeCallAction.value.remark
            }
        } else {
            if (this.showRemark) {
                if (this.makeCallAction.value.status != this.lead.lead_status) {
                    body["lead_status"] = this.makeCallAction.value.status
                }
                if (this.makeCallAction.value.remark.trim() != '') {
                    body["vendor_remark"] = this.makeCallAction.value.remark
                }
            } else {
                body["lead_status"] = this.makeCallAction.value.status
                body["vendor_remark"] = result
            }
        }
        this.serverService.updateLead(this.lead, body, this.authToken).subscribe(
            data => {
                if (this.showRemark) {
                    this.lead["vendor_remark"] = this.makeCallAction.value.remark
                    this.lead["vendor_remark_new"] = this.makeCallAction.value.remark
                } else {
                    this.lead["vendor_remark"] = result
                    this.lead["vendor_remark_new"] = result
                }
                if (this.lead.vendor_appointment_date == null) {
                    this.lead["lead_status"] = this.makeCallAction.value.status
                    this.lead["lead_status_new"] = this.makeCallAction.value.status
                }
                this.clipBoardService.showMessgeInText("Lead Updated Succesfully", "success-snackbar")
                this.dialogRef.close(this.lead)
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    statusChange() {
        if (this.makeCallAction.value.status == "Verified" || this.makeCallAction.value.status == "V Not Interested") {
            this.showRemark = false
        } else {
            this.showRemark = true
        }
        this.makeCallAction.controls.remark.setValue('')
    }
}

