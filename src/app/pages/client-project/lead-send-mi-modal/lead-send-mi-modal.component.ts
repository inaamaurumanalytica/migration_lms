import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'

@Component({
  selector: 'app-lead-send-mi-modal',
  templateUrl: './lead-send-mi-modal.component.html',
  styleUrls: ['./lead-send-mi-modal.component.scss']
})
export class LeadSendMiModalComponent implements OnInit {

  authToken: string = localStorage.getItem("token")
  btnStatus: boolean = false
  constructor(
      private serverService: ServerService,
      private clipBoardService: ClipBoardService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<LeadSendMiModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data) {
        console.log(data)
  }

  ngOnInit() {   
  }

  submit() {
      this.btnStatus = true
      let body ={
        "id": this.data.id
      }
      this.serverService.leadSendToMI(body, this.authToken).subscribe(data => {
              this.btnStatus = false
              this.clipBoardService.showMessgeInText('Lead Send Marketing Intelligence Successfully', 'success-snackbar')
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
