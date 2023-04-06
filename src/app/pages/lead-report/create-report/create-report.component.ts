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
	selector: 'app-create-report',
	templateUrl: './create-report.component.html',
	styleUrls: ['./create-report.component.scss']
})
export class CreateLeadReportComponent implements OnInit {
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

	validEmail: boolean = true;
	report = {
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


	// leadStatuses: any = ["Fresh", "Verified", "Interested", "V Not Interested", "V Not Responding", "V Not Available",
	// 	"Not Interested", "Not Responding", "Not Available", "Contacted", "Follow Up", "Callback", "Wrong Number", "Closed/Won", "Site Visit"]

	leadStatuses: any = [
			{ value: "Fresh", checked: false },
			{ value: "Verified", checked: false },
			{ value: "Appointment Proposed", checked: false },
			{ value: "Interested", checked: false },
			{ value: "V Not Interested", checked: false },
			{ value: "V Not Responding", checked: false },
			{ value: "V Not Available", checked: false },
			{ value: "Not Interested", checked: false },
			{ value: "Not Responding", checked: false },
			{ value: "Not Available", checked: false },
			{ value: "Contacted", checked: false },
			{ value: "Follow Up", checked: false },
			{ value: "Callback", checked: false },
			{ value: "Wrong Number", checked: false },
			{ value: "Closed/Won", checked: false },
			{ value: "Site Visit", checked: false }
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

	isChecked:boolean=false;

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
	}
	ngOnInit() {
		this.titleService.setTitle('AutomateLeads - Lead Report - Create');
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

	onFocusOutEvent(event) {
		this.baseSearchInput = ''
		this.onKeyProject('')
		this.onKeyClient('')
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

	updateAllStatus(event){
		if (event.checked) {
			this.leadStatuses.forEach(element => {
				element.checked = true
			});
			this.selectedFilter = this.leadStatuses.map(el => {
				if (el.checked) {
					return el.value
				}
			})
		} else {
			this.selectedFilter = []
			this.leadStatuses.forEach(element => {
			element.checked = false
		});
		}
	}

	uncheckAll() {
		this.selectedFilter = []
		this.leadStatuses.forEach(element => {
			element.checked = false
		});
	}

	checkAll() {
		this.leadStatuses.forEach(element => {
			element.checked = true
		});
		this.selectedFilter = this.leadStatuses.map(el => {
			if (el.checked) {
				return el.value
			}
		})
	}

	checkStatus(val, event) {
		this.leadStatuses.forEach(element => {
			if (element.value == val.value) {
				element.checked = event.checked
			}
		});
		this.selectedFilter = this.leadStatuses.map(el => {
			if (el.checked) {
				return el.value
			}
		})
		this.selectedFilter = this.selectedFilter.filter(element => element !== undefined);
	}

	// checkStatus(val, event) {

	// 	if (event.checked) {
	// 		this.selectedFilter.push(val)
	// 	} else {
	// 		var index = this.selectedFilter.indexOf(val);
	// 		if (index !== -1) {
	// 			this.selectedFilter.splice(index, 1);
	// 		}
	// 	}
	// }

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

		this.serverService.createReport(this.report, this.authToken).subscribe(
			data => {
				this.clipBoardService.showMessgeInText("Report Created Successfully", "success-snackbar")
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

