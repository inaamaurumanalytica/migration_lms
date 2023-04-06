import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ClipBoardService } from '../../../services/clipboard.service';
import { ServerService } from '../../../services/server.service'
import { MatSnackBar } from '@angular/material';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
declare var google: any;

@Component({
    selector: 'lead-vendor-updated-modal',
    templateUrl: './lead-vendor-updated-modal.component.html',
    styleUrls: ['./lead-vendor-updated-modal.component.scss']
})
export class LeadVndorUpdatedModalComponent implements OnInit {
    dataSource: any;
    btnStatus: boolean = false
    userInfo: any = JSON.parse(localStorage.getItem("userInfo"));
    authToken: string = localStorage.getItem("token");
    selectedReason1: boolean = true
    selectedReason2: boolean = false
    locations: any[] = []
    newLocations: any[] = []
    location: any = ''
    budget: any = ""
    addressValue: any = []
    newAddressValue: any = []
    projectAddresses: any[] = []
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    possession: any = ""
    remark: any = ""
    projectLocation = {
        "location": "",
        "city": "",
        "zipcode": "",
        "latitude": "",
        "longitude": ""
    }


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

    constructor(private dialog: MatDialog, public clipBoardService: ClipBoardService,
        private serverService: ServerService,
        private dialogRef: MatDialogRef<LeadVndorUpdatedModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit() {
        this.dataSource = this.data;
    }

    ngAfterViewInit() {
        if (this.selectedReason2) {
            this.mapInitializer();
        }
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

    findLocation1(address: string) {
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
                let newBody = address + '||' + this.latitude + ',' + this.longitude
                this.newLocations.push(newBody)
            } else {
                const index = this.locations.indexOf(address);
                if (index >= 0) {
                    this.locations.splice(index, 1);
                }
                setTimeout(() => {
                    this.clipBoardService.showMessgeInText("Sorry, this search produced no results", "error-snackbar")
                })
            }
        });
    }
    // google map end

    yes() {
        this.btnStatus = true
        let body = {
            "id": this.dataSource.id,
            "preferred_location": [],
            "possession": this.possession,
            "budget": ''
        }
        if (!this.selectedReason1) {
            if (this.newAddressValue.length != 0) {
                this.newAddressValue.forEach(el => {
                    body.preferred_location.push(el)
                })
            }
            if (this.newLocations.length != 0) {
                this.newLocations.forEach(el => {
                    body.preferred_location.push(el)
                })
            }
            if (this.budget != undefined && this.budget != '') {
                body.budget = this.budget
            }
            this.serverService.updateLeadPrefLocBudget(body, this.authToken).subscribe(
                data => {
                    this.clipBoardService.showMessgeInText("Your query has been submitted", "success-snackbar")
                    setTimeout(() => {
                        this.dialogRef.close(this.remark)
                        this.btnStatus = false
                    }, 2000)
                },
                err => {
                    this.clipBoardService.checkServerError(err, this.authToken)
                }
            )
        } else {
            this.btnStatus = false
            this.dialogRef.close(this.remark)
        }

    }

    close() {
        this.dialogRef.close();
    }

    selectType(val) {
        if (val == 'Mismatch') {
            this.selectedReason1 = false
            this.selectedReason2 = true
        } else {
            this.selectedReason1 = true
            this.selectedReason2 = false
        }
        this.ngAfterViewInit()
        this.budget = ""
        this.remark = ""
        this.locations = []
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            this.geocoder.geocode({ address: value.trim() }, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    this.locations.push(value.trim());
                    this.changeBudget("")
                    this.addMoreLocation()
                } else {
                    input.value = ''
                    this.clipBoardService.showMessgeInText("Sorry, this search produced no results", "error-snackbar")
                }
            })
        }
        if (input) {
            input.value = '';
        }
    }
    remove(location): void {
        const index = this.locations.indexOf(location);
        if (index >= 0) {
            this.locations.splice(index, 1);
        }
        this.changeBudget("")
        this.addMoreLocation()
    }

    checkStatus() {
        if (this.selectedReason1) {
            return false
        } else {
            if (this.locations.length != 0 || this.addressValue.length != 0 || this.budget != '' || this.possession != "") {
                return false
            } else {
                return true
            }
        }
    }

    addMoreLocation() {
        this.newLocations = []
        this.locations.forEach(element => {
            this.map.setZoom(12)
            this.findLocation1(element);
        });
    }

    changeBudget(event) {
        if (this.budget != "") {
            this.remark = "Looking for Budget is " + this.budget
        }
        if (this.possession != "" && this.budget != "") {
            this.remark += " and Possesion date is " + this.possession
        } else if (this.possession != "" && this.budget == "") {
            this.remark += " Possesion date is " + this.possession
        }
        if (this.locations.length != 0) {
            if (this.locations.length == 1) {
                this.remark += " and also Looking for location is " + this.locations
            } else {
                this.remark += " and also Looking for locations are " + this.locations
            }
        }

    }
}

