import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'

@Component({
  selector: 'app-create-booking-modal',
  templateUrl: './create-booking-modal.component.html',
  styleUrls: ['./create-booking-modal.component.scss']
})
export class CreateBookingModalComponent implements OnInit {
  authToken = localStorage.getItem("token")
  public authInfo = JSON.parse(localStorage.getItem("authInfo"));
  btnStatus: boolean = false
  createBookingForm: FormGroup = this.fb.group({
    name: ['', Validators.required,],
    email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    Validators.email]],
    phone: ['', [Validators.required, , Validators.pattern('[1-9]{1}[0-9]{9}')]],
    floor: ["", Validators.required],
    tower: ["", Validators.required],
    unit: ["", Validators.required],
    unitPrice: ["", Validators.required],
    bookingDate: [new Date().toJSON().split('T')[0], Validators.required],
    bookingAmount: ["", Validators.required],
    rmName: [""],
    project: [''],
    status: ['Awaiting Approval'],
    rejection_reason: [''],
    user: ['']
  });
  projects: any[] = []
  bookingData: any;
  leadCreate: any;

  showComponentLoader: boolean = false
  pageIndex: number = 0;
  pageSize: number = 100;
  userList: any;

  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  constructor(
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateBookingModalComponent>,
    @Inject(MAT_DIALOG_DATA) private booking
  ) {
    this.leadCreate = booking.leadCreate;
    this.bookingData = booking.bookingData;
    //console.log(this.bookingData)
    // console.log(this.bookingData.project_id)
    this.getProjects()
  }

  ngOnInit() {
    this.getAllUsers();

    if (this.booking != undefined && this.leadCreate) {
      this.createBookingForm = this.fb.group({
        name: [this.bookingData != undefined ? this.bookingData.name : '', Validators.required,],
        email: [this.bookingData != undefined ? this.bookingData.email : '', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.email]],
        phone: [this.bookingData != undefined ? this.bookingData.phone : '', [Validators.required, , Validators.pattern('[1-9]{1}[0-9]{9}')]],
        floor: ["", Validators.required],
        tower: ["", Validators.required],
        unit: ["", Validators.required],
        unitPrice: [null, Validators.required],
        bookingDate: [new Date().toJSON().split('T')[0], Validators.required],
        bookingAmount: [null, Validators.required],
        rmName: [""],
        project: [''],
        status: ['Awaiting Approval'],
        rejection_reason: [''],
        user: [''],
      });
    } else if (this.bookingData != undefined && !this.leadCreate) {

      this.createBookingForm = this.fb.group({
        name: [this.bookingData.name, Validators.required,],
        email: [this.bookingData.email, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.email]],
        phone: [this.bookingData.phone, [Validators.required, , Validators.pattern('[1-9]{1}[0-9]{9}')]],
        floor: [this.bookingData.floor, Validators.required],
        tower: [this.bookingData.tower, Validators.required],
        unit: [this.bookingData.unit, Validators.required],
        unitPrice: [this.bookingData.unit_price, Validators.required],
        bookingDate: [this.bookingData.booking_date.split('T')[0], Validators.required],
        bookingAmount: [this.bookingData.booking_amount, Validators.required],
        rmName: [this.bookingData.rm_name],
        project: [this.bookingData.project_id],
        status: [this.bookingData.status],
        rejection_reason: [''],
        user: [this.bookingData.user_id],
      });
    }

    if (this.bookingData == undefined) {
      this.createBookingForm.controls.project.setValidators([Validators.required])
    }

    this.createBookingForm.controls.status.valueChanges.subscribe(result => {
      if (result == 'Rejected') {
        this.createBookingForm.controls.rejection_reason.setValidators([Validators.required])
      } else {
        this.createBookingForm.controls.rejection_reason.setValidators(null)
      }
      this.createBookingForm.controls.rejection_reason.patchValue('')
    })
  }

  getProjects() {
    this.serverService.projectsList(this.authToken).subscribe(
      data => {
        this.projects = data
        //console.log(data)
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  submit() {
    let body = {
      "name": this.createBookingForm.value.name,
      "email": this.createBookingForm.value.email,
      "phone": this.createBookingForm.value.phone,
      "floor": this.createBookingForm.value.floor,
      "tower": this.createBookingForm.value.tower,
      "unit": this.createBookingForm.value.unit,
      "unit_price": this.createBookingForm.value.unitPrice,
      "booking_date": this.createBookingForm.value.bookingDate,
      "booking_amount": this.createBookingForm.value.bookingAmount,
      "status": this.createBookingForm.value.status,
      "rm_name": this.createBookingForm.value.rmName,
      "user_id": this.createBookingForm.value.user
    }
    if (this.bookingData == undefined) {
      body["project_id"] = this.createBookingForm.value.project
    } else {
      body["project_id"] = this.bookingData.project_id
    }
    this.btnStatus = true
    // console.log(body)
    this.serverService.createBooking(body, this.authToken).subscribe(
      data => {
        this.btnStatus = false
        this.clipBoardService.showMessgeInText("Booking Created Successfully", "success-snackber")
        this.dialogRef.close(body)
      },
      err => {
        this.btnStatus = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  updateSubmit() {
    let body = {}
    if (this.userInfo.member_type == "Vendor") {
      if (this.userInfo.org_admin) {
        body = {
          "name": this.createBookingForm.value.name,
          "email": this.createBookingForm.value.email,
          "phone": this.createBookingForm.value.phone,
          "floor": this.createBookingForm.value.floor,
          "tower": this.createBookingForm.value.tower,
          "unit": this.createBookingForm.value.unit,
          "unit_price": this.createBookingForm.value.unitPrice,
          "booking_date": this.createBookingForm.value.bookingDate,
          "booking_amount": this.createBookingForm.value.bookingAmount,
          "status": this.createBookingForm.value.status,
          "rm_name": this.createBookingForm.value.rmName,
          // "user_id": this.createBookingForm.value.user
        }
      } else {
        body = {
          "name": this.createBookingForm.value.name,
          "email": this.createBookingForm.value.email,
          "phone": this.createBookingForm.value.phone,
          "floor": this.createBookingForm.value.floor,
          "tower": this.createBookingForm.value.tower,
          "unit": this.createBookingForm.value.unit,
          "unit_price": this.createBookingForm.value.unitPrice,
          "booking_date": this.createBookingForm.value.bookingDate,
          "booking_amount": this.createBookingForm.value.bookingAmount,
          "status": this.createBookingForm.value.status,
          "rm_name": this.createBookingForm.value.rmName,
        }
      }

    } else {
      body = {
        "name": this.createBookingForm.value.name,
        "email": this.createBookingForm.value.email,
        "phone": this.createBookingForm.value.phone,
        "floor": this.createBookingForm.value.floor,
        "tower": this.createBookingForm.value.tower,
        "unit": this.createBookingForm.value.unit,
        "unit_price": this.createBookingForm.value.unitPrice,
        "booking_date": this.createBookingForm.value.bookingDate,
        "booking_amount": this.createBookingForm.value.bookingAmount,
        "status": this.createBookingForm.value.status,
        "rm_name": this.createBookingForm.value.rmName,
        "user_id": this.createBookingForm.value.user
      }
    }

    if (this.createBookingForm.value.status == 'Rejected') {
      body['rejection_reason'] = this.createBookingForm.value.rejection_reason
    }
    if (this.bookingData == undefined) {
      body["project_id"] = this.createBookingForm.value.project
    } else {
      if (this.leadCreate) {
        body["project_id"] = this.bookingData.project_id
      } else {
        body["project_id"] = this.createBookingForm.value.project
      }
    }
    this.btnStatus = true

    // console.log(body)
    this.serverService.updateBooking(this.bookingData.id, body, this.authToken).subscribe(
      data => {
        this.btnStatus = false
        this.clipBoardService.showMessgeInText("Booking Updated Successfully", "success-snackber")
        this.dialogRef.close(body)
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

  getAllUsers() {
    this.pageIndex = 0;
    this.pageSize = 1000;
    let body = {
    }
    this.showComponentLoader = true
    let url = "all_users_search_n_filter/?per_page=" + this.pageSize + "&page=" + this.pageIndex;
    this.serverService.getUsersByFilter(url, body, this.authToken).subscribe(
      data => {
        this.userList = data.users
        //console.log(data)
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

}
