import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { Papa } from 'ngx-papaparse';
import { ClientLeadFailedModalComponent } from './../client-lead-failed-modal/client-lead-failed-modal.component'
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'client-upload-modal',
    templateUrl: './client-upload-modal.component.html',
    styleUrls: ['./client-upload-modal.component.scss']
})
export class ClientUploadModalComponent implements OnInit {

    userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
    public authToken = localStorage.getItem("token");
    action = "";
    showUnassignedValues: boolean = false
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


    csvData: any[] = []
    dataSource: any[] = []
    csvHeader: any = [];
    displayedColumns1: string[] = ['item', 'cost'];
    fileToUpload: File;
    uploadLeadForm: FormGroup;

    clients: any[] = []
    project: any = {}
    filteredClients: any[] = []
    projects: any[] = []
    projectsByClient: any[] = [];
    filteredProjectsByClient: any[] = []
    projectId: any = ''
    clientId: any = ''
    clientLeadFailedModalComponent: MatDialogRef<ClientLeadFailedModalComponent>
    showUploadForm: boolean = false

    constructor(
        private dialog: MatDialog,
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private _http:HttpClient,
        private papa: Papa,
        private changeDetectorRef: ChangeDetectorRef,
        private dialogRef: MatDialogRef<ClientUploadModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data) {
        if (data == null) {
            this.showUploadForm = true
            this.uploadLeadForm = this.fb.group({
                client: "",
                project: "",
                searchClient: "",
                searchProject: "",
            });
            this.getAllClients();
            this.getAllProjects();
            this.project = null
        } else {
            this.project = this.data
            this.projectId = this.data.id
            this.clientId = this.data.client_id
        }
    }

    ngOnInit() {
    }

    getAllClients() {
        this.serverService.clientsList(this.authToken).subscribe(
            data => {
                this.clients = data.client.filter(ele => ele.disable == false);
                this.filteredClients = data.client.filter(ele => ele.disable == false);
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    getAllProjects() {
        this.serverService.projectsList(this.authToken).subscribe(
            data => {
                this.projects = data;
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    changeByClient() {
        this.uploadLeadForm.controls.searchClient.setValue('')
        this.uploadLeadForm.controls.searchProject.setValue('')
        let clientId = this.uploadLeadForm.value.client.id;
        this.projectsByClient = this.projects.filter(ele => ele.disable == false && ele.client_id == clientId);
        this.filteredProjectsByClient = this.projectsByClient
        this.onKeyClient('')
    }

    changeByproject() {
        this.uploadLeadForm.controls.searchClient.setValue('')
        this.uploadLeadForm.controls.searchProject.setValue('')
        this.onKeyProject('')
    }

    onKeyProject(val) {
        let filter = val.toLowerCase();
        this.filteredProjectsByClient = this.projectsByClient.filter(option => option.name.toLowerCase().includes(filter));
    }

    onKeyClient(val) {
        let filter = val.toLowerCase();
        this.filteredClients = this.clients.filter(option => option.name.toLowerCase().includes(filter));
    }

    onFocusOutEvent(event) {
        this.uploadLeadForm.controls.searchClient.setValue('')
        this.uploadLeadForm.controls.searchProject.setValue('')
        this.onKeyProject('')
        this.onKeyClient('')
    }


    close() {
        if (this.submitStatus) {
            this.dialogRef.close("Data")
        } else {
            this.dialogRef.close();
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
                    { name: "Name", keyName: "name", value: "", newValue: "" },
                    { name: "Source", keyName: "source", value: "", newValue: "" },
                    { name: "Email", keyName: "email", value: "", newValue: "" },
                    { name: "Phone", keyName: "phone", value: "", newValue: "" },
                    { name: "Budget", keyName: "budget", value: "", newValue: "" },
                    { name: "Vendor Remark", keyName: "vendor_remark", value: "", newValue: "" },
                    { name: "Lead Status", keyName: "lead_status", value: "", newValue: "" },
                    { name: "Lead State", keyName: "lead_state", value: "", newValue: "" },
                    { name: "Score", keyName: "score", value: "", newValue: "" }
                ]
                this.dataSource.forEach((elm, index) => {
                    this.csvHeader.forEach(element => {
                        var val = element.toLowerCase()
                        if (elm.keyName == val) {
                            this.dataSource[index].newValue = element
                            this.dataSource[index].value = element
                        }
                    })
                })
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
        this.modalLoader = true;
        this.showUnassignedValues = false
        for (var i = 0; i < this.dataSource.length; i++) {
            if (this.dataSource[i].value != undefined && this.dataSource[i].value == "") {
                this.showUnassignedValues = true
                this.clipBoardService.showMessgeInText(this.dataSource[i].name + ' is not assigned', 'error-snackbar')
                break
            }

        }

        if (this.showUnassignedValues) {
            this.modalLoader = false;
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
        if (this.project == null) {
            formData.append('project_id', this.uploadLeadForm.value.project.id);
            formData.append('client_id', this.uploadLeadForm.value.client.id);
        } else {
            formData.append('project_id', this.project.id);
            formData.append('client_id', this.project.client_id);
        }
        this.serverService.uploadLead(formData, this.authToken).subscribe(
            data => {
                this.modalLoader = false;
                if (data.failed_leads.length != 0) {
                    this.clientLeadFailedModalComponent = this.dialog.open(ClientLeadFailedModalComponent, {
                        hasBackdrop: true,
                        disableClose: false,
                        autoFocus: true,
                        width: '100%',
                        maxWidth: '100vw',
                        panelClass: 'cdk-overlay-panel-right-side',
                        data: data.failed_leads
                    });
                    if (data.count == 0) {
                        this.clipBoardService.showMessgeInText("Leads Not Uploaded", "success-snackbar")
                    } else {
                        this.submitStatus = true
                        this.clipBoardService.showMessgeInText(data.count + " leads are Uploaded Successfully. But few leads are not uploaded", "success-snackbar")
                    }

                } else {
                    this.clipBoardService.showMessgeInText("Lead Uploaded Successfully", "success-snackbar")
                    this.dialogRef.close(data)
                }
            },
            err => {
                this.modalLoader = false;
                this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
            }
        )
    }

    onSave() {
        this._http.get('assets/sample.csv', { responseType: "blob", headers: { 'Accept': 'application/vnd.ms-excel' } })
          .subscribe(blob => {
            saveAs(blob, 'sample.csv');
          });
      }

}

