import { MatSnackBar } from '@angular/material';
import { ServerService } from '../../../services/server.service'
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClipBoardService } from '../../../services/clipboard.service';
import { Title } from '@angular/platform-browser';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
@Component({
	selector: 'app-edit-report',
	templateUrl: './edit-report.component.html',
	styleUrls: ['./edit-report.component.scss']
})
export class EditLeadReportComponent implements OnInit {
	action = "exit";
	users: any[] = [];
	showDataTable: boolean = false;
	public authData: any = {};
	public userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
	authToken: string = localStorage.getItem("token");
	btnStatus: boolean = false
	showComponentLoader: boolean = false;
	visible = true;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	emails: any[] = []
	email: string = ""
	sendTime: string = ""
	clients: any[] = []
	filteredClients: any[] = []
	projects: any[] = []
	filteredProjects: any[] = []


	reportSaved = JSON.parse(localStorage.getItem("report"))
	validEmail: boolean = true;
	report = {
		"id": '',
		"name": "",
		"subject_line": "",
		"export_format": "",
		"report_type": "", // string (RECURRING, ONETIME)
		"base_type": "", // string (CLIENT, PROJECT)
		"base_ids": [],  // array of integer (Ids of base type - projects or clients)
		"recurring_frequency": "",  // string (DAILY, WEEKLY, MONTHLY)
		"recurring_range_number": 0, // integer
		"recurring_range_type": "", // string (HOUR, DAY, WEEK, MONTH)
		"send_type": "", // string (INSTANT, SCHEDULED) Instant is only for onetime
		"send_time": "", // time 
		"onetime_start_datetime": "", // datetime - If report is onetime, ask from when the information is required
		"onetime_end_datetime": "", // datetime - If report is onetime, ask till when the information is required
		"to_emails": [],  // array of string
		"lead_status_filter": [], // array of string - Multiple select of statuses just like we set in lead filters
		"email_include": false, // boolean - default set to false
		"phone_include": false, // boolean - default set to false
		"status": "" // string (ACTIVE, STOPPED, COMPLETED) - only ACTIVE and STOPPED can be set
	}

	selectedBase: boolean = false
	baseSearchInput: any = ""
	leadStatuses: any = [
		{
			"name": "Fresh",
			"selected": false
		}, {
			"name": "Verified",
			"selected": false
		}, {
			"name": "Intrested",
			"selected": false
		},
		{
			"name": "V Not Interested",
			"selected": false
		},
		{
			"name": "V Not Responding",
			"selected": false
		},
		{
			"name": "V Not Available",
			"selected": false
		},
		{
			"name": "Not Interested",
			"selected": false
		},
		{
			"name": "Not Responding",
			"selected": false
		},
		{
			"name": "Not Available",
			"selected": false
		},
		{
			"name": "Follow Up",
			"selected": false
		},
		{
			"name": "Callback",
			"selected": false
		},
		{
			"name": "Wrong Number",
			"selected": false
		},
		{
			"name": "Closed/Won",
			"selected": false
		},
		{
			"name": "Site Visit",
			"selected": false
		}
	]
	selectedFilter: any[] = []

	reportType: string = "ONETIME"
	statusType: string = 'ACTIVE'
	sendType: string = 'INSTANT'
	reportFormatType: string = 'csv'
	oneTimeStartDate: any = ''
	oneTimeEndDate: any = ''
	rangeType: any = ''
	rangeNo: any = ''
	frequency: any = ''


	fillName: boolean = false
	fillSubject: boolean = false
	fillBaseIds: boolean = false
	fillStartDate: boolean = false
	fillEndDate: boolean = false
	fillSendTime: boolean = false
	fillFrequency: boolean = false
	fillRangeNo: boolean = false
	fillRangeType: boolean = false
	fillFilterStatus: boolean = false
	fillEmails: boolean = false
	constructor(
		private router: Router,
		private titleService: Title,
		public snackBar: MatSnackBar,
		public clipBoardService: ClipBoardService,
		private serverService: ServerService
	) {
		if (this.authToken == undefined || this.authToken == "") {
			this.router.navigate(['/']);
			return;
		}
		if (this.userInfo.admin) {
			this.router.navigate(['page/dashboard-vendor']);
			return;
		}
		if (this.reportSaved != null) {
			this.report.id = this.reportSaved.id
			this.report.name = this.reportSaved.name
			this.report.subject_line = this.reportSaved.subject_line
			this.reportFormatType = this.reportSaved.export_format || 'csv'
			if (this.reportSaved.base_type == 'PROJECT') {
				this.selectedBase = false
			} else {
				this.selectedBase = true
			}
			this.report.base_ids = this.reportSaved.base_ids
			this.report.email_include = this.reportSaved.email_include
			this.report.phone_include = this.reportSaved.phone_include
			this.reportType = this.reportSaved.report_type
			if (this.reportType == 'RECURRING') {
				this.frequency = this.reportSaved.recurring_frequency
				this.rangeType = this.reportSaved.recurring_range_type
				this.rangeNo = JSON.stringify(this.reportSaved.recurring_range_number)
				this.sendTime = this.reportSaved.send_time
				this.sendType = this.reportSaved.send_type
			} else {
				this.oneTimeStartDate = this.reportSaved.onetime_start_datetime
				this.oneTimeEndDate = this.reportSaved.onetime_end_datetime
				this.sendType = this.reportSaved.send_type
				if (this.sendType != 'INSTANT') {
					this.sendTime = this.reportSaved.send_time
				}
			}
			this.emails = this.reportSaved.to_emails
			for (let i = 0; i < this.reportSaved.lead_status_filter.length; i++) {
				for (let j = 0; j < this.leadStatuses.length; j++) {
					if (this.leadStatuses[j].name == this.reportSaved.lead_status_filter[i]) {
						this.leadStatuses[j].selected = true
					}
				}
			}
			this.selectedFilter = this.reportSaved.lead_status_filter
			this.statusType = this.reportSaved.status

		} else {
			this.cancel()
		}
	}
	ngOnInit() {
		this.titleService.setTitle('AutomateLeads - Lead Report - Edit');
		this.getClients()
		this.getProjects()
	}
	getClients() {
		this.serverService.clientsList(this.authToken).subscribe(
			data => {
				this.clients = data.client
				this.filteredClients = data.client
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
				this.filteredProjects = data
			},
			err => {
				this.clipBoardService.checkServerError(err, this.authToken)
			}
		)
	}

	onKeyProject(val) {
		let filter = val.toLowerCase();
		this.filteredProjects = this.projects.filter(option => option.name.toLowerCase().includes(filter));
	}

	onKeyClient(val) {
		let filter = val.toLowerCase();
		this.filteredClients = this.clients.filter(option => option.name.toLowerCase().includes(filter));
	}

	checkBase(val) {
		this.report.base_ids = []
		this.baseSearchInput = ''
		if (val == 'project') {
			this.selectedBase = false
		} else {
			this.selectedBase = true
		}
	}

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;
		if (value.trim() != "") {
			if (!this.validateEmail(value.trim())) {
				this.validEmail = false;
				this.clipBoardService.showMessgeInText("Email Not valid", "error-snackbar")
				return;
			}
		}
		this.validEmail = true;
		if ((value || '').trim()) {
			this.emails.push(value.trim());
		}
		if (input) {
			input.value = '';
		}
	}

	validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	remove(fruit: string): void {
		const index = this.emails.indexOf(fruit);
		if (index >= 0) {
			this.emails.splice(index, 1);
		}
	}

	checkStatus(val, event) {
		if (event.checked) {
			this.selectedFilter.push(val)
		} else {
			var index = this.selectedFilter.indexOf(val);
			if (index !== -1) {
				this.selectedFilter.splice(index, 1);
			}
		}
	}

	createReport() {
		if (this.report.name.trim() == '') {
			this.fillName = true
			setTimeout(() => { this.fillName = false }, 2000)
			document.getElementById("name").scrollIntoView();
			return
		}
		if (this.report.subject_line.trim() == '') {
			this.fillSubject = true
			setTimeout(() => { this.fillSubject = false }, 2000)
			document.getElementById("subject").scrollIntoView();
			return
		}
		if (this.report.base_ids.length == 0) {
			this.fillBaseIds = true
			setTimeout(() => { this.fillBaseIds = false }, 2000)
			document.getElementById("baseType").scrollIntoView();
			return
		}
		this.report.report_type = this.reportType
		this.report.export_format = this.reportFormatType
		if (this.reportType == 'ONETIME') {
			if (this.oneTimeStartDate == '') {
				this.fillStartDate = true
				setTimeout(() => { this.fillStartDate = false }, 2000)
				document.getElementById("startDate").scrollIntoView();
				return
			}
			if (this.oneTimeEndDate == '') {
				this.fillEndDate = true
				setTimeout(() => { this.fillEndDate = false }, 2000)
				document.getElementById("endDate").scrollIntoView();
				return
			}
			if (this.sendType == 'SCHEDULED') {
				if (this.sendTime == '') {
					this.fillSendTime = true
					setTimeout(() => { this.fillSendTime = false }, 2000)
					document.getElementById("sendTime").scrollIntoView();
					return
				}
				this.report.send_time = this.sendTime
			}
			this.report.onetime_start_datetime = this.convert(this.oneTimeStartDate)
			this.report.onetime_end_datetime = this.convert(this.oneTimeEndDate)
			this.report.send_type = this.sendType
		} else {
			if (this.frequency == '') {
				this.fillFrequency = true
				setTimeout(() => { this.fillFrequency = false }, 2000)
				document.getElementById("frequency").scrollIntoView();
				return
			}
			if (this.rangeNo == '') {
				this.fillRangeNo = true
				setTimeout(() => { this.fillRangeNo = false }, 2000)
				document.getElementById("rangeNo").scrollIntoView();
				return
			}
			if (this.rangeType == '') {
				this.fillRangeType = true
				setTimeout(() => { this.fillRangeType = false }, 2000)
				document.getElementById("rangeType").scrollIntoView();
				return
			}
			if (this.sendTime == '') {
				this.fillSendTime = true
				setTimeout(() => { this.fillSendTime = false }, 2000)
				document.getElementById("sendTime").scrollIntoView();
				return
			}
			this.report.recurring_frequency = this.frequency
			this.report.recurring_range_number = this.rangeNo
			this.report.recurring_range_type = this.rangeType
			this.report.send_time = this.sendTime
			this.report.send_type = 'SCHEDULED'

		}
		if (this.selectedFilter.length == 0) {
			this.fillFilterStatus = true
			setTimeout(() => { this.fillFilterStatus = false }, 2000)
			document.getElementById("leadStatus").scrollIntoView();
			return
		}
		if (this.emails.length == 0) {
			this.fillEmails = true
			setTimeout(() => { this.fillEmails = false }, 2000)
			return
		}
		this.report.to_emails = this.emails
		this.report.lead_status_filter = this.selectedFilter
		if (this.selectedBase) {
			this.report.base_type = 'CLIENT'
		} else {
			this.report.base_type = 'PROJECT'
		}
		this.report.status = this.statusType
		this.btnStatus = true
		this.serverService.updateReport(this.report.id, this.report, this.authToken).subscribe(
			data => {
				this.clipBoardService.showMessgeInText("Report Updated Successfully", "success-snackbar")
				this.btnStatus = false
				this.cancel()
			},
			err => {
				this.btnStatus = false
				this.clipBoardService.checkServerError(err, this.authToken)
			}
		)
	}

	convert(str) {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join("-");
	}

	changeReportType(val) {
		this.reportType = val
		this.report.onetime_start_datetime = ''
		this.report.onetime_end_datetime = ''
		this.report.recurring_frequency = ''
		this.report.recurring_range_number = 0
		this.report.recurring_range_type = ''
		this.report.send_time = ''
		this.frequency = ''
		this.rangeNo = ''
		this.rangeType = ''
		this.oneTimeStartDate = ''
		this.oneTimeEndDate = ''
		this.sendTime = ""
	}

	cancel() {
		this.router.navigate(['/page/lead-report'])
	}
}

