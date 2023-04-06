import { Component, ElementRef, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipBoardService } from 'src/app/services/clipboard.service';
import { ServerService } from 'src/app/services/server.service';
declare var google: any;
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-lead-request',
  templateUrl: './lead-request.component.html',
  styleUrls: ['./lead-request.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LeadRequestComponent implements OnInit, AfterViewInit {

  authToken: any = localStorage.getItem("token")
  project: any = JSON.parse(localStorage.getItem("projectInfo"))
  projectId: any;

  create: FormGroup;
  isSubmit: boolean = false;
  isDisabled: boolean = true;

  chipArr: any[] = [];

  fileTobeUpload: any[] = [];
  attachName: any[]=[];
  attachURL: any[] = [];
  fileAttachId: any[] = []
  delPicId: any[] = []

  fileTobeUploadBP: any;
  attachNameBP: any;

  latitude: number = 28.724985429746;
  longitude: number = 76.90370967526371;
  // zoom: number;
  address: string;
  searchText: string;
  @ViewChild("mapContainer", { static: false }) gmap: ElementRef;
  map: any;
  mapError: boolean = false;
  latLng: any;
  geocoder: any;
  marker: any;
  infowindow: any;

  allBuilder: any;
  allProject: any;

  @ViewChild("loc", { static: false }) loc: ElementRef;

  showComponentLoader: boolean = true

  builderControl = new FormControl();
  projectControl = new FormControl();

  options: any[] = [];
  options2: any[];

  filteredOptions: Observable<string[]>;
  filteredOptions2: Observable<string[]>;

  minBudgetValue: any;
  maxBudgetValue: any;
  budgetValue: any = [
    { id: 1, value: 500000, name: '5 Lacs' },
    { id: 2, value: 1000000, name: '10 Lacs' },
    { id: 3, value: 1500000, name: '15 Lacs' },
    { id: 4, value: 2000000, name: '20 Lacs' },
    { id: 5, value: 2500000, name: '25 Lacs' },
    { id: 6, value: 3000000, name: '30 Lacs' },
    { id: 7, value: 3500000, name: '35 Lacs' },
    { id: 8, value: 4000000, name: '40 Lacs' },
    { id: 9, value: 4500000, name: '45 Lacs' },
    { id: 10, value: 5000000, name: '50 Lacs' },
    { id: 11, value: 5500000, name: '55 Lacs' },
    { id: 12, value: 6000000, name: '60 Lacs' },
    { id: 13, value: 6500000, name: '65 Lacs' },
    { id: 14, value: 7000000, name: '70 Lacs' },
    { id: 15, value: 7500000, name: '75 Lacs' },
    { id: 16, value: 8000000, name: '80 Lacs' },
    { id: 17, value: 8500000, name: '85 Lacs' },
    { id: 18, value: 9000000, name: '90 Lacs' },
    { id: 19, value: 9500000, name: '95 Lacs' },

    { id: 20, value: 10000000, name: '1 Crore' },
    { id: 21, value: 10500000, name: '1.05 Crores' },
    { id: 22, value: 11000000, name: '1.1 Crores' },
    { id: 23, value: 11500000, name: '1.15 Crores' },
    { id: 24, value: 12000000, name: '1.2 Crores' },
    { id: 25, value: 12500000, name: '1.25 Crores' },
    { id: 26, value: 13000000, name: '1.3 Crores' },
    { id: 27, value: 13500000, name: '1.35 Crores' },
    { id: 28, value: 14000000, name: '1.4 Crores' },
    { id: 29, value: 14500000, name: '1.45 Crores' },
    { id: 30, value: 15000000, name: '1.5 Crores' },
    { id: 31, value: 15500000, name: '1.55 Crores' },
    { id: 32, value: 16000000, name: '1.6 Crores' },
    { id: 33, value: 16500000, name: '1.65 Crores' },
    { id: 34, value: 17000000, name: '1.7 Crores' },
    { id: 35, value: 17500000, name: '1.75 Crores' },
    { id: 36, value: 18000000, name: '1.8 Crores' },
    { id: 37, value: 18500000, name: '1.85 Crores' },
    { id: 38, value: 19000000, name: '1.9 Crores' },
    { id: 39, value: 20000000, name: '2 Crores' },

    { id: 40, value: 21000000, name: '2.1 Crores' },
    { id: 41, value: 22000000, name: '2.2 Crores' },
    { id: 42, value: 23000000, name: '2.3 Crores' },
    { id: 43, value: 24000000, name: '2.4 Crores' },
    { id: 44, value: 25000000, name: '2.5 Crores' },
    { id: 45, value: 26000000, name: '2.6 Crores' },
    { id: 46, value: 27000000, name: '2.7 Crores' },
    { id: 47, value: 28000000, name: '2.8 Crores' },
    { id: 48, value: 29000000, name: '2.9 Crores' },
    { id: 49, value: 30000000, name: '3 Crores' },

    { id: 50, value: 31000000, name: '3.1 Crores' },
    { id: 51, value: 32000000, name: '3.2 Crores' },
    { id: 52, value: 33000000, name: '3.3 Crores' },
    { id: 53, value: 34000000, name: '3.4 Crores' },
    { id: 54, value: 35000000, name: '3.5 Crores' },
    { id: 55, value: 36000000, name: '3.6 Crores' },
    { id: 56, value: 37000000, name: '3.7 Crores' },
    { id: 57, value: 38000000, name: '3.8 Crores' },
    { id: 58, value: 39000000, name: '3.9 Crores' },
    { id: 59, value: 40000000, name: '4 Crores' },

    { id: 60, value: 41000000, name: '4.1 Crores' },
    { id: 61, value: 42000000, name: '4.2 Crores' },
    { id: 62, value: 43000000, name: '4.3 Crores' },
    { id: 63, value: 44000000, name: '4.4 Crores' },
    { id: 64, value: 45000000, name: '4.5 Crores' },
    { id: 65, value: 46000000, name: '4.6 Crores' },
    { id: 66, value: 47000000, name: '4.7 Crores' },
    { id: 67, value: 48000000, name: '4.8 Crores' },
    { id: 68, value: 49000000, name: '4.9 Crores' },
    { id: 69, value: 50000000, name: '4 Crores' },

    { id: 70, value: 41000000, name: '4.1 Crores' },
    { id: 71, value: 42000000, name: '4.2 Crores' },
    { id: 72, value: 43000000, name: '4.3 Crores' },
    { id: 73, value: 44000000, name: '4.4 Crores' },
    { id: 74, value: 45000000, name: '4.5 Crores' },
    { id: 75, value: 46000000, name: '4.6 Crores' },
    { id: 76, value: 47000000, name: '4.7 Crores' },
    { id: 77, value: 48000000, name: '4.8 Crores' },
    { id: 78, value: 49000000, name: '4.9 Crores' },
    { id: 79, value: 50000000, name: '5 Crores' },

    { id: 80, value: 52500000, name: '5.25 Crores' },
    { id: 81, value: 55000000, name: '5.5 Crores' },
    { id: 82, value: 57500000, name: '5.75 Crores' },
    { id: 83, value: 60000000, name: '6 Crores' },

    { id: 84, value: 62500000, name: '6.25 Crores' },
    { id: 85, value: 65000000, name: '6.5 Crores' },
    { id: 86, value: 67500000, name: '6.75 Crores' },
    { id: 87, value: 70000000, name: '7 Crores' },

    { id: 88, value: 72500000, name: '7.25 Crores' },
    { id: 89, value: 75000000, name: '7.5 Crores' },
    { id: 90, value: 77500000, name: '7.75 Crores' },
    { id: 91, value: 80000000, name: '8 Crores' },

    { id: 92, value: 82500000, name: '8.25 Crores' },
    { id: 93, value: 85000000, name: '8.5 Crores' },
    { id: 94, value: 87500000, name: '8.75 Crores' },
    { id: 95, value: 90000000, name: '9 Crores' },

    { id: 96, value: 92500000, name: '9.25 Crores' },
    { id: 97, value: 95000000, name: '9.5 Crores' },
    { id: 98, value: 97500000, name: '9.75 Crores' },
    { id: 99, value: 100000000, name: '10 Crores' },

    { id: 100, value: 200000000, name: '20 Crores' },

  ];

  campaignDuration: any = [
    { id: 1, value: 15, name: '15 Days' },
    { id: 2, value: 30, name: '30 Days' },
    { id: 3, value: 90, name: '90 Days' },
    { id: 4, value: 120, name: '4 Months' },
    { id: 4, value: 159, name: '5 Months' },
    { id: 4, value: 180, name: '6 Months' },
    { id: 4, value: 365, name: '1 Year' },
  ];

  isContactModal:boolean=false;
  isCSV:boolean=false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
    private _activatedRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _http:HttpClient,
  ) {
    this.projectId = this._activatedRoute.snapshot.params.id;
    //console.log(this.projectId)

  }

  ngOnInit() {
    this.getBuilder();
    this.setCreate();

    this.filteredOptions = this.create.get("builder").valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.minBudget(0)
    this.maxBudget(200000000)
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
    this.map = new google.maps.Map(this.gmap.nativeElement, mapOptions);
    this.marker.setMap(this.map);
  }

  locateAddressOnMap(location: any) {

    if (location != '') {
      this.map.setZoom(15);

    }

    this.findLocation(location);
  }

  findLocation(address: string) {

    //this.map.setZoom(15);

    if (!this.geocoder) this.geocoder = new google.maps.Geocoder();

    this.geocoder.geocode({ address: address }, (results, status) => {

      if (status == google.maps.GeocoderStatus.OK) {

        this.marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
          draggable: true,
        });

        this.map.setCenter(results[0].geometry.location);
        this.infowindow.setContent(results[0].formatted_address);
        this.infowindow.open(this.map, this.marker);
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
        //this.latLngCoords = true;
        this.marker.addListener("dragend", event => {
          this.latitude = event.latLng.lat();
          this.longitude = event.latLng.lng();
        });

      } else {
        // alert("Sorry, this search produced no results.");
        //this.latLngCoords = false;
        this.mapError = true;
        setTimeout(() => {
          this.mapError = false;
        }, 1000);


      }
    });
  }

  // google map end

  setCreate() {
    this.create = this._fb.group({
      id: [''],
      leadType: ['1'],
      builder: ['', Validators.compose([Validators.required])],
      project: ['', Validators.compose([Validators.required])],
      mapCont: ['', Validators.compose([Validators.required])],
      propertyType: ['', Validators.compose([Validators.required])],
      industryType: ['', Validators.compose([Validators.required])],
      priceMin: ['', Validators.compose([Validators.required])],
      priceMax: ['', Validators.compose([Validators.required])],
      rera_id:['', Validators.compose([Validators.required])],
      possassionYear: ['', Validators.compose([Validators.required])],
      campaignDuration: [''],
      numberOfLeads: [''],
      persona: [''],
      uploadbuyerPersona: [''],
      attachment: [''],
      deliveryMode:['']
    })
  }

  submit() {

    this.isSubmit = true;

    if (this.create.invalid) {
      return false
    }

    // console.log(this.create.value)
    // return false;

    //console.log(this.create.value)

      const formData = new FormData()      

      formData.append('developer', this.create.value.builder),
      formData.append('name', this.create.value.project),
      formData.append('rera_id', this.create.value.rera_id),

      formData.append('latitude', JSON.stringify(this.latitude)),
      formData.append('longitude', JSON.stringify(this.longitude)),

      formData.append('project_type', this.create.value.propertyType)

      for(let i=0; i<this.create.value.industryType.length; i++){
        //myInvent.push(this.create.value.industryType[i])
        formData.append('inventory[]',  this.create.value.industryType[i])
      }      

      formData.append('min_price', this.create.value.priceMin),
      formData.append('max_price', this.create.value.priceMax)
      let newPassDate = new DatePipe('en-US').transform(this.create.value.possassionYear, 'yyyy-MM-dd');      
      formData.append('possession', newPassDate),      
      
      formData.append('description', this.chipArr.join(", "))

      formData.append('campaign_days', this.create.value.campaignDuration)
      formData.append('campaign_leads_to_be_generated', this.create.value.numberOfLeads)

      if(this.fileTobeUploadBP!=undefined){
        formData.append('buyer_persona_sheet', this.fileTobeUploadBP)
      }      

      for(let i=0; i<this.fileTobeUpload.length; i++){
        formData.append('brochure[]', this.fileTobeUpload[i])
      }

      formData.append('delivery_mode ', this.create.value.deliveryMode)      

    this.serverService.createPost('projects/client/create_project', formData, this.authToken).subscribe(data => {
      //console.log(data)

      this.isContactModal=true;  

      // this._snackBar.open('Our Sales Team will Contact you Shortly', '', {
      //   duration: 3000,
      //   verticalPosition: "top",
      //   horizontalPosition: "center"
      // });

      setTimeout(() => {        
        this.router.navigate(['/page/project'])
      }, 3000);    
      
    },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )

  }

  get fCreate() {
    return this.create.controls;
  }

  resetLoc() {
    this.create.get('mapCont').patchValue('');
    //this.loc.nativeElement.value=null;
    this.findLocation('New Delhi');
  }

  enterChip(value: any) {
    this.chipArr.push(value)
    this.create.get('persona').patchValue('');
  }

  chipDel(i: any) {
    this.chipArr.splice(i, 1)
  }

  attachment(event: any) {

    if (event.target.files.length == 0) {
      return false
    }

    let type = event.target.files[0].type;
    //console.log(type)

    if (type.match(/image\/*/) == null) {
      //this.create.controls['idProof'].patchValue('')
      //this._toastr.error("Only Images are supported !!");
    }

    for (let i = 0; i < event.target.files.length; i++) {
      this.fileTobeUpload.push(event.target.files[i])
      this.attachName.push(event.target.files[i].name)
    }

  }

  deletePic(i: any) {
    //this.fileTobeUpload.splice(i, 1)
    this.attachURL.splice(i, 1)
    // this.delPicId.push(picId)
  }

  attachmentBP(event: any) {

    this.isCSV=false;

    if (event.target.files.length == 0) {
      return false
    }

    let type = event.target.files[0].type;
    //console.log(type.split('/'))

    if (type.split('/')[1] != 'csv') {
      this.create.controls['uploadbuyerPersona'].patchValue('')
      this.isCSV=true;
      
      // this._snackBar.open('Only CSV are supported !!', '', {
      //   duration: 2000,
      //   verticalPosition: "top",
      //   horizontalPosition: "center",
      //   panelClass: ["custom-style"]
      // });

      return false;
    }

    this.fileTobeUploadBP = event.target.files[0]
    this.attachNameBP = event.target.files[0].name

    // console.log(this.fileTobeUploadBP)
    // console.log(this.attachNameBP)

  }

  getBuilder() {
    //this.showComponentLoader = true;
    this.serverService.getbuilder('/all_developers_data', this.authToken).subscribe(data => {
      //console.log(data)
      this.allBuilder = data;

      for (const property in data) {
        this.options.push(property)
      }

      //this.showComponentLoader = false;
    },
      err => {
        //this.showComponentLoader = true;
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getBuilderValue(value: any) {
    //console.log(value.option.value)
    this.create.get('project').patchValue('');

    this.allProject = this.allBuilder[value.option.value]
    this.options2 = this.allBuilder[value.option.value]
    //console.log(this.options2)

    this.filteredOptions2 = this.create.get("project").valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter2(value))
      );

  }

  _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options2.filter(option => option.toLowerCase().includes(filterValue));
  }

  minBudget(value: any) {
    this.maxBudgetValue = this.budgetValue.filter((item) => {
      return item.value >= value;
    })

    //console.log(this.maxBudgetValue)
  }

  maxBudget(value: any) {
    this.minBudgetValue = this.budgetValue.filter((item) => {
      return item.value <= value;
    })

    //console.log(this.minBudgetValue)
  }

  onSave() {
    this._http.get('assets/sample/buyer persona-sample.csv', { responseType: "blob", headers: { 'Accept': 'application/vnd.ms-excel' } })
      .subscribe(blob => {
        saveAs(blob, 'flat-bulk-upload-sample.csv');
      });
  }


}