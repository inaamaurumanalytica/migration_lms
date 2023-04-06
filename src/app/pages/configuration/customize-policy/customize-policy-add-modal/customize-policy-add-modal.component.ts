import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../../services/clipboard.service'
import { ServerService } from '../../../../services/server.service'
@Component({
    selector: 'customize-policy-add-modal',
    templateUrl: './customize-policy-add-modal.component.html',
    styleUrls: ['./customize-policy-add-modal.component.scss']
})
export class CustomizePolicyAddModalComponent implements OnInit {
    action = "";
    btnStatus: boolean = false
    authToken = localStorage.getItem("token")
    createPolicyForm: FormGroup;
    config: any = {
        height: 150,
        theme: 'modern',
        branding: false,
        // powerpaste advcode toc tinymcespellchecker a11ychecker mediaembed linkchecker help
        plugins: 'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image imagetools link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount contextmenu colorpicker textpattern',
        toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
        image_advtab: true,
        imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions',
        content_css: [
            '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
            '//www.tinymce.com/css/codepen.min.css'
        ]
    };
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CustomizePolicyAddModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.createPolicyForm = this.fb.group({
            doc_type: ["", Validators.required],
            version: ["", Validators.required],
            description: ["", Validators.required],
            published: ["", Validators.required],
        });
    }

    ngOnInit() {
    }

    save() {
        this.btnStatus = true
        let body = {
            "doc_type": this.createPolicyForm.value.doc_type,
            "version": this.createPolicyForm.value.version,
            "data": this.createPolicyForm.value.description,
            "published": this.createPolicyForm.value.published
        }
        this.serverService.createPolicy(body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText('Policy Created Successfully', 'success-snackbar')
                this.dialogRef.close(data)
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}

