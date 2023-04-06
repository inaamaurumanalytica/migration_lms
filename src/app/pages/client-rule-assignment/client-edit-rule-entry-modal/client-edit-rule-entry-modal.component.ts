import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from "@angular/material";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
@Component({
    selector: 'client-edit-rule-entry-modal',
    templateUrl: './client-edit-rule-entry-modal.component.html',
    styleUrls: ['./client-edit-rule-entry-modal.component.scss']
})
export class ClientEditRuleEntryModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    project: any = JSON.parse(localStorage.getItem("projectInfo"))
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
        private dialogRef: MatDialogRef<ClientEditRuleEntryModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
        this.rule = data
    }

    ngOnInit() {
        this.usersByProject()
    }

    getRuleEntry() {
        this.showComponentLoader = true
        this.serverService.fetchEntryList(this.authToken).subscribe(
            data => {
                this.entries = data;
                if (!this.data.criteria.assign.random) {
                    this.showRoundRobin = this.data.criteria.assign.random;
                    this.data.criteria.assign.users.forEach(element => {
                        this.assignSingleUser = element;
                    });
                } else {
                    this.showRoundRobin = this.data.criteria.assign.random;
                    this.addUsers = this.users.filter(e => this.data.criteria.assign.users.includes(e.id))
                    this.leftUser = this.users.filter(e => !this.data.criteria.assign.users.includes(e.id))
                }
                this.data.criteria.rules.forEach((element) => {
                    let body = {
                        //"rule_name": element.field,
                        "rule_operator": element.operator,
                        "rule_value": element.values
                    }
                    if (element.values != undefined) {
                        body["rule_value"] = element.values
                    }
                    if (element.value != undefined) {
                        body["rule_value"] = element.value
                    }
                    if (element.operator == "between") {
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
                this.pattern = this.data.criteria.pattern;
                if (this.pattern != "") {
                    let splitedData = this.pattern.split(" ").filter(element => {
                        if (element == "or" || element == "and") {
                            return element;
                        }
                    });
                    splitedData.forEach((element, index) => {
                        if (element == "or" || element == "and") {
                            if (element == "or") {
                                this.fieldArray[index + 1]["andOr"] = false
                            } else {
                                this.fieldArray[index + 1]["andOr"] = true
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

    usersByProject() {
        this.serverService.getUsersByProject(this.data.assignment.project_id, this.authToken).subscribe(
            data => {
                this.users = data.users;
                this.getRuleEntry();
            },
            err => {
                this.showComponentLoader = false

                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
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
            this.clipBoardService.showMessgeInText("Cannot add Criteria more than 10", "success-snackbar")
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
        this.textAreaPattern = this.pattern;
    }

    deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
        this.changeAndOr("", "")
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
        let body = {
            "project_id": this.data.assignment.project_id,
            "assignment_rule_id": this.data.assignment.id,
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
                        this.clipBoardService.showMessgeInText("Score is not in proper Range", "error-snackbar")
                        return
                    }
                    singleRuleValue.push(between)
                } else {
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
        if (this.returnData) {
            return
        }
        this.showSaveButton = true
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
            body.pattern = "1";
        }
        this.serverService.updateCriteria(this.rule["criteria"].id, body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText("Updated Successfully", "success-snackbar")
                this.showSaveButton = false
                this.dialogRef.close("data")
            },
            err => {
                this.showSaveButton = false
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
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

    close() {
        this.dialogRef.close()
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

