import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog, getMatFormFieldDuplicatedHintError } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service';
import { DeleteProjectStatusModalComponent } from '../delete-project-status-modal/delete-project-status-modal.component';

@Component({
  selector: 'app-project-media-plan',
  templateUrl: './project-media-plan.component.html',
  styleUrls: ['./project-media-plan.component.scss']
})
export class ProjectMediaPlanComponent implements OnInit {

  authToken = localStorage.getItem("token");
  btnStatus: boolean = false
  mediaForm: FormGroup;
  showErrorSuccess = false
  getTotalLeadsVar: any[] = [];
  getTotalBudgetVar: any[] = [];
  totalBudget: any = 0;
  totalLeads: any = 0;
  totalCPL: any = 0;
  mediaArr: any = [];
  mediaObj: any = {};
  cpl: any[] = [];


  isUpdate: boolean = false;

  constructor(
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ProjectMediaPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {

  }

  ngOnInit() {
    this.mediaForm = this.fb.group({
      totalBudget: [''],
      totalLeads: [''],
      totalCpl: [''],
      data: this.fb.array([])
    })
    this.getMedia()
  }


  gettotalBudget(event: any, i: any) {
    this.getTotalBudgetVar[i] = event.target.value;
    this.totalBudget = this.getTotalBudgetVar.reduce((total, num) => Number(total) + Number(num));
    // this.mediaForm.controls['totalBudget'].patchValue(this.totalBudget)
    // this.mediaForm.controls['totalCpl'].patchValue((this.totalBudget/this.totalLeads))
    this.cpl[i] = (this.getTotalBudgetVar[i] / this.getTotalLeadsVar[i]).toFixed(2)
    this.totalCPL = (this.totalBudget / this.totalLeads).toFixed(2)


  }

  gettotalLeads(event: any, i: any) {
    this.getTotalLeadsVar[i] = event.target.value;
    this.totalLeads = this.getTotalLeadsVar.reduce((total, num) => Number(total) + Number(num));
    // this.mediaForm.controls['totalLeads'].patchValue(this.totalLeads)
    // this.mediaForm.controls['totalCpl'].patchValue((this.totalBudget/this.totalLeads))
    // get cpl 
    this.cpl[i] = (this.getTotalBudgetVar[i] / this.getTotalLeadsVar[i]).toFixed(2)
    this.totalCPL = (this.totalBudget / this.totalLeads).toFixed(2)
  }




  // create media plan 
  saveMediaForm() {
    console.log(this.mediaForm.value)

    let body = {
      project_id: this.data.id,
      media_plan_entries: this.mediaForm.value.data
    }
    this.serverService.addMediaPlan(body, this.authToken).subscribe(
      data => {
        this.snackBar.open("Media Plan Created Successfully", '', {
          duration: 1000,
          verticalPosition: 'top',
          horizontalPosition: 'end',
          panelClass: 'blue-snackbar'
        })
        this.btnStatus = false
        this.dialogRef.close(data)
      },
      err => {
        this.btnStatus = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  // update media plan

  updateMediaForm() {
    var mediaArr1: any = []
    var mediaObj1 = {}

    var mediaArr2: any = []
    var mediaObj2 = {}

    this.mediaForm.value.data.forEach((item) => {

      if (item.id != '' && item.id != null) {
        mediaObj1 = {}
        mediaObj1['id'] = item.id
        mediaObj1['amount'] = item.amount
        mediaObj1['campaign_type'] = item.campaign_type
        mediaObj1['no_of_leads'] = item.no_of_leads
        mediaObj1['entry_type'] = item.entry_type
        mediaArr1.push(mediaObj1)
      }

      if (item.id == '' || item.id == null) {
        mediaObj2 = {}
        mediaObj2['amount'] = item.amount
        mediaObj2['campaign_type'] = item.campaign_type
        mediaObj2['no_of_leads'] = item.no_of_leads
        mediaObj2['entry_type'] = item.entry_type
        mediaArr2.push(mediaObj2)
      }

    })

    if (mediaArr1.length) {
      let body = {
        project_id: this.data.id,
        media_plan_entries: mediaArr1
      }
      this.serverService.updateMediaPlan(body, this.authToken).subscribe(
        data => {
          this.snackBar.open("Media Plan Updated Successfully", '', {
            duration: 1000,
            verticalPosition: 'top',
            horizontalPosition: 'end',
            panelClass: 'blue-snackbar'
          })
          this.btnStatus = false
          this.dialogRef.close(data)
        },
        err => {
          this.btnStatus = false
          this.clipBoardService.checkServerError(err, this.authToken)
        }
      )
    }

    if (mediaArr2.length) {
      let body = {
        project_id: this.data.id,
        media_plan_entries: mediaArr2
      }

      this.serverService.addMediaPlan(body, this.authToken).subscribe(
        data => {
          this.snackBar.open("Media Plan Created Successfully", '', {
            duration: 1000,
            verticalPosition: 'top',
            horizontalPosition: 'end',
            panelClass: 'blue-snackbar'
          })
          this.btnStatus = false
          this.dialogRef.close(data)
        },
        err => {
          this.btnStatus = false
          this.clipBoardService.checkServerError(err, this.authToken)
        }
      )
    }

  }



  // add more entries in media plan

  addMore() {
    const add = this.mediaForm.get('data') as FormArray;
    add.push(
      this.fb.group({
        id: [''],
        campaign_type: [''],
        amount: [''],
        no_of_leads: [''],
        costperLead: [''],
        entry_type: ['']

      })
    )
    this.changeDetectorRef.detectChanges()
  }
  // get media plan

  getMedia() {
    this.serverService.getMediaPlan(this.data.id, this.authToken).subscribe(
      data => {
        var mediaData = data
        if (data.length) {
          this.isUpdate = true;
          data.forEach((item) => {
            this.mediaObj = {}
            this.mediaObj['id'] = item.id
            this.mediaObj['amount'] = item.amount
            this.mediaObj['campaign_type'] = item.campaign_type
            this.mediaObj['no_of_leads'] = item.no_of_leads
            this.mediaObj['entry_type'] = item.entry_type
            this.mediaObj['costperLead'] = (item.amount / item.no_of_leads).toFixed(2)

            this.mediaArr.push(this.mediaObj)

            this.getTotalBudgetVar.push(item.amount)
            this.getTotalLeadsVar.push(item.no_of_leads)

            this.totalBudget = this.getTotalBudgetVar.reduce((total, num) => Number(total) + Number(num));
            this.totalLeads = this.getTotalLeadsVar.reduce((total, num) => Number(total) + Number(num));
            this.totalCPL = (this.totalBudget / this.totalLeads).toFixed(2)


            // this.mediaForm.controls['totalBudget'].patchValue(this.totalBudget)
            // this.mediaForm.controls['totalLeads'].patchValue(this.totalLeads)
            // this.mediaForm.controls['totalCpl'].patchValue((this.totalBudget/this.totalLeads).toFixed(2))  

          })

          if (data.length > 4) {
            for (var i = 0; i < data.length; i++) {
              this.addMore()
            }
          } else {
            for (var i = 0; i < 4; i++) {
              this.addMore()
            }
          }

          this.mediaForm.controls['data'].patchValue(this.mediaArr)

        } else {
          this.isUpdate = false;
          for (var i = 0; i < 4; i++) {
            this.addMore()
          }
        }

      },
      err => {
        this.btnStatus = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  // close media plan 
  close() {
    this.dialogRef.close();
  }

  // delete media plan entries

  delete(index, entry_id) {
    if (entry_id != undefined || entry_id != null) {
      this.serverService.deleteMediaPlanEntry(entry_id, this.authToken).subscribe(
        data => {
          this.snackBar.open("Media Plan Delete Successfully", '', {
            duration: 1000,
            verticalPosition: 'top',
            horizontalPosition: 'end',
            panelClass: 'blue-snackbar'
          })
          this.getTotalBudgetVar = [''],
            this.getTotalLeadsVar = [''],
            this.mediaArr = []
          this.mediaForm.reset()

          this.serverService.getMediaPlan(this.data.id, this.authToken).subscribe(
            data => {
              var mediaData = data
              //console.log(mediaData)
              if (data.length) {
                this.isUpdate = true;
                data.forEach((item, i) => {
                  this.mediaObj = {}
                  this.mediaObj['id'] = item.id
                  this.mediaObj['amount'] = item.amount
                  this.mediaObj['campaign_type'] = item.campaign_type
                  this.mediaObj['no_of_leads'] = item.no_of_leads
                  this.mediaObj['entry_type'] = item.entry_type
                  this.mediaObj['costperLead'] = (item.amount / item.no_of_leads).toFixed(2)

                  this.mediaArr.push(this.mediaObj)

                  this.getTotalBudgetVar[i] = item.amount
                  this.getTotalLeadsVar[i] = item.no_of_leads

                  this.totalBudget = this.getTotalBudgetVar.reduce((total, num) => Number(total) + Number(num));
                  this.totalLeads = this.getTotalLeadsVar.reduce((total, num) => Number(total) + Number(num));
                  // console.log(this.totalBudget)
                  this.totalCPL = this.totalBudget / this.totalLeads


                })

                this.mediaForm.controls['data'].patchValue(this.mediaArr)
                // this.mediaForm.controls['totalBudget'].patchValue(this.totalBudget)
                // this.mediaForm.controls['totalLeads'].patchValue(this.totalLeads)
                // this.mediaForm.controls['totalCpl'].patchValue((this.totalBudget/this.totalLeads).toFixed(2)) 
              }

            },
            err => {
              this.btnStatus = false
              this.clipBoardService.checkServerError(err, this.authToken)
            }
          )
          // this.btnStatus = false
          // this.dialogRef.close(data)
        },
        err => {
          this.btnStatus = false
          this.clipBoardService.checkServerError(err, this.authToken)
        }
      )
    }

    const arr = <FormArray>this.mediaForm.controls.data;
    arr.removeAt(index);

    this.cpl.splice(index, index)

    if (this.getTotalBudgetVar[index] != undefined) {
      this.totalBudget = this.totalBudget - this.getTotalBudgetVar[index];
      this.getTotalBudgetVar.splice(index, index);
      this.cpl[index]=''
      this.totalCPL = (this.totalBudget / this.totalLeads).toFixed(2)

    }
    if (this.getTotalLeadsVar[index] != undefined) {
      this.totalLeads = this.totalLeads - this.getTotalLeadsVar[index];
      this.getTotalLeadsVar.splice(index, index);
      this.cpl[index]=''
      this.totalCPL = (this.totalBudget / this.totalLeads).toFixed(2)

    }



  }



}
