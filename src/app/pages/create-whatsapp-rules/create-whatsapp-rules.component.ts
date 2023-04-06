
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClipBoardService } from '../../services/clipboard.service';
import { ServerService } from '../../services/server.service';
import { MatSnackBar } from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-create-whatsapp-rules',
  templateUrl: './create-whatsapp-rules.component.html',
  styleUrls: ['./create-whatsapp-rules.component.scss']
})
export class CreateWhatsappRulesComponent implements OnInit {

    isShow:boolean=false;

  showAssignUser: boolean = false;
    currentUser: any = JSON.parse(localStorage.getItem("userInfo"));
    assignedUser: any[] = []
    projects: any[] = [];
    whatsappRuleForm: FormGroup;
    action = "";
    statusSpinner: boolean = false;



    // myControl = new FormControl('');
    // whatsappRule = new FormControl('');
    // options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;

    constructor(
        public clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private serverService: ServerService,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialogRef: MatDialogRef<CreateWhatsappRulesComponent>,) {
    }

    ngOnInit() {        
        this.whatsappRuleForm = this.fb.group({
            whatsappRule: [""],
            myControl: [""]
        });
        this.getProjects();
      }

      filter(value: string): string[] {
        const filterValue = value.toLowerCase();    
        return this.projects.filter(option => option.name.toLowerCase().includes(filterValue));
      }

    getProjects() {
        this.serverService.projectsList(localStorage.getItem("token")).subscribe(
            data => {                
                this.projects = data;
                // console.log(this.whatsappRuleForm.get('myControl'));
                this.filteredOptions = this.whatsappRuleForm.get('myControl').valueChanges.pipe(
                    startWith(''),
                    map(value => this.filter(value || '')),
                );
                console.log(this.filteredOptions)

                this.isShow=true;
                this.showAssignUser = true;
            },
            err => {
                
                this.showAssignUser = false;
                this.dialogRef.close();
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    addWhatsappRule() {
        let body = {
            "project_id": this.whatsappRuleForm.value.project.id,
            "name": this.whatsappRuleForm.value.whatsappRule,
        }
        this.serverService.createWhatsappRule(body, localStorage.getItem("token")).subscribe(
            data => {
                
                // 
                this.clipBoardService.whatsappRuleAssignmnetInfo = data;
                this.clipBoardService.showMessgeInText("Rule Created Succesfully", "success-snackbar")
                this.dialogRef.close(data);
                // debugger;
                // this.getProjects();
            },
            err => {
                
                this.showAssignUser = false;
                this.dialogRef.close();
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    close() {
        this.dialogRef.close();
    }
}
