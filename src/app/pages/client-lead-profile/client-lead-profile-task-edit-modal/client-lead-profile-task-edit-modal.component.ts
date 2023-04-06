import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-profile-task-edit-modal',
    templateUrl: './client-lead-profile-task-edit-modal.component.html',
    styleUrls: ['./client-lead-profile-task-edit-modal.component.scss']
})
export class ClientLeadProfileEditModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    authToken = localStorage.getItem("token")
    authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
    projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
    leadInfo: any = JSON.parse(localStorage.getItem("leadInfo"))
    action = "";
    tasks: any[] = []
    lead: any;
    public min = new Date()
    public max: Date;
    autoReminderNotification: boolean = true
    saveStatus: boolean = false
    createTaskForm: FormGroup;
    taskNotes: any = [];
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadProfileEditModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
        // console.log(data)
        // console.log(this.data.auto_reminder)
        this.createTaskForm = this.fb.group({
            "task_category": [this.data.task_category, Validators.required],//"Phone",
            "subject": [this.data.subject, Validators.required],//"please call on phone for specific lead",
            "priority": [JSON.stringify(this.data.priority), Validators.required],//"High",
            "description": [this.data.description],//"hi every one please send email templates for given lead id Thank you",
            //"due_date": [new Date(this.data.due_date)],//"2019-02-10 15:44:37",
            "due_date": [''],//"2019-02-10 15:44:37",
            "custom_remainder": [],//"2019-02-09 15:44:37",
            "taskNote": ['']
        });
        if (this.data.due_date != null && this.data.due_date != '') {
            this.createTaskForm.controls['due_date'].setValue(new Date(this.data.due_date))
        } else {
            this.createTaskForm.controls['due_date'].setValue(new Date())
        }
        if (this.data.task_note != null && this.data.task_note != '') {
            let notes = this.data.task_note.split('|n');
            notes.forEach(element => {
                if (element != '') {
                    this.taskNotes.push(element)
                }
            });
        }
        if (this.data.auto_reminder) {
            this.createTaskForm.controls['custom_remainder'].setValue(new Date())
        } else {
            this.createTaskForm.controls['custom_remainder'].setValue(new Date(this.data.custom_remainder))
        }
        
        this.autoReminderNotification = this.data.auto_reminder
        if (this.data.profileView != undefined) {
            this.lead = this.leadInfo;
        } else {
            this.lead = this.data.lead;
        }
    }

    ngOnInit() {
    }

    addTask() {
        this.saveStatus = true;
        let project = ""
        if (this.data.lead != undefined) {
            project = this.data.lead.project.id
        } else {
            project = this.projectInfo.id
        }

        if (this.createTaskForm.value.subject.trim() == '') {
            this.clipBoardService.showMessgeInText("Please fill subject", 'success-snackbar')
            this.saveStatus = false;
            return
        }
        let body = {
            "task_category_id": this.createTaskForm.value.task_category,
            "subject": this.createTaskForm.value.subject,
            "priority": this.createTaskForm.value.priority,
            "description": this.createTaskForm.value.description,
            "due_date": this.createTaskForm.value.due_date.toJSON(),//"2019-02-10 15:44:37",
            "auto_reminder": this.autoReminderNotification,
            "custom_reminder": this.createTaskForm.value.custom_remainder.toJSON(),//"2019-02-09 15:44:37",
            "lead_id": this.data.lead_id,
            'task_note': ''
        }
        if (this.data.task_note == null && this.createTaskForm.value.taskNote.trim() == '') {
            body.task_note = this.data.task_note
        } else if (this.data.task_note == null && this.createTaskForm.value.taskNote.trim() != '') {
            body.task_note = this.createTaskForm.value.taskNote.trim() + '|n';
        } else {
            body.task_note = this.data.task_note + this.createTaskForm.value.taskNote.trim() + '|n';
        }
        if (this.createTaskForm.value.custom_remainder != null) {
            body.custom_reminder = this.createTaskForm.value.custom_remainder.toJSON();
        } else {
            body.auto_reminder = true
            body.custom_reminder = null
        }
        this.serverService.updateLeadTask(this.data.id, body, this.authToken).subscribe(
            data => {
                this.dialogRef.close("Task Updated Successfully")
                this.clipBoardService.showMessgeInText("Task Updated Successfully", "success-snackbar")
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

    addNotes(note) {

    }
}

