import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'user-info-modal',
    templateUrl: './user-info-modal.component.html',
    styleUrls: ['./user-info-modal.component.scss']
})
export class UserInfoModalComponent implements OnInit {
    dataSource: any = {};
	modifiedDate: string = ""
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<UserInfoModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.dataSource = this.data;
        if(this.dataSource.org_admin == true){
            this.dataSource.userRole = "Vendor Admin"
        }
        else{
            if(this.data.role == null)
            {
                this.dataSource.userRole = "Standard Vendor User"
            }
            else{
                this.dataSource.userRole = "Sales Admin"
            }
        }
        this.modifiedDate = this.formatDate(this.data.updated_at)
    }

    ngOnInit() {
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    }

    close() {
        this.dialogRef.close();
    }
}

