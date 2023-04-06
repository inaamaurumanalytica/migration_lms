import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
@Component({
  selector: 'app-client-list-project-modal',
  templateUrl: './client-list-project-modal.component.html',
  styleUrls: ['./client-list-project-modal.component.scss']
})
export class ClientListProjectModalComponent implements OnInit {
  client:any={}
  constructor(
    private dialogRef: MatDialogRef<ClientListProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.client = data
    
   }

  ngOnInit() {
  }

  close() {
    console.log(this.client)
    this.dialogRef.close();
}


}
