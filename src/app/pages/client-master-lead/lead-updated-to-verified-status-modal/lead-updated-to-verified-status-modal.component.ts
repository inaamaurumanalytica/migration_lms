import { ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatChipInputEvent } from "@angular/material";
import { ServerService } from 'src/app/services/server.service';
import { ClipBoardService } from '../../../services/clipboard.service';
declare var google: any

@Component({
    selector: 'lead-updated-to-verified-status-modal',
    templateUrl: './lead-updated-to-verified-status-modal.component.html',
    styleUrls: ['./lead-updated-to-verified-status-modal.component.scss']
})
export class LeadUpdatedToVerifiedStatusModalComponent implements OnInit, AfterViewInit {
    dataSource: any;
    action = 'exit'
    btnStatus: boolean = false
    currentUser: any = JSON.parse(localStorage.getItem("user"));
    authToken: string = localStorage.getItem("token");
    possession: any = ""
    budget: any = ""
    remark: any = ""
    project: any = ""
    address: any = ""
    bhk: any[] = []
    bhkType = {
        one: false,
        oneFive: false,
        two: false,
        twoFive: false,
        three: false,
        threeFive: false,
        four: false,
        fourFive: false,
        five: false,
        fiveFive: false,
        six: false,
        sixPlus: false,
        shop: false,
        office: false,
        plot: false,
        studio: false
    }

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    @ViewChild("mapContainer", { static: true }) gmap: ElementRef;
    map: any
    latLng: any
    geocoder: any;
    marker: any;
    infowindow: any
    latitude: any = '20.5937'
    longitude: any = '78.9629'
    latLngCoords: boolean = false
    location: any = ""
    locations: any[] = []
    readonly separatorKeysCodes: number[] = [ENTER];
    newLocations: any[] = []
    constructor(
        public clipBoardService: ClipBoardService,
        private snackBar: MatSnackBar,
        private serverService: ServerService,
        private dialogRef: MatDialogRef<LeadUpdatedToVerifiedStatusModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit() {
        this.project = this.clipBoardService.projectInfo
        this.dataSource = this.data;
        if(Object.keys(this.project).length !== 0){
            this.location = this.project.location
            this.latitude = this.project.latitude
            this.longitude = this.project.longitude
            this.locations.push(this.project.location)
            this.newLocations.push(this.project.location + '||' + this.latitude + ',' + this.longitude)
        }
        this.changeBudget()
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
            zoom: 10,
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
                    this.snackBar.open("Sorry, this search produced no results", this.action, {
                        duration: 2000,
                        verticalPosition: 'top',
                        horizontalPosition: 'end',
                        panelClass: 'blue-snackbar'
                    })
                })
            }
        });
    }
    // google map end

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            if (!this.geocoder) this.geocoder = new google.maps.Geocoder();
            this.geocoder.geocode({ address: value.trim() }, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    this.locations.push(value.trim());
                    this.addMoreLocation()
                } else {
                    input.value = ''
                    this.snackBar.open("Sorry, this search produced no results", this.action, {
                        duration: 2000,
                        verticalPosition: 'top',
                        horizontalPosition: 'end',
                        panelClass: 'blue-snackbar'
                    })
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
        this.addMoreLocation()
    }

    addMoreLocation() {
        this.newLocations = []
        this.locations.forEach(element => {
            this.map.setZoom(12)
            this.findLocation1(element);
        });
    }

    selectType(event, element) {
        if (event.checked) {
            this.bhk.push(element);
        } else {
            let index = this.bhk.indexOf(element);
            if (index > -1) {
                this.bhk.splice(index, 1);
            }
        }
        this.changeBudget()
    }

    yes() {
        this.btnStatus = true
        let body = {
            "id": this.dataSource.id,
            "preferred_location": this.newLocations,
            "possession": "31-12-" + this.possession,
            "budget": this.budget,
            "tags": this.bhk
        }
        this.serverService.updateLeadPrefLocBudget(body, this.authToken).subscribe(
            data => {
                this.snackBar.open("Your query has been submitted", this.action, {
                    duration: 2000,
                    verticalPosition: 'top',
                    horizontalPosition: 'end',
                    panelClass: 'blue-snackbar'
                })
                setTimeout(() => {
                    this.dialogRef.close(this.remark)
                    this.btnStatus = false
                }, 2000)
            },
            err => {
                this.btnStatus = true
                this.clipBoardService.checkServerError(err, this.authToken)
            }
        )
    }

    close() {
        this.dialogRef.close();
    }

    checkStatus() {

        if (this.budget != '' && this.possession != "" && this.bhk.length != 0 && this.newLocations.length != 0 && this.remark.trim() != '') {
            return false
        } else {
            return true
        }
    }

    changeBudget() {
        this.remark = ""
        if (this.budget != "") {
            this.remark += "Budget : " + this.budget
        }
        if (this.possession != "") {
            this.remark += " | Possession : " + this.possession
        }
        if (this.bhk.length != 0) {
            this.remark += " | BHK : " + this.bhk
        }
    }

    selectBHKType() {
        this.bhk = []
        if (this.bhkType.one) {
            this.bhk.push("1 BHK")
        }
        if (this.bhkType.oneFive) {
            this.bhk.push("1.5 BHK")
        }
        if (this.bhkType.two) {
            this.bhk.push("2 BHK")
        }
        if (this.bhkType.twoFive) {
            this.bhk.push("2.5 BHK")
        }
        if (this.bhkType.three) {
            this.bhk.push("3 BHK")
        }
        if (this.bhkType.threeFive) {
            this.bhk.push("3.5 BHK")
        }
        if (this.bhkType.four) {
            this.bhk.push("4 BHK")
        }
        if (this.bhkType.fourFive) {
            this.bhk.push("4.5 BHK")
        }
        if (this.bhkType.five) {
            this.bhk.push("5 BHK")
        }
        if (this.bhkType.fiveFive) {
            this.bhk.push("5.5 BHK")
        }
        if (this.bhkType.six) {
            this.bhk.push("6 BHK")
        }
        if (this.bhkType.sixPlus) {
            this.bhk.push("6+ BHK")
        }
        if (this.bhkType.shop) {
            this.bhk.push("Shop")
        }
        if (this.bhkType.office) {
            this.bhk.push("Office")
        }
        if (this.bhkType.plot) {
            this.bhk.push("Plot")
        }
        if (this.bhkType.studio) {
            this.bhk.push("Studio")
        }
        this.changeBudget()
    }
}

