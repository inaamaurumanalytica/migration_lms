
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.scss']
})
export class AssignUserComponent implements OnInit {

  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))

  showAssignProject: boolean = false;
  assignedUsers: any[] = [{'id':1,'name':'inaam'}]
  users: any[] = [];
  vendors: any[] = [];
  projectsByClient: any[] = [];
  userAssignForm: FormGroup;
  vendor_id:any;
  assignedUserAfterFilter:any=[];
  unassignedUserAfterFilter:any=[];

  constructor(
      private serverService: ServerService,
      private clipBoardService: ClipBoardService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AssignUserComponent>,
      @Inject(MAT_DIALOG_DATA) public data
  ) {

  }

  ngOnInit() {
      
          this.userAssignForm = this.fb.group({

              user: ""
          });

          this.getAssignedUsersSalesAccount();
  }
  getAssignedUsersSalesAccount() {
    this.serverService
      .getAssignedUsersSalesAccount(this.data.id, this.authToken)
      .subscribe(
        (data) => {
          console.log(data);
          this.assignedUserAfterFilter = data.assigned_users;
          this.unassignedUserAfterFilter = data.unassigned_users;
          // this.getProjects();
        },
        (err) => {
          this.dialogRef.close();
          this.clipBoardService.checkServerError(err, this.authToken);
        }
      );
  }
  assignUser(event) {
    let body = {
      sales_account_id: this.data.id,
      user_id: this.userAssignForm.value.user.id,
    };
    console.log(this.userAssignForm.value.user.id);
    this.assignedUserAfterFilter.push(this.userAssignForm.value.user);
    this.unassignedUserAfterFilter.splice(
      this.userAssignForm.value.user.id
    );
    this.serverService
      .assignedUsersToSalesAccount(body, this.authToken)
      .subscribe(
        (data) => {
          this.clipBoardService.showMessgeInText(
            this.userAssignForm.value.user.name + " Assigned Succesfully",
            "success-snackbar"
          );
          this.userAssignForm.reset();
          this.getAssignedUsersSalesAccount();
        },
        (err) => {
          this.clipBoardService.checkServerError(err, this.authToken);
        }
      );
  }
  removeUser(user,event){
    let body = {
      "user_id": user.id,
      "sales_account_id":this.data.id
  }
  this.serverService.unAssignUsersSalesAccount(body, this.authToken).subscribe(
      data => {
          this.clipBoardService.showMessgeInText("User UnAssigned", "success-snackbar")
          this.userAssignForm.reset();
          this.unassignedUserAfterFilter.push(user);
          this.assignedUserAfterFilter.splice(this.assignedUserAfterFilter.indexOf(user), 1);
          this.getAssignedUsersSalesAccount();
      },err =>{
        this.clipBoardService.checkServerError(err, this.authToken)
      })
  }
  
  close() {
      this.dialogRef.close();
  }




}
