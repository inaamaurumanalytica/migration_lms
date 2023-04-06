import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ClientCreateRuleEntryModalComponent } from '../client-create-rule-entry-modal/client-create-rule-entry-modal.component'
import { ClientEditRuleEntryModalComponent } from '../client-edit-rule-entry-modal/client-edit-rule-entry-modal.component'
import { ClientRuleEntryDeleteModalComponent } from '../client-rule-entry-delete-modal/client-rule-entry-delete-modal.component'
@Component({
    selector: 'client-rule-entry-modal',
    templateUrl: './client-rule-entry-modal.component.html',
    styleUrls: ['./client-rule-entry-modal.component.scss']
})
export class ClientRuleEntryModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    projects: any[] = []
    authToken = localStorage.getItem("token")
    rule: any = {}


    users: any[] = [];
    showDataTable: boolean = false;
    public authData: any = {};
    displayedColumns: string[] = [];
    showComponentLoader: boolean = false;
    assignmentRule: any = {
        "assignment_rule_criterias": []
    }

    clientCreateRuleEntryModalComponent: MatDialogRef<ClientCreateRuleEntryModalComponent>
    clientEditRuleEntryModalComponent: MatDialogRef<ClientEditRuleEntryModalComponent>
    clientRuleEntryDeleteModalComponent: MatDialogRef<ClientRuleEntryDeleteModalComponent>
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<ClientRuleEntryModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
        this.rule = data

    }

    ngOnInit() {
        this.userList()
    }

    userList() {
        this.showComponentLoader = true
        this.serverService.usersList(this.authToken).subscribe(
            data => {
                this.users = data.users;
                this.ruleEntryList();
            },
            err => {
                this.showComponentLoader = false
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    ruleEntryList() {
        this.assignmentRule = {
            "assignment_rule_criterias": []
        }
        this.serverService.criteriaByAssignmnetId(this.data.id, this.authToken).subscribe(
            data => {
                this.assignmentRule = data
                this.assignmentRule["new_assignment_rule_criterias"] = [];
                this.assignmentRule.criteria_order.forEach(element => {
                    this.assignmentRule.new_assignment_rule_criterias.push(this.assignmentRule.assignment_rule_criterias.filter(rule => rule.id == element)[0]);
                });
                this.assignmentRule.assignment_rule_criterias = this.assignmentRule.new_assignment_rule_criterias;
                delete this.assignmentRule.new_assignment_rule_criterias;
                this.users.forEach(element1 => {
                    this.assignmentRule.assignment_rule_criterias.forEach(element2 => {
                        element2.assign.users.forEach(element3 => {
                            if (element1.id == element3) {
                                let body = {
                                    "id": element1.id,
                                    "name": element1.name,
                                }
                                if (element2.assign["new_users"] == undefined || element2.assign["new_users"].length == 0) {
                                    element2.assign["new_users"] = []
                                }
                                element2.assign["new_users"].push(body);
                            }
                        });
                    });
                });
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    edit(element) {
        let body = {
            "criteria": element,
            "assignment": this.rule
        }
        this.clientEditRuleEntryModalComponent = this.dialog.open(ClientEditRuleEntryModalComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            // width: '100%',
            width: '50%',
            // maxWidth: '100vw',
            panelClass: 'cdk-overlay-panel-right-side',
            data: body
        });
        this.clientEditRuleEntryModalComponent.afterClosed().subscribe(result => {
            if (result != undefined) {
                this.ruleEntryList();
            }
        })
    }

    delete(element) {
        let body = {
            "rule": element
        }
        this.clientRuleEntryDeleteModalComponent = this.dialog.open(ClientRuleEntryDeleteModalComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            width: "500px",
            data: body
        });
        this.clientRuleEntryDeleteModalComponent.afterClosed().subscribe(result => {
            if (result != undefined) {
                this.ruleEntryList();
            }
        })
    }

    changeActive(element, event) {
        let body = {
            "active": event.checked,
        }
        this.serverService.updateCriteria(element.id, body, this.authToken).subscribe(
            data => {
                let msg = "";
                if (body.active) {
                    msg = "Lead Assignment Activated"
                } else {
                    msg = "Lead Assignment Deactivated"
                }
                this.clipBoardService.showMessgeInText(msg, "success-snackbar")
            },
            err => {
                console.error(err);
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    reorder() {
        this.showDataTable = true;
    }

    saveReorder() {
        let criteriaOrder = []
        this.assignmentRule.assignment_rule_criterias.forEach(element => {
            criteriaOrder.push(element.id);
        });
        let body = {
            "criteria_order": criteriaOrder,
        }
        this.serverService.updateActiveAssignment(this.rule.id, body, this.authToken).subscribe(
            data => {
                this.ruleEntryList();
                this.showDataTable = false;
            },
            err => {
                console.error(err)
            }
        )
    }

    cancelReorder() {
        this.showDataTable = false;
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.assignmentRule.assignment_rule_criterias, event.previousIndex, event.currentIndex);
        this.assignmentRule.assignment_rule_criterias = this.assignmentRule.assignment_rule_criterias
    }

    copy(element) {
        delete element.id;
        delete element.assign.new_users;
        this.serverService.createCriteria(element, this.authToken).subscribe(
            data => {
                this.ruleEntryList();
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }

        )
    }

    close() {
        this.dialogRef.close();
    }

    createRuleEntry() {
        this.clientCreateRuleEntryModalComponent = this.dialog.open(ClientCreateRuleEntryModalComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            width: '50%',
            // width: '100%',
            // maxWidth: '100vw',
            panelClass: 'cdk-overlay-panel-right-side',
            data: this.rule
        });
        this.clientCreateRuleEntryModalComponent.afterClosed().subscribe(result => {
            if (result != undefined) {
                this.ruleEntryList()
            }
        })
    }

}

