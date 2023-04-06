import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { ServerService } from '../../../services/server.service';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service'
@Component({
	selector: 'lead-duplicate-info',
	templateUrl: './lead-duplicate-info.component.html',
	styleUrls: ['./lead-duplicate-info.component.scss']
})

export class LeadDuplicateInfoComponent implements OnInit {
	showInfo: boolean = false;
	public currentUser: any = JSON.parse(localStorage.getItem("user"));
	authToken: string = "";
	Object = Object;
	action = 'exit';
	dataSource: any = {};
	systemDuplicatedInfo = []
	clientDuplicatedInfo = []
	constructor(
		private dialog: MatDialog,
		private serverService: ServerService,
		private clipBoardService: ClipBoardService,
		private router: Router,
		private dialogRef: MatDialogRef<LeadDuplicateInfoComponent>,
		@Inject(MAT_DIALOG_DATA) private data
	) {
		this.systemDuplicatedInfo = data.duplicated_info.info
		this.clientDuplicatedInfo = data.duplicated_info.info.filter(el => el.client_id == data.client.id)
	}

	ngOnInit() {

	}

	close() {
		this.dialogRef.close();
	}
}