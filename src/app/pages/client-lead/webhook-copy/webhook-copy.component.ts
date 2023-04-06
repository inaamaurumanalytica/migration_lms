import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service'
import { MatSnackBar } from '@angular/material';
import { MatSlideToggleChange } from '@angular/material';

@Component({
	selector: 'app-webhook-copy',
	templateUrl: './webhook-copy.component.html',
	styleUrls: ['./webhook-copy.component.scss']
})
export class WebhookCopyComponent implements OnInit {
	showAutoSetting: boolean = false;
	public authData: any = {};
	btnStatus : boolean = false
	public currentUser: any = JSON.parse(localStorage.getItem("user"));
	authToken: string = "";
	autoVerification: boolean = false;
	name: string = "";
	url: string = "";
	headers: any[] = [];
	remote: string = "";
	action = 'exit';
	selectedWebhook: any = {}
	useDefault = false;
	useDefault1 = false;
	useDefault2 = false;
	currentWebhook: any = {};
	baseSearchInput: any = ""
	fieldArray: Array<any> = [];
	fieldStaticArray: Array<any> = [];
	selectedProject: any = ""
	
	constructor(
		private snackBar: MatSnackBar,
		private serverService: ServerService,
		private clipBoardService: ClipBoardService,
		private dialogRef: MatDialogRef<WebhookCopyComponent>,
		@Inject(MAT_DIALOG_DATA) private data
	) {
		this.selectedProject = data.project
		this.selectedWebhook = data.webhook
		this.authToken = localStorage.getItem("token");
		this.editWebhook(this.selectedWebhook)
	}

	ngOnInit() {
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

	close() {
		this.dialogRef.close();
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
	}


	createWebhook() {
		let body = {
			"url": this.url,
			"name": this.name,
			"method": this.remote,
			"active": this.currentWebhook.active,
			"encode_json": this.useDefault1,
			"project_id": this.selectedProject,
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
		this.btnStatus = true
		this.serverService.createWebhook(body, this.authToken).subscribe(
			data => {
				this.snackBar.open("Webhook Created Succesfully", this.action, {
					duration: 1000,
					verticalPosition: 'top',
					horizontalPosition: 'end',
					panelClass: 'blue-snackbar'
				})
				this.dialogRef.close("Webhook Created Succesfully")
			},
			err => {
				this.btnStatus = false
				this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
			}
		)
	}
}