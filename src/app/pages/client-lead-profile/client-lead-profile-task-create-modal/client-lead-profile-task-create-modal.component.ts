import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-profile-task-create-modal',
    templateUrl: './client-lead-profile-task-create-modal.component.html',
    styleUrls: ['./client-lead-profile-task-create-modal.component.scss']
})
export class ClientLeadProfileTaskCreateModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    authToken = localStorage.getItem("token")
    authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
    projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
    leadInfo: any = JSON.parse(localStorage.getItem("leadInfo"))
    action = "";
    tasks: any[] = []
    public min = new Date()
    public max: Date;
    autoReminderNotification: boolean = true
    saveStatus: boolean = false
    createTaskForm: FormGroup;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadProfileTaskCreateModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        this.createTaskForm = this.fb.group({
            "task_category": ["", Validators.required],//"Phone",
            "subject": ["", Validators.required],//"please call on phone for specific lead",
            "priority": ["", Validators.required],//"High",
            "description": [""],//"hi every one please send email templates for given lead id Thank you",
            "due_date": [new Date()],//"2019-02-10 15:44:37",
            "auto_remainder": [false],
            "custom_remainder": [new Date()],//"2019-02-09 15:44:37",
        });
    }

    ngOnInit() {
        
    }

    addTask() {
        this.saveStatus = true;
        let body = {
            "task_category": this.createTaskForm.value.task_category,
            "subject": this.createTaskForm.value.subject,
            "priority": this.createTaskForm.value.priority,
            "description": this.createTaskForm.value.description,
            "due_date": this.createTaskForm.value.due_date.toJSON(),//"2019-02-10 15:44:37",
            "auto_reminder": this.autoReminderNotification,
            "custom_reminder": this.createTaskForm.value.custom_remainder.toJSON(),//"2019-02-09 15:44:37",
            "lead_id": this.data.id
        }
        this.serverService.createLeadTask(body, this.authToken).subscribe(
            data => {
                this.dialogRef.close("Task Created Successfully")
                this.clipBoardService.showMessgeInText("Task Created Successfully", "success-snackbar")
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

    checkAutoReminder() {
        this.autoReminderNotification = !this.autoReminderNotification
    }
}

