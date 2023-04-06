import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'project-upload-avatar-modal',
    templateUrl: './project-upload-avatar-modal.component.html',
    styleUrls: ['./project-upload-avatar-modal.component.scss']
})
export class ProjectUploadAvatarModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    btnStatus: boolean = false
    imageChangedEvent: any = '';
    croppedImage: any = '';
    showCropper = false;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ProjectUploadAvatarModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
    }

    ngOnInit() { }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event) {
        this.croppedImage = event.file;
    }
    imageLoaded() {
        this.showCropper = true;
    }

    save() {
        this.btnStatus = true
        const formData: FormData = new FormData();
        formData.append('avatar', this.croppedImage);
        formData.append('id', this.data.id);
        this.serverService.uploadProjectAvatar(formData, this.authToken).subscribe(
            data => {
                this.dialogRef.close(data);
                this.btnStatus = false;
                this.clipBoardService.showMessgeInText("Avatar Updated Successfully", "success-snackbar")
            },
            err => {
                this.btnStatus = false;
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

