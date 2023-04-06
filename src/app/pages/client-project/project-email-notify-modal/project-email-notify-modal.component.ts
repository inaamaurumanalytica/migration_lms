import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import { Router } from '@angular/router';
declare var google: any;

@Component({
    selector: 'project-email-notify-modal',
    templateUrl: './project-email-notify-modal.component.html',
    styleUrls: ['./project-email-notify-modal.component.scss']
})
export class ProjectEmailNotifyModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    public authInfo = JSON.parse(localStorage.getItem("authInfo"));
    btnStatus: boolean = false
    project: any = {}
    createProjectForm: FormGroup;
    emails: any[] = []
    clients: any[] = []

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;

    mapView: boolean = true
    @ViewChild("mapContainer", { static: false }) gmap: ElementRef;
    map: any
    latLng: any
    geocoder: any;
    marker: any;
    infowindow: any

    address: any = ""

    latitude: any = '20.5937'
    longitude: any = '78.9629'
    latLngCoords: boolean = false



    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ProjectEmailNotifyModalComponent>,
        private router:Router,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.createProjectForm = this.fb.group({
            "name": [this.data.name, Validators.required],
            "location": [""],
            "email": [""],
            "project_type": [this.data.project_type, Validators.required],
            "possession": [this.data.possession != null && this.data.possession != '' ? this.data.possession.substring(0, this.data.possession.indexOf('T')) : '', Validators.required],
            "min_price": [this.data.min_price, Validators.required],
            "latitude": [this.data.latitude, Validators.required],
            "longitude": [this.data.longitude, Validators.required],
        })

        this.latitude = this.data.latitude
        this.longitude = this.data.longitude
        this.latLngCoords = true
        this.emails = this.data.emails_to_notify_on_form_submit;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.mapInitializer();
    }

    // google map
    mapInitializer() {
        this.geocoder = new google.maps.Geocoder();
        this.latLng = new google.maps.LatLng(this.latitude, this.longitude);
        this.infowindow = new google.maps.InfoWindow();
        let mapOptions = {
            center: this.latLng,
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.marker = new google.maps.Marker({
            position: this.latLng,
            map: this.map
        });
        setTimeout(() => {
            this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
            this.marker.setMap(this.map);
        })
    }

    locateAddressOnMap() {
        if (this.createProjectForm.value.location != '') {
            this.map.setZoom(15);
            this.address = this.createProjectForm.value.location;
            this.findLocation(this.address);
        }
    }

    findLocation(address: string) {
        if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
        this.geocoder.geocode({ address: address }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
                this.marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: this.map,
                    draggable: true
                });
                this.map.setCenter(results[0].geometry.location);
                this.infowindow.setContent(results[0].formatted_address);
                this.infowindow.open(this.map, this.marker);
                this.latitude = results[0].geometry.location.lat();
                this.longitude = results[0].geometry.location.lng();
                this.latLngCoords = true;
                this.marker.addListener("dragend", event => {
                    this.latitude = event.latLng.lat();
                    this.longitude = event.latLng.lng();
                });
                this.createProjectForm.controls.latitude.setValue(this.latitude)
                this.createProjectForm.controls.longitude.setValue(this.longitude)
            } else {
                this.createProjectForm.controls.latitude.setValue("")
                this.createProjectForm.controls.longitude.setValue("")
                this.clipBoardService.showMessgeInText("Sorry, this search produced no results", "error-snackbar")
                this.latLngCoords = false;
            }
        });
    }

    clearMap() {
        this.createProjectForm.controls.location.setValue('')
        this.createProjectForm.controls.latitude.setValue('')
        this.createProjectForm.controls.longitude.setValue('')
        this.latitude = '20.5937'
        this.longitude = '78.9629'
        this.latLngCoords = false
        if (this.mapView) {
            this.mapInitializer()
        }
    }

    // google map end

    update() {
        let body = {
            "name": this.createProjectForm.value.name,
            "emails_to_notify_on_form_submit": this.emails,
            "possession": this.createProjectForm.value.possession,
            "client_id": this.data.client_id,
            "project_type": this.createProjectForm.value.project_type,
            "min_price": this.createProjectForm.value.min_price,
            "latitude": this.createProjectForm.value.latitude,
            "longitude": this.createProjectForm.value.longitude
        }
        this.btnStatus = true
        this.serverService.updateProject(this.data, body, this.authToken).subscribe(
            data => {
                this.btnStatus = false
                this.clipBoardService.showMessgeInText('Project Updated Successfully', 'success-snackbar')    
                this.dialogRef.close(data)
            },
            err => {
                this.btnStatus = false
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    addEmails() {
        if (this.createProjectForm.value.email.trim() != '') {
            if (!this.validateEmail(this.createProjectForm.value.email.trim())) {
                this.clipBoardService.showMessgeInText("Email Not valid", "error-snackbar")
                return;
            }
            this.emails.push(this.createProjectForm.value.email)
            this.createProjectForm.controls['email'].setValue('');
        }
    }

    removeEmails(email): void {
        const index = this.emails.indexOf(email);
        if (index > -1) {
            this.emails.splice(index, 1);
        }
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    changeView(event) {
        this.createProjectForm.controls.location.setValue('')
        this.createProjectForm.controls.latitude.setValue(this.latitude)
        this.createProjectForm.controls.longitude.setValue(this.longitude)
        this.mapInitializer()
        this.mapView = event.checked
    }
    save(){
        console.log("hi")
    }
}

