
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../../../services/clipboard.service';
import { ServerService } from '../../../../services/server.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'customize-policy-modal-info',
    templateUrl: './customize-policy-modal-info.component.html',
    styleUrls: ['./customize-policy-modal-info.component.scss']
})
export class CustomizePolicyModalInfoComponent implements OnInit {
    updateStatus: boolean = false;
    public currentUser: any = JSON.parse(localStorage.getItem("userInfo"));
    createPolicyForm: FormGroup;
    action = "";
    authToken = localStorage.getItem("token");
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

    constructor(private dialog: MatDialog, public clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        private serverService: ServerService,
        private dialogRef: MatDialogRef<CustomizePolicyModalInfoComponent>,
        @Inject(MAT_DIALOG_DATA) private data) { }

    ngOnInit() {
        if (this.data.doc_type == "PP") {
            this.data.doc_type = "Privacy Policy"
        } else {
            this.data.doc_type = "Terms & Condition"
        }
        this.createPolicyForm = this.fb.group({
            doc_type: [this.data.doc_type],
            version: [this.data.version],
            description: [this.data.data],
            published: [this.data.published],
        });
    }

    close() {
        this.dialogRef.close();
    }
}

