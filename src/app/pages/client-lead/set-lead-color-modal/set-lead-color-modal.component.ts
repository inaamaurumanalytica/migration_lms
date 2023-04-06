
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';

@Component({
    selector: 'set-lead-color-modal',
    templateUrl: './set-lead-color-modal.component.html',
    styleUrls: ['./set-lead-color-modal.component.scss']
})
export class SetLeadColorModalComponent implements OnInit {
    colorForm: FormGroup;
    action: string = ""
    btnStatus: boolean = false
    colors: any[] = []
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
    constructor(private dialog: MatDialog, public clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private serverService: ServerService,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<SetLeadColorModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.colorForm = this.fb.group({
            color: ["", Validators.required],
        });
    }

    ngOnInit() {
        this.getColors()
    }

    getColors() {
        this.serverService.getLeadColor(localStorage.getItem("token")).subscribe(
            data => {
                this.colors = data
            },
            err => {
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    save() {
        this.btnStatus = true
        let body = {
            "color_id": this.colorForm.value.color.id,
        }
        this.serverService.setLeadColor(this.data.id, body, localStorage.getItem("token")).subscribe(
            data => {
                this.clipBoardService.showMessgeInText("Set Color Successfully", "success-snackbar")
                this.btnStatus = false
                this.dialogRef.close(data);
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    backGroundColor(status) {
        return {
            "width": "20px",
            "height": "20px",
            "border-radius": "28px",
            "background-color": status.color_code,
            "border": "1px solid",
        }
    }

    selectColor(status) {
        return {
            "background-color": status.color_code,
            "margin-right": "10px"
        }
    }
}

