import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-task-mark-done-modal',
    templateUrl: './client-task-mark-done-modal.component.html',
    styleUrls: ['./client-task-mark-done-modal.component.scss']
})
export class ClientTaskMarkDoneModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    authToken = localStorage.getItem("token")
    authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
    projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
    leadInfo: any = JSON.parse(localStorage.getItem("leadInfo"))
    note = ""
    saveStatus: boolean = false
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientTaskMarkDoneModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit() {
    }

    saveNote() {
        this.saveStatus = true;
        let body = {
            "task_category": this.data.task_category,
            "priority": this.data.priority,
            "subject": this.data.subject,
            "description": this.data.description,
            "due_date": this.data.due_date,
            "auto_reminder": this.data.auto_reminder,
            "custom_reminder": this.data.custom_reminder,
            "lead_id": this.data.lead_id,
            "task_note": "",
            "done": true,
        }
        if (this.note.trim() == '') {
            body.task_note = this.data.task_note;
        } else {
            body.task_note = this.data.task_note + this.note.trim() + '|n';
        }
        // if (this.data.task_note == null || this.data.task_note == '') {
        //     body.task_note = this.note.trim() + '|n';
        // } else {
        //     body.task_note = this.data.task_note + this.note.trim() + '|n';
        // }
        this.serverService.updateLeadTask(this.data.id, body, this.authToken).subscribe(
            data => {
                this.dialogRef.close("Task Mark As Done Successfully")
                this.clipBoardService.showMessgeInText("Task Mark As Done Successfully", "success-snackbar")
                this.saveStatus = false;
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
                this.saveStatus = false;
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

