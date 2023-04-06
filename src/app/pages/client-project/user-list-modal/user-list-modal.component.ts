import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-user-list-modal',
  templateUrl: './user-list-modal.component.html',
  styleUrls: ['./user-list-modal.component.scss']
})
export class UserListModalComponent implements OnInit {

  authToken = localStorage.getItem('token');
  users:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private serverservice:ServerService,
    private dialogRef: MatDialogRef<UserListModalComponent>,
  ) { }

  ngOnInit() {
    this.getUserListByProjectId();
  }
  getUserListByProjectId(){
    this.serverservice.getAssignedUsersByProjectId(this.data.id,this.authToken).subscribe((data)=>{
      this.users = data.users;
    })
  }
  close() {
    this.dialogRef.close();
}

}
