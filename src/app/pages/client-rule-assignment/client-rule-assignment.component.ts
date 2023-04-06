import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { ClientRuleAssignmentCreateModalComponent } from './client-rule-assignment-create-modal/client-rule-assignment-create-modal.component';
import { ClientAssignmentDeleteModalComponent } from './client-assignment-delete-modal/client-assignment-delete-modal.component';

import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { ClientRuleEntryModalComponent } from './client-rule-entry-modal/client-rule-entry-modal.component';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-client-rule-assignment',
  templateUrl: './client-rule-assignment.component.html',
  styleUrls: ['./client-rule-assignment.component.scss']
})
export class ClientRuleAssignmentComponent implements OnInit {
  authToken: any = localStorage.getItem("token")
  authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
  showComponentLoader: boolean = false
  rules: any[] = []
  filteredRules: any[] = []
  elasticSearch: any = ""

  clientRuleAssignmentCreateModalComponent: MatDialogRef<ClientRuleAssignmentCreateModalComponent>
  clientRuleEntryModalComponent: MatDialogRef<ClientRuleEntryModalComponent>
  clientAssignmentDeleteModalComponent: MatDialogRef<ClientAssignmentDeleteModalComponent>
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageIndex: number = 0;
  pageSize: number = 100;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
  ) {
    //this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Rule Assignment');
  }

  ngOnInit() {
    this.getAllRules()
  }

  getAllRules() {
    this.showComponentLoader = true;
    this.serverService.assignmentList(this.authToken).subscribe(
      data => {
        this.showComponentLoader = false;
        this.rules = data;
        this.filteredRules = data
      },
      err => {
        this.showComponentLoader = false;
        this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
      }
    )
  }

  create() {
    this.clientRuleAssignmentCreateModalComponent = this.dialog.open(ClientRuleAssignmentCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
    });
    this.clientRuleAssignmentCreateModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.ngOnInit()
      }
    })
  }

  showRuleEntryList(value) {
    this.clientRuleEntryModalComponent = this.dialog.open(ClientRuleEntryModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '50%',
      // width: '100%',
      // maxWidth: '100vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: value
    });
    this.clientRuleEntryModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.showComponentLoader = true
        this.ngOnInit()
      }
    })
  }

  active(rule, event) {
    let body = {
      "active": event.checked,
    }
    this.serverService.updateActiveAssignment(rule.id, body, this.authToken).subscribe(
      data => {
        if (body.active) {
          this.clipBoardService.showMessgeInText('Rule Activated', 'success-snackbar')
        } else {
          this.clipBoardService.showMessgeInText('Rule Deactivated', 'success-snackbar')
        }
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  delete(rule) {
    this.clientAssignmentDeleteModalComponent = this.dialog.open(ClientAssignmentDeleteModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      data: rule
    });
    this.clientAssignmentDeleteModalComponent.afterClosed().subscribe(result => {
      if (result != undefined) {
        this.getAllRules();
      }
    })
  }

  searchRule() {
    this.filteredRules = this.rules.filter(el =>
      el.rule_name.toLowerCase().includes(this.elasticSearch.toLowerCase()) ||
      el.project.name.toLowerCase().includes(this.elasticSearch.toLowerCase()) ||
      el.created_by.toLowerCase().includes(this.elasticSearch.toLowerCase()))
  }

  removeSearch() {
    this.elasticSearch = ""
    this.getAllRules()
  }
}