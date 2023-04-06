import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import * as moment from 'moment'
@Component({
    selector: 'client-project-info-modal',
    templateUrl: './client-project-info-modal.component.html',
    styleUrls: ['./client-project-info-modal.component.scss']
})
export class ClientProjectInfoModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public authInfo = JSON.parse(localStorage.getItem("authInfo"));
    btnStatus: boolean = false
    project: any = {}
    editProjectForm: FormGroup;
    email = "";
    emails: any[] = []
    amenitie = ""
    minPrice: string = ""
    maxPrice: string = ""
    amenities: any[] = []
    wowFactor = ""
    connectingRoad = ""
    wowFactors: any[] = []
    connectingRoads: any[] = []
    offers: string = ""
    files: any = []
    location = ""
    city = ""
    name = ""
    country = ""
    propertyType = "";
    unitPlan = "";
    developer = "";
    completionStatus = ""
    description = ""
    clients: any[] = []
    showAdvance: boolean = false
    leadExpiry: any
    sms: any;
    projectType:any;
    inventoryType:any;
    possessionRowDate:any;
    possessionDate:any;
    campaignDuration:any;
    NumberOfLeads:any;
    buyerPersonaSheet;any;
    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientProjectInfoModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        //console.log(this.data)
        this.name = this.data.name
        this.leadExpiry = this.data.lead_expiry
        this.files = this.data.brochure
        this.location = this.data.location
        this.city = this.data.city
        this.country = this.data.country
        this.completionStatus = this.data.completion_status
        this.developer = this.data.developer
        this.description = this.data.description
        this.minPrice = this.data.min_price
        this.maxPrice = this.data.max_price
        this.offers = this.data.offers
        this.amenities = this.data.amenities
        this.connectingRoads = this.data.roads
        this.wowFactors = this.data.wow_factors
        this.sms = this.data.sms_text
        this.projectType = this.data.project_type

        this.inventoryType = this.data.inventory
        
        this.campaignDuration = this.data.campaign_days
        this.NumberOfLeads = this.data.campaign_leads_to_be_generated
        this.buyerPersonaSheet = this.data.buyer_persona_sheet

        this.possessionRowDate = this.data.possession
        this.possessionDate = moment(this.possessionRowDate).format('DD-MM-YYYY');
        //console.log(this.possessionDate); 

    }

    ngOnInit() { }

    close() {
        this.dialogRef.close();
    }
}

