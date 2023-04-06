import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
@Component({
    selector: 'client-project-edit-modal',
    templateUrl: './client-project-edit-modal.component.html',
    styleUrls: ['./client-project-edit-modal.component.scss']
})
export class ClientProjectEditModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public authInfo = JSON.parse(localStorage.getItem("authInfo"));
    btnStatus: boolean = false
    project: any = {}
    editProjectForm: FormGroup;
    amenitie = ""
    amenities: any[] = []
    wowFactor = ""
    connectingRoad = ""
    wowFactors: any[] = []
    connectingRoads: any[] = []
    offers: string = ""
    files: any = []
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientProjectEditModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.editProjectForm = this.fb.group({
            "location": [this.data.location],
            "city": [this.data.city],
            "country": [this.data.country],
            "completion_status": [this.data.completion_status],
            "rera_id":[this.data.rera_id],
            "developer": [this.data.developer],
            "description": [this.data.description],
            "min_price": [this.data.min_price],
            "offers": [this.data.offers],
        })
        this.amenities = this.data.amenities;
        this.connectingRoads = this.data.roads;
        this.wowFactors = this.data.wow_factors;
        if (this.data.brochure != null && this.data.brochure.length != 0) {
            this.files = this.data.brochure
        }
    }

    ngOnInit() { }

    updateProject() {
        this.btnStatus = true;
        let body = {
            "location": this.editProjectForm.value.location,
            "city": this.editProjectForm.value.city,
            "country": this.editProjectForm.value.country,
            "completion_status": this.editProjectForm.value.completion_status,
            "developer": this.editProjectForm.value.developer,
            "description": this.editProjectForm.value.description,
            "min_price": this.editProjectForm.value.min_price,
            "rera_id":this.editProjectForm.value.rera_id,
            "offers": this.editProjectForm.value.offers,
            "amenities": this.amenities,
            "roads": this.connectingRoads,
            "wow_factors": this.wowFactors
        }
        this.serverService.projectUpdateExtraFields(this.data, body, this.authToken).subscribe(
            data => {
                if (this.files.length != 0) {
                    this.uploadBorucher()
                } else {
                    this.btnStatus = false;
                    this.dialogRef.close(data);
                    this.clipBoardService.showMessgeInText("Project Updated Successfully", "success-snackbar")
                }
            },
            err => {

                this.btnStatus = true;
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }


    uploadBorucher() {
        const formData: FormData = new FormData();
        if (this.files != undefined && this.files.length != 0) {
            for (var x = 0; x < this.files.length; x++) {
                if (this.files[x].id == undefined) {
                    formData.append("brochure[]", this.files[x]);
                }
            }
        }
        this.serverService.projectUpdateExtraFields(this.data, formData, this.authToken).subscribe(
            data => {
                this.dialogRef.close(data);
                this.clipBoardService.showMessgeInText("Project Updated Successfully", "success-snackbar")
            },
            err => {
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    addAmenities() {
        if (this.amenitie.trim() != "") {
            this.amenities.push(this.amenitie)
            this.amenitie = ""
        }
    }

    removeAmenities(amenitie): void {
        const index = this.amenities.indexOf(amenitie);
        if (index >= 0) {
            this.amenities.splice(index, 1);
        }
    }

    addConnectingRoad() {
        if (this.connectingRoad.trim() != "") {
            this.connectingRoads.push(this.connectingRoad)
            this.connectingRoad = ""
        }
    }

    removeConnectingRoad(connectingRoad): void {
        const index = this.connectingRoads.indexOf(connectingRoad);
        if (index >= 0) {
            this.connectingRoads.splice(index, 1);
        }
    }

    addWowFactor() {
        if (this.wowFactor.trim() != "") {
            this.wowFactors.push(this.wowFactor)
            this.wowFactor = ""
        }
    }

    removeWowFactor(wowFactor): void {
        const index = this.wowFactors.indexOf(wowFactor);
        if (index >= 0) {
            this.wowFactors.splice(index, 1);
        }
    }

    selectFile(event) {
        let projectBroucher = Array.from(event.target.files);
        projectBroucher.forEach(element => {
            this.files.push(element)
        })
    }

    removeFile(file) {
        const index = this.files.indexOf(file);
        if (index >= 0) {
            this.files.splice(index, 1);
        }
    }
}

