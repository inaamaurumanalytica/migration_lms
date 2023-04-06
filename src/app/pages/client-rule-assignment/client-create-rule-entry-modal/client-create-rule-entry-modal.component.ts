import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from "@angular/material";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
    selector: 'client-create-rule-entry-modal',
    templateUrl: './client-create-rule-entry-modal.component.html',
    styleUrls: ['./client-create-rule-entry-modal.component.scss']
})
export class ClientCreateRuleEntryModalComponent implements OnInit {
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    action = "";
    createRuleForm: FormGroup
    btnStatus: boolean = false
    projects: any[] = []
    authToken = localStorage.getItem("token")
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    returnData: boolean = false;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    editPattern: boolean = false;
    showSaveButton: boolean = false;
    pattern: string = "";
    assignSingleUser: string = "";
    fieldArray: Array<any> = [];
    entries: any[] = []
    operatorsByFeild: any[] = [];
    textAreaPattern: string = "";
    users: any[] = [];
    selectedUser: any[] = [];
    showRoundRobin: boolean = false
    removeSelectedUser: any[] = []
    public authData: any = {};
    displayedColumns: string[] = [];
    showComponentLoader: boolean = false;
    leadSatusData: any[] = [];
    dataSource: any[] = [];
    leftUser: any[] = []
    addUsers: any = [];
    rule = {}

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private changeDetectorRef: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientCreateRuleEntryModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
        this.rule = data


        if (this.userInfo != null && this.userInfo.member_type == "Vendor") {
            this.leadSatusData = ["Fresh", "Verified", "Interested", "V Not Interested", "V Not Responding", "V Not Available", "Not Interested", "Not Responding", "Not Available", "Contacted", "Follow Up", "Callback", "Wrong Number", "Closed/Won", "Site Visit"]
        } else {
            this.leadSatusData = ["Verified", "Interested", "Not Interested", "Not Responding", "Not Available", "Contacted", "Follow Up", "Closed/Won", "Site Visit"]
        }

        this.fieldArray.push({ "rule_name": "", "rule_operator": "", "between_one": "", "between_two": "", "rule_operator_contains": false, "rule_operator_isnt": false, "rule_value": [], "andOr": false });
    }

    ngOnInit() {
        this.usersByProject()
    }

    getRuleEntry() {
        this.showComponentLoader = true
        this.serverService.fetchEntryList(this.authToken).subscribe(
            data => {
                this.entries = data;
                this.showComponentLoader = false
            },
            err => {
                this.showComponentLoader = false

                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    usersByProject() {
        this.showComponentLoader = true
        this.serverService.getUsersByProject(this.rule["project_id"], this.authToken).subscribe(
            data => {
                this.users = data.users;
                this.leftUser = Object.assign([], this.users);
                this.getRuleEntry()
            },
            err => {
                this.showComponentLoader = false

                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    radioChange() {
        this.showRoundRobin = !this.showRoundRobin;
        this.addUsers = []
        this.selectedUser = [];
        this.removeSelectedUser = []
        this.leftUser = Object.assign([], this.users);
    }

    addnewrow() {
        if (this.fieldArray.length == 10) {
            this.clipBoardService.showMessgeInText("Cannot add Criteria more than 10", "error-snackbar")
            return
        }
        this.fieldArray.push({ "rule_name": "", "rule_operator": "", "between_one": "", "between_two": "", "rule_operator_contains": "", "rule_operator_isnt": false, "rule_value": [], "andOr": false });
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
        this.textAreaPattern = this.pattern;
    }

    deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
        this.changeAndOr("", "");
    }

    editPatternClick() {
        this.editPattern = !this.editPattern;
        this.textAreaPattern = this.pattern;
    }

    selectField(value, index) {
        if (value.rule_name == "") {
            this.fieldArray[index].rule_value = [];
            this.fieldArray[index].rule_operator = "";
        } else {
            this.fieldArray[index]["operatorsByFeild"] = value.rule_name.field_value;
        }
        this.changeDetectorRef.detectChanges();
    }
    selectOperator(value, index) {
        this.fieldArray[index].rule_operator_contains = false;
        this.fieldArray[index].rule_operator_isnt = false;
        if (value.rule_operator == "doesn't contains") {
            this.fieldArray[index].rule_operator_contains = true;
        }
        if (value.rule_operator == "isn't") {
            this.fieldArray[index].rule_operator_isnt = true;
        }
        this.fieldArray[index].rule_value = [];
        this.changeDetectorRef.detectChanges();
    }

    save() {
        this.showComponentLoader = true;
        if (this.addUsers.length == 0 && this.assignSingleUser == "") {
            this.showComponentLoader = false;
            this.clipBoardService.showMessgeInText("Assign User is Mandatory. Please fill", "error-snackbar")
            return
        }

        let body = {
            "project_id": this.rule["project_id"],
            "assignment_rule_id": this.rule["id"],
            "pattern": this.pattern,
            "rules": [],
            "assign": {},
        }
        this.returnData = false;
        this.fieldArray.forEach(element => {
            if (element.rule_name != "") {
                let singleRuleValue = []
                if (element.rule_operator == "between") {
                    let between = element.between_one + ", " + element.between_two
                    if (element.between_one >= element.between_two) {
                        this.returnData = true;
                        this.showComponentLoader = false;
                        this.clipBoardService.showMessgeInText("Lead Score is not in proper Range", "error-snackbar")
                        return
                    }
                    singleRuleValue.push(between)
                } else {
                    singleRuleValue.push(element.rule_value)
                }
                let ruleData = {
                    "data_type": element.rule_name.data_type,
                    "field": element.rule_name.name_value,
                    "operator": element.rule_operator,

                }
                if (singleRuleValue[0] instanceof Array) {
                    ruleData["values"] = singleRuleValue[0];
                } else {
                    ruleData["value"] = singleRuleValue[0];
                }
                body.rules.push(ruleData)
            }
        })
        if (this.returnData) {
            this.showSaveButton = false;
            return
        }
        if (body.rules.length == 0) {
            this.showComponentLoader = false;
            this.clipBoardService.showMessgeInText("Criteria is Mandatory", "success-snackbar")
            return
        }
        this.showSaveButton = true;
        body.assign["users"] = [];
        if (this.showRoundRobin) {
            body.assign["random"] = true;
            this.addUsers.forEach(element => {
                body.assign["users"].push(element.id);
            });
        } else {
            body.assign["random"] = false;
            body.assign["users"].push(this.assignSingleUser);
        }
        if (this.fieldArray.length == 1) {
            this.pattern = "1"
        }
        this.serverService.createCriteria(body, this.authToken).subscribe(
            data => {
                this.showComponentLoader = false;
                this.showSaveButton = false;
                this.dialogRef.close(data)
            },
            err => {
                this.showComponentLoader = false;
                this.showSaveButton = false;

                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    changeAndOr(event1, index1) {
        this.pattern = "";
        if (this.fieldArray.length > 1) {

            this.fieldArray.forEach((element, index) => {
                if (index == index1) {
                    element.andOr = event1
                }
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
        this.textAreaPattern = this.pattern;
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
        if (!this.check_all_numbers_exit_in_sequence(this.textAreaPattern, this.fieldArray.length)) {
            alert("Pattern is not valid")
            return
        }
        this.pattern = this.textAreaPattern;
        this.editPattern = !this.editPattern;
    }

    cancelPatternClick() {
        this.textAreaPattern = this.pattern;
        this.editPattern = !this.editPattern;
    }

    check_all_numbers_exit_in_sequence(pattern_string, max_number: number) {
        var numberPattern = /\d+/g;
        var all_values = Array.from(Array(max_number)).map((e, i) => i + 1);
        var values_in_expr = pattern_string.match(numberPattern);
        values_in_expr = values_in_expr.map((e, i) => parseInt(e));
        return all_values.length === values_in_expr.length && all_values.every((value, index) => value === values_in_expr[index]);
    }
}

