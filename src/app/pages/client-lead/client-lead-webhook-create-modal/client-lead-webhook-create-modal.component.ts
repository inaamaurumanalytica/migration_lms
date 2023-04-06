import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { MatSlideToggleChange } from '@angular/material';
import { IMyDateRangeModel } from 'mydaterangepicker';

import { ClientWebhookDeleteModalComponent } from '../client-webhook-delete-modal/client-webhook-delete-modal.component'
import { WebhookByProjectComponent } from '../webhook-by-project/webhook-by-project.component';
@Component({
    selector: 'client-lead-webhook-create-modal',
    templateUrl: './client-lead-webhook-create-modal.component.html',
    styleUrls: ['./client-lead-webhook-create-modal.component.scss']
})
export class ClientLeadWebhookCreateModalComponent implements OnInit {

    showComponentLoader: boolean = false
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    authToken = localStorage.getItem("token")

    name: string = "";
    url: string = "";
    btnStatus: boolean = false
    headers: any[] = [];
    displayedColumns = ['position', 'name', 'method', 'url', 'action'];
    webhooks: any[] = [];
    inputWebhookList: any[] = [];
    remote: string = "";
    action = 'exit';
    useDefault = false;
    useDefault1 = false;
    useDefault2 = false;

    currentWebhook: any = {};
    fieldArray: Array<any> = [];
    fieldStaticArray: Array<any> = [];

    showWebhookList: boolean = true;
    showCreateWebhook: boolean = false;
    showEditWebhook: boolean = false;
    autoVerify: boolean = false;
    clientWebhookDeleteModalComponent: MatDialogRef<ClientWebhookDeleteModalComponent>;
    project: any = ""
    webhookByProjectComponent: MatDialogRef<WebhookByProjectComponent>
    constructor(
        private dialog: MatDialog,
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private dialogRef: MatDialogRef<ClientLeadWebhookCreateModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
        this.project = data
    }

    ngOnInit() {
        this.getAllWebhook()
    }


    getAllWebhook() {
        this.showComponentLoader = true
        this.serverService.getWebhookList(this.project.id, this.authToken).subscribe(
            data => {
                this.webhooks = data;
                this.showComponentLoader = false
            },
            err => {
                this.showComponentLoader = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    addnewrow() {
        this.fieldArray.push({ "key": "", "value": "" })
    }

    addnewstaticrow() {
        this.fieldStaticArray.push({ "key": "", "value": "" })
    }

    addHeaders() {
        this.headers.push({ "key": "", "value": "" })
    }

    deleteFieldValue(index) {
        this.fieldArray.splice(index, 1);
    }

    deleteStaticFieldValue(index) {
        this.fieldStaticArray.splice(index, 1);
    }

    deleteHeaders(index) {
        this.headers.splice(index, 1);
    }

    openCreateWebhook() {
        this.showWebhookList = false;
        this.showEditWebhook = false;
        this.showCreateWebhook = true;
        this.resetCreateWebhookValues();
    }

    cancelCreateWebhook() {
        this.showCreateWebhook = false;
        this.showEditWebhook = false;
        this.showWebhookList = true;
        this.resetCreateWebhookValues()
    }

    cancelEditWebhook() {
        this.showCreateWebhook = false;
        this.showEditWebhook = false;
        this.showWebhookList = true;
        this.resetCreateWebhookValues()
    }

    resetCreateWebhookValues() {
        this.url = "";
        this.name = "";
        this.remote = "";
        this.fieldArray = [{
            "key": "",
            "value": ""
        }];
        this.fieldStaticArray = [{
            "key": "",
            "value": ""
        }];
        this.headers = [{
            "key": "",
            "value": ""
        }];
        this.useDefault = false;
        this.useDefault1 = false;
        this.useDefault2 = false;
    }

    public toggle(event: MatSlideToggleChange) {
        this.useDefault = event.checked;
    }
    public toggle1(event: MatSlideToggleChange) {
        this.useDefault1 = event.checked;
    }

    public toggle2(event: MatSlideToggleChange) {
        this.useDefault2 = event.checked;
    }

    editWebhook(element) {
        this.fieldArray = []
        this.fieldStaticArray = []
        this.headers = []
        this.currentWebhook = element;
        this.url = element.url;
        this.name = element.name;
        this.remote = element.method;
        this.useDefault1 = element.encode_json;
        if (Object.keys(element.static_args).length !== 0) {
            this.useDefault = true;
            for (var i in element.static_args) {
                this.fieldStaticArray.push({ "key": i, "value": element.static_args[i] });
            }
        } else {
            this.fieldStaticArray.push({ "key": "", "value": "" });
        }
        if (Object.keys(element.headers).length !== 0) {
            this.useDefault2 = true;
            for (var i in element.headers) {
                this.headers.push({ "key": i, "value": element.headers[i] });
            }
        } else {
            this.headers.push({ "key": "", "value": "" });
        }
        if (Object.keys(element.args).length !== 0) {
            for (var i in element.args) {
                this.fieldArray.push({ "key": i, "value": element.args[i] });
            }
        }
        this.showCreateWebhook = false;
        this.showWebhookList = false;
        this.showEditWebhook = true;
    }


    close() {
        this.dialogRef.close();
    }

    close1() {
        this.showCreateWebhook = false;
        this.showEditWebhook = false;
        this.showWebhookList = true;
    }

    createWebhook() {
        this.btnStatus = true
        let body = {
            "url": this.url,
            "name": this.name,
            "method": this.remote,
            "active": false,
            "encode_json": this.useDefault1,
            "project_id": this.project.id,
            "args": {},
            "static_args": {},
            "headers": {}
        }
        if (this.fieldArray.length != 0) {
            this.fieldArray.forEach(element => {
                if (element.key != "" && element.value != "") {
                    body.args[element.key] = element.value
                }
            });
        }
        if (this.useDefault) {
            if (this.fieldStaticArray.length != 0) {
                this.fieldStaticArray.forEach(element => {
                    if (element.key != "" && element.value != "") {
                        body.static_args[element.key] = element.value
                    }
                });
            }
        }
        if (this.useDefault2) {
            if (this.headers.length != 0) {
                this.headers.forEach(element => {
                    if (element.key != "" && element.value != "") {
                        body.headers[element.key] = element.value
                    }
                });
            }
        }
        this.serverService.createWebhook(body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText("Webhook Created Succesfully", "success-snackbar");
                this.getAllWebhook();
                this.showCreateWebhook = false;
                this.showEditWebhook = false;
                this.showWebhookList = true;
                this.btnStatus = false
                this.resetCreateWebhookValues();
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    updateWebhook() {
        this.btnStatus = true
        let body = {
            "url": this.url,
            "name": this.name,
            "method": this.remote,
            "active": this.currentWebhook.active,
            "encode_json": this.useDefault1,
            "project_id": this.project.id,
            "args": {},
            "static_args": {},
            "headers": {}
        }
        if (this.fieldArray.length != 0) {
            this.fieldArray.forEach(element => {
                if (element.key != "" && element.value != "") {
                    body.args[element.key] = element.value
                }
            });
        }
        if (this.useDefault) {
            if (this.fieldStaticArray.length != 0) {
                this.fieldStaticArray.forEach(element => {
                    if (element.key != "" && element.value != "") {
                        body.static_args[element.key] = element.value
                    }
                });
            }
        }
        if (this.useDefault2) {
            if (this.headers.length != 0) {
                this.headers.forEach(element => {
                    if (element.key != "" && element.value != "") {
                        body.headers[element.key] = element.value
                    }
                });
            }
        }
        this.serverService.updateWebhook(this.currentWebhook.id, body, this.authToken).subscribe(
            data => {
                this.clipBoardService.showMessgeInText("Webhook Updated Succesfully", "success-snackbar");
                this.getAllWebhook();
                this.showCreateWebhook = false;
                this.showEditWebhook = false;
                this.showWebhookList = true;
                this.btnStatus = false
                this.resetCreateWebhookValues()
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }


    makeActive(element, event) {
        element.active = event.checked;
        this.serverService.updateWebhook(element.id, element, this.authToken).subscribe(
            data => {
                if (event.checked) {
                    this.clipBoardService.showMessgeInText('Status Enabled Successfully', 'success-snackbar')
                } else {
                    this.clipBoardService.showMessgeInText('Status Disabled Successfully', 'success-snackbar')
                }
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    deleteWebhook(element) {
        this.clientWebhookDeleteModalComponent = this.dialog.open(ClientWebhookDeleteModalComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            width: '500px',
            data: element
        });

        this.clientWebhookDeleteModalComponent.afterClosed().subscribe(result => {
            if (result != undefined) {
                this.getAllWebhook();
            }
        })
    }


    copy(val: string) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.clipBoardService.showMessgeInText("Link Copied", "success-snackbar")
    }

    copyWebhook() {
        this.webhookByProjectComponent = this.dialog.open(WebhookByProjectComponent, {
            hasBackdrop: true,
            disableClose: false,
            autoFocus: true,
            panelClass: 'cdk-overlay-panel-right-side',
            data: this.clipBoardService.projectInfo
        });
        this.webhookByProjectComponent.afterClosed().subscribe(result => {
            if (result != undefined) {
                this.getWebhookListByProject();
                this.showCreateWebhook = false;
                this.showEditWebhook = false;
                this.showWebhookList = true;
                this.resetCreateWebhookValues()
            }
        })
    }

    getWebhookListByProject() {
		this.serverService.getWebhookList(this.clipBoardService.projectInfo.id, this.authToken).subscribe(
			data => {
				this.webhooks = data;
			},
			err => {
				this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
			}
		)
	}
}