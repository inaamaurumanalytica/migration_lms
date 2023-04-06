import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { IMyDateRangeModel } from 'mydaterangepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ClientLeadFilterModalComponent } from '../client-lead-filter-modal/client-lead-filter-modal.component';

@Component({
    selector: 'create-meeting-modal',
    templateUrl: './create-meeting-modal.component.html',
    styleUrls: ['./create-meeting-modal.component.scss']
})
export class CreateMeetingModalComponent implements OnInit {

    public authToken = localStorage.getItem("token");
    public projectInfo = JSON.parse(localStorage.getItem('projectInfo'));
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
    visible = true;
    selectable = true;
    removable = true;
    btnStatus: boolean = false
    separatorKeysCodes: number[] = [ENTER, COMMA];
    meetingForm: FormGroup
    emails: string[] = [];
    agendas: string[] = ['Networking', 'General Meeting', 'Sustenance Project Meeting', 'Soft Launch Meeting', 'Upcoming Offers Meeting']
    lead: any = {}
    showEmailInput: boolean = true;
    showCityInput: boolean = true;
    date: string = '';
    selectedCities: any[];
    constructor(private fb: FormBuilder,
        private serverSevice: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<ClientLeadFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) data) {
        this.lead = data
        this.meetingForm = this.fb.group({
            meetingType: ['1', Validators.required],
            topic: ['', Validators.required],
            agenda: ['', Validators.required],
            emailCtrl: [''],
            date: [''],
            description: [''],
            selectedCity: [],

        })
    }

    ngOnInit() {
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.emails.push(value.trim());
        }

        if (input) {
            input.value = '';
        }

        this.meetingForm.patchValue({
            emailCtrl: null
        });
    }

    onFocusOutEvent(event) {
        const value = event.target.value;

        if ((value || '').trim()) {
            this.emails.push(value.trim());
        }

        // if (input) {
        //   input.value = '';
        // }

        this.meetingForm.patchValue({
            emailCtrl: null
        });
    }

    remove(email: string): void {
        const index = this.emails.indexOf(email);

        if (index >= 0) {
            this.emails.splice(index, 1);
        }
    }

    // Create Meeting
    createMeeting() {
        if (this.meetingForm.value.meetingType === '2') {
            this.date = this.meetingForm.value.date.toJSON();
        }
        let body = {
            "topic": this.meetingForm.value.topic,
            "agenda": this.meetingForm.value.agenda,
            "meeting_type": +this.meetingForm.value.meetingType,
            "start_time": this.date,
            "guest_emails": this.emails,
            "city": this.meetingForm.value.selectedCity,

        }
        //console.log(body)
    }

    close() {
        this.dialogRef.close()
    }
}

