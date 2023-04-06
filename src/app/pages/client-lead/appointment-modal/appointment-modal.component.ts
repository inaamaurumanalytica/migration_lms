import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service';
@Component({
    selector: 'appointment-modal',
    templateUrl: './appointment-modal.component.html',
    styleUrls: ['./appointment-modal.component.scss']
})
export class AppointmentModalComponent implements OnInit {
    dataSource: any;
    action = 'exit'
    public dateTime: Date = new Date();
    public min = new Date()
    newRemarkShow: boolean = false;
    clientRemarks: any[] = []
    remarkMandetory: boolean = false;
    newVendorRemark: any = ""
    vendorRemarks: any[] = []
    vendorRemark: any = "";
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
    authToken: string = localStorage.getItem("token");
    constructor(private dialog: MatDialog, public clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<AppointmentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit() {
        this.dataSource = this.data;
        if (this.data.vendor_appointment_date != null) {
            if (this.data.lead_status != "Appointment Proposed") {
                this.newRemarkShow = true;
            }
            this.dateTime = this.data.vendor_appointment_date;
        }
    }

    yes() {
        if (this.data.vendor_appointment_date == null) {
            if (this.remarkMandetory) {
                this.data.vendor_appointment_date = this.dateTime.toJSON()
                if (this.newVendorRemark.trim() != '') {
                    this.data.vendor_remark = this.newVendorRemark.trim()
                    this.data.vendor_remark_new = this.newVendorRemark.trim();
                    if (this.data.lead_status != "Appointment Proposed") {
                        this.data.lead_status = "V Hold";
                    }
                    this.dialogRef.close(this.data);
                } else {
                    this.clipBoardService.showMessgeInText("Please enter proper Remark", "error-snackbar")
                }
            } else {
                if (this.data.lead_status == "Appointment Proposed") {
                    this.data.vendor_appointment_date = this.dateTime.toJSON()
                }
                if (this.newVendorRemark.trim() != '') {
                    this.data.vendor_remark = this.newVendorRemark.trim()
                    this.data.vendor_remark_new = this.newVendorRemark.trim();
                    this.dialogRef.close(this.data);
                } else {
                    delete this.data.vendor_remark
                    this.dialogRef.close(this.data);
                }
            }
        } else {
            if (this.data.vendor_appointment_date == this.dateTime) {
                this.data.vendor_appointment_date = this.dateTime
            } else {
                this.data.vendor_appointment_date = this.dateTime.toJSON()
            }
            delete this.data.vendor_remark
            this.dialogRef.close(this.data);
        }
    }

    close() {
        this.dialogRef.close();
    }

    checkAppointment() {
        if (this.data.vendor_appointment_date == null) {
            if (this.dateTime.getTime() > new Date().getTime() + (2 * 60 * 60 * 1000)) {
                this.remarkMandetory = true
            } else {
                this.remarkMandetory = false
            }
        }
    }
}

