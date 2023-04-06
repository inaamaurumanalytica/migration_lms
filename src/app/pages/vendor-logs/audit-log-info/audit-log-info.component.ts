import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
@Component({
	selector: 'audit-log-info',
	templateUrl: './audit-log-info.component.html',
	styleUrls: ['./audit-log-info.component.scss']
})

export class AuditLogInfoComponent implements OnInit {
	showInfo: boolean = false;
	public currentUser: any = JSON.parse(localStorage.getItem("userInfo"));
	authToken: string = "";
	Object = Object;
	action = 'exit';
	dataSource: any = {};

	constructor(
		private dialogRef: MatDialogRef<AuditLogInfoComponent>,
		@Inject(MAT_DIALOG_DATA) private data) { }

	ngOnInit() {
		this.dataSource = this.data
	}

	close() {
		this.dialogRef.close();
	}
}