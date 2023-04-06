import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-lead-profile-note-create-modal',
    templateUrl: './client-lead-profile-note-create-modal.component.html',
    styleUrls: ['./client-lead-profile-note-create-modal.component.scss']
})
export class ClientLeadProfileNoteCreateModalComponent implements OnInit {
    public currentUser = JSON.parse(localStorage.getItem("userInfo"));
    authToken = localStorage.getItem("token")
    authInfo: any = JSON.parse(localStorage.getItem("authInfo"))
    projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
    leadInfo: any = JSON.parse(localStorage.getItem("leadInfo"))
    action = "";

    saveStatus: boolean = false
    note = {
        "title": "",
        "description": ""
    }
    attachNoteFiles: any[] = []
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientLeadProfileNoteCreateModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit() {
    }

    saveNote() {
        this.saveStatus = true;
        const formData: FormData = new FormData();
        formData.append('title', this.note["title"]);
        formData.append('description', this.note["description"]);
        formData.append('lead_id', this.leadInfo.id);
        if (this.attachNoteFiles != undefined && this.attachNoteFiles.length != 0) {
            for (var x = 0; x < this.attachNoteFiles.length; x++) {
                formData.append("documents[]", this.attachNoteFiles[x]);
            }
        }
        this.serverService.createLeadNote(formData, this.authToken).subscribe(
            data => {
                this.dialogRef.close("Note Created Successfully")
                this.clipBoardService.showMessgeInText('Note Created Successfully', 'success-snackbar')
                this.saveStatus = false;
            },
            err => {
                this.saveStatus = false;
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }


    selectFile(event) {
        let attachNote = Array.from(event.target.files);
        attachNote.forEach(element => {
            element["ext"] = element["name"].split('.')[1];
            this.attachNoteFiles.push(element)
        })
        document.getElementById("attach")["value"] = ""
    }

    removeFile(element) {
        for (let i = 0; i < this.attachNoteFiles.length; i++) {
            if (element == this.attachNoteFiles[i]) {
                this.attachNoteFiles.splice(i, 1);
            }
        }
    }

    close() {
        this.dialogRef.close();
    }
}

