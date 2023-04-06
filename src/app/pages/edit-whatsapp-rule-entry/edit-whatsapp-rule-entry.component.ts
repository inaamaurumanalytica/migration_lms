import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { ServerService } from '../../services/server.service'
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClipBoardService } from '../../services/clipboard.service';
import { MatPaginator, MatSort, MatDialog, MatDialogRef, MatDialogConfig, MatMenuTrigger } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
	selector: 'app-edit-whatsapp-rule-entry',
	templateUrl: './edit-whatsapp-rule-entry.component.html',
	styleUrls: ['./edit-whatsapp-rule-entry.component.scss']
})
export class EditWhatsappRuleEntryComponent implements OnInit {
	visible = true;
	selectable = true;
	removable = true;
	textAreaPattern : string = "";
	addOnBlur = true;
	returnData: boolean = false;
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	editPattern: boolean = false;
	pattern: string = "";
	ruleData: any = {};
	assignSingleUser: string = "";
	private fieldArray: Array<any> = [];
	entries: any[] = []
	operatorsByFeild: any[] = [];
	users: any[] = [];
	action = "exit";
	selectedUser: any[] = [];
	showRoundRobin: boolean = false
	removeSelectedUser: any[] = []
	public authData: any = {};
	public currentUser: any = JSON.parse(localStorage.getItem("user"));
	authToken: string = "";
	displayedColumns: string[] = [];
	showComponentLoader: boolean = false;
	dataSource: any[] = [];
	leftUser: any[] = []
	addUsers: any = [];
	constructor(
		private router: Router,
		private dialog: MatDialog,
		private changeDetectorRef: ChangeDetectorRef,
		private titleService: Title,
		public snackBar: MatSnackBar,
		private clipBoardService: ClipBoardService,
		private serverService: ServerService
	) {
	
		this.showComponentLoader = true
		this.authToken = localStorage.getItem("token");
	}
	ngOnInit() {
		this.titleService.setTitle('AutomateLeads - Edit - Whatsapp - Rule -Entry');
		this.parseJwt(this.authToken);
		this.ruleData = this.clipBoardService.whatsappRuleEntryData
	}

	getRuleEntry() {
		this.showComponentLoader = true
		this.serverService.fetchEntryList(this.authToken).subscribe(
			data => {
				this.entries = data;
				this.ruleData.rules.forEach((element) => {
					let body = {
						//"rule_name": element.field,
						"rule_operator": element.operator,
						"rule_value": element.values
					}
					if(element.values != undefined){
						body["rule_value"] = element.values 
					}
					if(element.value != undefined){
						body["rule_value"] = element.value 
					}
					if(element.operator == "between"){
						let betweenArray = element.value.split(',');
						body["between_one"] = betweenArray[0].trim()
						body["between_two"] = betweenArray[1].trim()
					}
					this.entries.forEach(el => {
						if (el.name_value == element.field) {
							body["operatorsByFeild"] = el.field_value;
							body["rule_name"] = el;
						}
					});
					this.fieldArray.push(body);

				});
				this.pattern = this.ruleData.pattern;
				if (this.pattern != "") {
					let splitedData = this.pattern.split(" ").filter(element =>{
						if (element == "or" || element == "and") {
							return element;
						}
					});
					splitedData.forEach((element, index) => {
						if (element == "or" || element == "and") {
							if (element == "or") {
								this.fieldArray[index+1]["andOr"] = false
							} else {
								this.fieldArray[index+1]["andOr"] = true
							}
						}
					})
				}
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
				//document.getElementsByClassName("spinner")[0].classList.add("hidden");
				this.showComponentLoader = false;
				this.router.navigate(["/"]);
			} else {
				this.getRuleEntry();
			}
		}
	}

	addnewrow() {
		if (this.fieldArray.length == 10) {
			this.snackBar.open("Cannot add Criteria more than 10", this.action, {
				duration: 3000,
				verticalPosition: 'top',
				horizontalPosition: 'end',
				panelClass: 'blue-snackbar'
			})
			return
		}
		this.fieldArray.push({ "rule_name": "", "rule_operator": "", "between_one": "", "between_two": "", "rule_operator_contains": false, "rule_operator_isnt": false, "rule_value": [], "andOr": false });
		this.pattern = "";
		if (this.fieldArray.length > 1) {

			this.fieldArray.forEach((element, index) => {
				this.pattern += "( "
			})
			this.fieldArray.forEach((element, index) => {
				if (index != 0) {
					if (index == 1) {
						if (element.andOr) {
							this.pattern += index + " ) and " + (index + 1) + " )"
						} else {
							this.pattern += index + " ) or " + (index + 1) + " )"
						}
					} else {
						if (element.andOr) {
							this.pattern += " and " + (index + 1) + " )"
						} else {
							this.pattern += " or " + (index + 1) + " )"
						}
					}
				}
			})
		}
	}

	deleteFieldValue(index) {
		this.fieldArray.splice(index, 1);
		this.changeAndOr("", "")
	}

	editPatternClick() {
		this.editPattern = !this.editPattern;
		this.textAreaPattern = this.pattern;
	}

	addToList(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);
		}
	}

	selectField(value, index) {
		if (value.rule_name == "") {
			this.fieldArray[index].rule_value = [];
			this.fieldArray[index].rule_operator = "";
		} else {
			this.fieldArray[index]["operatorsByFeild"] = value.rule_name.field_value;
			//this.entries.forEach(element => {
				// if (element.name_value == value.rule_name.field_value) {
				// }
			//});
		}
		this.changeDetectorRef.detectChanges();
	}
	selectOperator(value, index) {
		// if (value.rule_operator == "" || value.rule_operator == "is empty" || value.rule_operator == "is not empty") {
		// 	this.fieldArray[index].rule_value = [];
		// }
		this.fieldArray[index].rule_operator_contains = false;
		this.fieldArray[index].rule_operator_isnt = false;
		if(value.rule_operator == "doesn't contains"){
			this.fieldArray[index].rule_operator_contains = true;
		}
		if(value.rule_operator == "isn't"){
			this.fieldArray[index].rule_operator_isnt = true;
		}
		this.fieldArray[index].rule_value = [];
		this.changeDetectorRef.detectChanges();
	}

	saveRuleEntry() {
		let body = {
			"whats_app_rule_id": this.clipBoardService.whatsappRuleAssignmnetInfo.id,
			"pattern": this.pattern,
			"rules": [],
		}
		this.returnData = false;
		this.fieldArray.forEach(element => {
			if (element.rule_name != "") {
				let singleRuleValue = []
				if(element.rule_operator == "between"){
					let between = element.between_one +", "+ element.between_two
					if(element.between_one >= element.between_two){
						this.returnData = true;
						this.snackBar.open("Lead Score is not in proper Range", this.action, {
							duration: 3000,
							verticalPosition: 'top',
							horizontalPosition: 'end',
							panelClass: 'blue-snackbar'
						})
						return
					}
					singleRuleValue.push(between)	
				}else{
					singleRuleValue.push(element.rule_value)
				}
				//singleRuleValue.push(element.rule_value)
				let ruleData = {
					"field": element.rule_name.name_value,
					"operator": element.rule_operator,
					"data_type": element.rule_name.data_type
				}
				if (singleRuleValue[0] instanceof Array) {
					ruleData["values"] = singleRuleValue[0];
				} else {
					ruleData["value"] = singleRuleValue[0];
				}
				body.rules.push(ruleData)
			}
		})
		if(this.returnData){
			return
		}
		if(this.fieldArray.length == 1){
			body.pattern = "1";
		}
		this.serverService.updateWhatsappCriteria(this.ruleData.id, body, this.authToken).subscribe(
			data => {
				this.snackBar.open("Updated Successfully", this.action, {
					duration: 2000,
					verticalPosition: 'top',
					horizontalPosition: 'end',
					panelClass: 'blue-snackbar'
				})
				this.router.navigate(['page/whatsapp-rule-entry']);
			},
			err => {
				
				this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
			}
		)
	}

	changeAndOr(event1, index1) {
		this.pattern = "";
		if (this.fieldArray.length > 1) {

			this.fieldArray.forEach((element, index) => {
				this.pattern += "( "
			})
			this.fieldArray.forEach((element, index) => {
				if (index != 0) {
					if (index == 1) {
						if (element.andOr) {
							this.pattern += index + " ) and " + (index + 1) + " )"
						} else {
							this.pattern += index + " ) or " + (index + 1) + " )"
						}
					} else {
						if (element.andOr) {
							this.pattern += " and " + (index + 1) + " )"
						} else {
							this.pattern += " or " + (index + 1) + " )"
						}
					}
				}
			})
		}
	}

	cancelRuleEntry() {
		this.router.navigate(['page/whatsapp-rule-entry']);
	}

	drop(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex);
		}
	}

	drop1(event: CdkDragDrop<string[]>) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex);
		}
	}

	add(event: MatChipInputEvent, index): void {
		const input = event.input;
		const value = event.value;
		// Add our fruit
		if ((value || '').trim()) {
			this.fieldArray[index].rule_value.push(value);
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}
	}

	remove(value, i): void {
		const index = this.fieldArray[i].rule_value.indexOf(value);

		if (index >= 0) {
			this.fieldArray[i].rule_value.splice(index, 1);
		}
	}

	savePatternClick() {
		try {
			eval(this.textAreaPattern.split("and").join("&").split("or").join("|"))
		} catch (e) {
			if (e instanceof SyntaxError) {
				alert(e.message);
			}
			return
		}
		if(!this.check_all_numbers_exit_in_sequence(this.textAreaPattern, this.fieldArray.length)){
			alert("Pattern is not valid")
			return
		}
		this.pattern = this.textAreaPattern;
		this.editPattern = !this.editPattern;
	}

	cancelPatternClick(){
		this.textAreaPattern = this.pattern;
		this.editPattern = !this.editPattern;
	}

	check_all_numbers_exit_in_sequence(pattern_string, max_number: number){
		var numberPattern = /\d+/g;
		var all_values = Array.from(Array(max_number)).map((e,i)=>i+1);
		var values_in_expr = pattern_string.match(numberPattern);
		values_in_expr = values_in_expr.map((e,i)=> parseInt(e));
		return all_values.length === values_in_expr.length && all_values.every((value, index) => value === values_in_expr[index]);   
	}
}

