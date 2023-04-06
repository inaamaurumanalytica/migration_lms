import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { Papa } from 'ngx-papaparse';

@Component({
    selector: 'project-feedback-modal',
    templateUrl: './project-feedback-modal.component.html',
    styleUrls: ['./project-feedback-modal.component.scss']
})
export class ProjectFeedbackModalComponent implements OnInit {
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
    public authToken = localStorage.getItem("token");
    action = "";
    submitStatus: boolean = false
    sources: any[] = []
    leadTypes: any = []
    leadGen: any[] = []
    selectChannelPartner: any = ""
    selectType: any = ""
    selectSource: any = ""
    selectGeneration: any = ""
    selectLeadStatus: any
    btnStatus: boolean = false
    showBtn: boolean = false
    modalLoader: boolean = false
    channelPartners: any[] = []
    leadStatuses: any[] = []

    showUnassignedValues: boolean = false

    csvData: any[] = []
    dataSource: any[] = []
    csvHeader: any = [];
    displayedColumns1: string[] = ['item', 'cost'];
    fileToUpload: File;
    count: number = 0
    followTatChecked: boolean = true

    constructor(
        private dialog: MatDialog,
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private papa: Papa,
        private changeDetectorRef: ChangeDetectorRef,
        private dialogRef: MatDialogRef<ProjectFeedbackModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
    }

    ngOnInit() {
    }


    close() {
        if (this.count == 0) {
            this.dialogRef.close();
        } else {
            this.dialogRef.close("Leads Upload");
        }
    }

    clear() {
        this.showBtn = false
        this.selectChannelPartner = ''
        this.selectSource = ''
        this.selectType = ''
        this.leadGen = []
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
        this.papa.parse(this.fileToUpload, {
            complete: result => {
                this.csvData = result.data;
                this.csvHeader = result.data[0]
                this.dataSource = [
                    { name: "Email", keyName: "email", value: "", newValue: "" },
                    { name: "Phone", keyName: "phone", value: "", newValue: "" },
                    { name: "Client Remark", keyName: "client_remark", value: "", newValue: "" },
                    { name: "Lead Status", keyName: "lead_status", value: "", newValue: "" }]
                this.dataSource.forEach((elm, index) => {
                    this.csvHeader.forEach(element => {
                        var val = element.toLowerCase()
                        if (elm.keyName == val) {
                            this.dataSource[index].newValue = element
                            this.dataSource[index].value = element
                        }
                    })
                });
            }
        });



    }

    onSelection(elmn, index) {
        for (let i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].newValue == elmn.value) {
                this.clipBoardService.showMessgeInText(elmn.value + ' is already assigned to ' + this.dataSource[i].name, "error-snackbar")
                setTimeout(() => {
                    elmn.value = elmn.newValue
                    this.dataSource[index].value = elmn.newValue;
                    this.changeDetectorRef.detectChanges()
                })
                break;
            }
        }
        setTimeout(() => {
            elmn.newValue = elmn.value;
        });
    }

    uploadFileToActivity() {
        this.btnStatus = true;
        this.showUnassignedValues = false
        for (var i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].value != undefined && this.dataSource[i].value == "") {
                this.showUnassignedValues = true
                this.clipBoardService.showMessgeInText(this.dataSource[i].name + ' is not assigned', "success-snackbar")
                break
            }

        }

        if (this.showUnassignedValues) {
            this.btnStatus = false;
            return
        }
        let newCsvHeaders = Object.assign([], this.csvHeader)
        this.dataSource.forEach((elm) => {
            if (elm.value != "") {
                this.csvHeader.forEach((element, index) => {
                    if (element == elm.value) {
                        newCsvHeaders[index] = elm.keyName;
                    }
                });
            }
        })
        this.csvData[0] = newCsvHeaders;

        var csvContent = this.papa.unparse(this.csvData);
        var csvBlobData = new Blob([csvContent], { type: 'text/csv' });
        const formData: FormData = new FormData();
        formData.append('file', csvBlobData, this.fileToUpload.name);
        formData.append('follow_tat', JSON.stringify(this.followTatChecked));
        formData.append('project_id', this.data.id);


        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();
        let filename = this.data.name + "-feedback-" + dd + "-" + mm + "-" + yyyy + ".csv";
        let csvContent1 = "";
        this.serverService.bulkUpdateLeads(formData, localStorage.getItem("token")).subscribe(
            data => {
                this.clipBoardService.showMessgeInText('Feedback Updated Successfully. Please check downloaded CSV', "success-snackbar")
                var csvData1 = new Blob([csvContent1 + data._body], { type: "text/csv" });
                var csvUrl = URL.createObjectURL(csvData1);
                var link = document.createElement("a");
                link.setAttribute("href", csvUrl);
                link.setAttribute("id", "csvUrl");
                link.setAttribute("download", filename);
                link.innerHTML = "Click Here to download";
                document.body.appendChild(link);
                link.click();
                setTimeout(() => {
                    document.getElementById("csvUrl").remove()
                }, 1000)
                this.dialogRef.close();
                this.btnStatus = false;
            },
            err => {
                this.btnStatus = false;
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    followTAT(event) {
        this.followTatChecked = event.checked
    }

}

