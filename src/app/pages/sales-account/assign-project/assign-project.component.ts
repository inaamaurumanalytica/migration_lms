import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ClipBoardService } from "../../../services/clipboard.service";
import { ServerService } from "../../../services/server.service";

@Component({
  selector: "app-assign-project",
  templateUrl: "./assign-project.component.html",
  styleUrls: ["./assign-project.component.scss"],
})
export class AssignProjectComponent implements OnInit {
  authToken: any = localStorage.getItem("token");
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"));

  showAssignProject: boolean = false;
  assignedProject: any[] = [];
  users: any[] = [];
  projects: any[] = [];
  projectsByClient: any[] = [];
  assignedProjects: any[] = [];
  projectAssignForm: FormGroup;
  vendor_id: any;
  assignedProjectAfterFilter: any;
  unassignedProjectAfterFilter: any;
  constructor(
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}
  ngOnInit() {
    this.projectAssignForm = this.fb.group({
      project: "",
    });
    // this.getProjects();
    this.getAssignedProjectsSalesAccount();
  }
  // getProjects() {
 
  //   this.serverService
  //     .getAssignedProjectsSalesAccount(this.data.id, this.authToken)
  //     .subscribe(
  //       (data) => {
  //         this.assignedProjectAfterFilter = data.assigned_projects;
  //         this.unassignedProjectAfterFilter = data.unassigned_projects;
  //         this.projects = data.projects;
  //       },
  //       (err) => {
  //         this.clipBoardService.checkServerError(err, this.authToken);
  //       }
  //     );
  // }

  getAssignedProjectsSalesAccount() {
    this.serverService
      .getAssignedProjectsSalesAccount(this.data.id, this.authToken)
      .subscribe(
        (data) => {
          this.assignedProjectAfterFilter = data.assigned_projects;
          this.unassignedProjectAfterFilter = data.unassigned_projects;
          // this.getProjects();
        },
        (err) => {
          this.dialogRef.close();
          this.clipBoardService.checkServerError(err, this.authToken);
        }
      );
  }
  assignProject(event) {
    let body = {
      sales_account_id: this.data.id,
      project_id: this.projectAssignForm.value.project.id,
    };
    this.assignedProjectAfterFilter.push(this.projectAssignForm.value.project);
    this.unassignedProjectAfterFilter.splice(
      this.projectAssignForm.value.project.id
    );
    this.serverService
      .assignedProjectToSalesAccount(body, this.authToken)
      .subscribe(
        (data) => {
          this.clipBoardService.showMessgeInText(
            this.projectAssignForm.value.project.name + " Assigned Succesfully",
            "success-snackbar"
          );
          this.projectAssignForm.reset();
          this.getAssignedProjectsSalesAccount();
        },
        (err) => {
          this.clipBoardService.checkServerError(err, this.authToken);
        }
      );
  }
  removeProject(project){
    let body = {
      "project_id": project.id,
      "sales_account_id":this.data.id
  }
  this.serverService.unAssignProjectsSalesAccount(body, this.authToken).subscribe(
      data => {
          this.clipBoardService.showMessgeInText("Project UnAssigned", "success-snackbar")
          this.projectAssignForm.reset();
          this.unassignedProjectAfterFilter.push(project);
          this.assignedProjectAfterFilter.splice(this.assignedProjectAfterFilter.indexOf(project), 1);
          this.getAssignedProjectsSalesAccount();
      },err =>{
        this.clipBoardService.checkServerError(err, this.authToken)
      })
  }

  close() {
    this.dialogRef.close();
  }
}
