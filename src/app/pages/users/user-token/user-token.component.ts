import { Component, OnInit, Inject } from '@angular/core';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ClipboardService } from 'ngx-clipboard';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
@Component({
	selector: 'user-token',
	templateUrl: './user-token.component.html',
	styleUrls: ['./user-token.component.scss']
})
export class UserTokenComponent implements OnInit {
	public currentUser: any = JSON.parse(localStorage.getItem("userInfo"));
	authToken: string = "";
	action = 'exit';
	dataSource: any = {};
	constructor(
		private clipBoardService: ClipboardService,
		private clipBoard: ClipBoardService,
		private dialogRef: MatDialogRef<UserTokenComponent>,
		@Inject(MAT_DIALOG_DATA) private data
	) {
		this.dataSource = this.data;
	}

	ngOnInit() {
	}

	close() {
		this.dialogRef.close();
	}

	copy(text: string) {
		this.clipBoardService.copyFromContent(text)
		this.clipBoard.showMessgeInText("Content Copied", "success-snackbar")
	}
}