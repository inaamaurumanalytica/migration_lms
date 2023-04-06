import { MatSnackBar } from '@angular/material';
import { ServerService } from '../../services/server.service'
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClipBoardService } from '../../services/clipboard.service'
import { MatPaginator, MatSort, MatDialog, MatDialogRef, MatDialogConfig, MatMenuTrigger } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
	selector: 'app-whatsapp-rule-entry',
	templateUrl: './whatsapp-rule-entry.component.html',
	styleUrls: ['./whatsapp-rule-entry.component.scss']
})
export class WhatsappRuleEntryComponent implements OnInit {
	action = "exit";
	users: any[] = [];
	showDataTable: boolean = false;
	public authData: any = {};
	public currentUser: any = JSON.parse(localStorage.getItem("userInfo"));
	authToken: string = "";
	displayedColumns: string[] = [];
	showComponentLoader: boolean = false;
	whatsappRule: any = {}
	
	// @ViewChild('filter') filter: ElementRef;
	// @ViewChild(MatPaginator) paginator: MatPaginator;
	// @ViewChild(MatSort) sort: MatSort;
	// @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
	constructor(
		private router: Router,
		private dialog: MatDialog,
		private titleService: Title,
		public snackBar: MatSnackBar,
		public clipBoardService: ClipBoardService,
		private serverService: ServerService
	) {
		// if (localStorage.getItem("token") == undefined || localStorage.getItem("token") == "") {
		// 	this.router.navigate(['/']);
		// 	return;
		// }
		// if (this.currentUser.admin) {
		// 	this.router.navigate(['/auth/dashboard']);
		// 	return;
		// }
		if (this.clipBoardService.whatsappRuleAssignmnetInfo.id == undefined) {
			this.router.navigate(['page/whatsapp-rules']);
			return
		}
		this.showComponentLoader = true
		this.authToken = localStorage.getItem("token");
	}
	ngOnInit() {
		this.titleService.setTitle('AutomateLeads - Whatsapp - Rule - Entry');
		this.displayedColumns = ['name', 'active', 'action']
		this.parseJwt(this.authToken);
	}

	ruleEntryList() {
		this.showComponentLoader = true
		this.serverService.criteriaByWhatsappId(this.clipBoardService.whatsappRuleAssignmnetInfo.id, this.authToken).subscribe(
			data => {
				this.whatsappRule = data;
				this.whatsappRule["new_whats_app_rule_criterias"] = [];
				this.whatsappRule.criteria_order.forEach(element => {
					this.whatsappRule.new_whats_app_rule_criterias.push(this.whatsappRule.whats_app_rule_criterias.filter(rule => rule.id == element)[0]);
				});
				this.whatsappRule.whats_app_rule_criterias = this.whatsappRule.new_whats_app_rule_criterias;
				delete this.whatsappRule.new_whats_app_rule_criterias;
				this.showComponentLoader = false
			},
			err => {
				
				this.showComponentLoader = false
				this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
			}
		)
	}

	parseJwt(token) {
		if(token != null && token != ""){
			var base64Url = token.split('.')[1];
			var base64 = base64Url.replace('-', '+').replace('_', '/');
			this.authData = JSON.parse(window.atob(base64));
			if (this.authData.exp < Date.now() / 1000) {
				this.clipBoardService.backToLogin();
				this.showComponentLoader = false;
				this.router.navigate(["/"]);
			} else {
				this.ruleEntryList()
			}
		}
	}

	createRuleEntry() {
		this.router.navigate(["page/create-whatsapp-rule-entry"]);
	}

	edit(element) {
		this.clipBoardService.whatsappRuleEntryData = element;
		this.router.navigate(["page/edit-whatsapp-rule-entry"]);
	}
	back() {
		this.router.navigate(['page/whatsapp-rule-entry']);
	}
	delete(element) {
		let body = {

			'whats_app_rule_id':element.whats_app_rule_id,
		}
		this.serverService.deleteWhatsappCriteria(element.id,body,this.authToken).subscribe(
			data => {
				this.snackBar.open("Deleted Successfully", this.action, {
					duration: 2000,
					verticalPosition: 'top',
					horizontalPosition: 'end',
					panelClass: 'blue-snackbar'
				})
				this.ruleEntryList();
			},
			err => {
				this.showComponentLoader = false
				this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
			}
		)
	}

	changeActive(element) {
		element.active = !element.active
		let body = {
			"active": element.active,
			"whats_app_rule_id": this.whatsappRule.id	
		}
		this.serverService.updateWhatsappCriteria(element.id, body, this.authToken).subscribe(
			data => {
				let msg = "";
				if (element.active) {
					msg = "Whatsapp Rule Activated"
				} else {
					msg = "Whatsapp Rule Deactivated"
				}
				this.snackBar.open(msg, this.action, {
					duration: 2000,
					verticalPosition: 'top',
					horizontalPosition: 'end',
					panelClass: 'blue-snackbar'
				})
			},
			err => {
				this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
			}
		)
	}

	reorder() {
		this.showDataTable = true;
	}

	saveReorder() {

		let criteriaOrder = []
		this.whatsappRule.whats_app_rule_criterias.forEach(element => {
			criteriaOrder.push(element.id);
		});
		let body = {
			"criteria_order": criteriaOrder,
			"project_id" : this.clipBoardService.whatsappRuleAssignmnetInfo.project_id
		}
		this.serverService.updateActiveWhatsappRule(this.clipBoardService.whatsappRuleAssignmnetInfo.id, body, this.authToken).subscribe(
			data => {
				this.showDataTable = false;
				this.ruleEntryList();
			},
			err => {
			}
		)
	}

	cancelReorder() {
		this.showDataTable = false;
	}

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.whatsappRule.whats_app_rule_criterias, event.previousIndex, event.currentIndex);
		this.whatsappRule.whats_app_rule_criterias = this.whatsappRule.whats_app_rule_criterias
	}
}

