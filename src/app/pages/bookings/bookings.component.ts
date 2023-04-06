import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ClipBoardService } from '../../services/clipboard.service';
import { ServerService } from '../../services/server.service';
import { BookingFilterModalComponent } from './booking-filter-modal/booking-filter-modal.component';
import { CreateBookingModalComponent } from './create-booking-modal/create-booking-modal.component';
import { DeleteBookingModalComponent } from './delete-booking-modal/delete-booking-modal.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {
  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  showComponentLoader: boolean = false
  booking: any = {
    bookings: [],
    pagination: {}
  }
  statusSpinner: boolean = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageIndex: number = 0;
  pageSize: number = 100;

  filterByClient: any
  filterByProject: any
  selectStatus: any[] = []
  selectUser: any;
  createdAt: any
  createdAtFormate: any
  bookingDate: any
  bookingDateFormate: any


  userList:any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
  ) {
    this.titleService.setTitle('AutomateLeads - Booking');
  }

  ngOnInit() {
    this.getListBookings()
  }

  getNext(event) {
    this.showComponentLoader = true
    let body1 = {
      "per_page": event.pageSize,
      "page": event.pageIndex
    };
    this.pageSize = body1.per_page;
    this.pageIndex = body1.page
    let indexPage = this.pageIndex + 1
    this.showComponentLoader = true
    let url = "bookings?per_page=" + this.pageSize + "&page=" + indexPage;
    if (this.filterByProject != undefined && this.filterByProject != "") {
      url += '&project_id=' + this.filterByProject;
    }
    if (this.filterByClient != undefined && this.filterByClient != "") {
      url += '&client_id=' + this.filterByClient;
    }
    if (this.selectStatus.length != 0) {
      url += '&statuses=' + JSON.stringify(this.selectStatus);
    }
    if (this.selectUser != undefined && this.selectUser != "") {
      url += '&user_id=' + JSON.stringify(this.selectUser);
    }
    if (this.bookingDate != undefined && this.bookingDate != "") {
      if (this.bookingDate.formatted != undefined) {
        url += '&booking_date=["' + [this.bookingDate.formatted.split(" - ")[0] + '"', '"' + this.bookingDate.formatted.split(" - ")[1]] + '"]';
      } else {
        url += '&booking_date=["' + this.bookingDate + '"]'
      }
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      if (this.createdAt.formatted != undefined) {
        url += '&created_at=["' + [this.createdAt.formatted.split(" - ")[0] + '"', '"' + this.createdAt.formatted.split(" - ")[1]] + '"]';
      } else {
        url += '&created_at=["' + this.createdAt + '"]'
      }
    }
    this.showComponentLoader = true
    this.serverService.listBookingsByPage(url, this.authToken).subscribe(
      data => {
        this.booking = data;
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  createBooking() {
    let body = {
      'leadCreate': false,
    }
    this.dialog.open(CreateBookingModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '30vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    }).afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.getListBookings()
      }
    })
  }

  edit(element) {
    let body = {
      'bookingData': element,
      'leadCreate': false,
    }
    this.dialog.open(CreateBookingModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '30vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    }).afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.getListBookings()
      }
    })
  }

  getListBookings() {
    let body = {
      "per_page": 100,
      "page": 1
    };
    let url = "bookings?per_page=" + body.per_page + "&page=" + body.page;
    if (this.filterByProject != undefined && this.filterByProject != "") {
      url += '&project_id=' + this.filterByProject;
    }
    if (this.filterByClient != undefined && this.filterByClient != "") {
      url += '&client_id=' + this.filterByClient;
    }
    if (this.selectStatus.length != 0) {
      url += '&statuses=' + JSON.stringify(this.selectStatus);
    }
    if (this.selectUser != undefined && this.selectUser != "") {
      url += '&user_id=' + JSON.stringify(this.selectUser);
    }
    if (this.bookingDate != undefined && this.bookingDate != "") {
      if (this.bookingDate.formatted != undefined) {
        url += '&booking_date=["' + [this.bookingDate.formatted.split(" - ")[0] + '"', '"' + this.bookingDate.formatted.split(" - ")[1]] + '"]';
      } else {
        url += '&booking_date=["' + this.bookingDate + '"]'
      }
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      if (this.createdAt.formatted != undefined) {
        url += '&created_at=["' + [this.createdAt.formatted.split(" - ")[0] + '"', '"' + this.createdAt.formatted.split(" - ")[1]] + '"]';
      } else {
        url += '&created_at=["' + this.createdAt + '"]'
      }
    }
    this.showComponentLoader = true
    //console.log(url)
    this.serverService.listBookingsByPage(url, this.authToken).subscribe(
      data => {
        this.booking = data;
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  delete(element) {
    this.dialog.open(DeleteBookingModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      data: element
    }).afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.serverService.deleteBooking(element.id, this.authToken).subscribe(
          data => {
            this.clipBoardService.showMessgeInText("Booking Deleted Successfully", "success-snackbar")
            this.getListBookings()
          },
          err => {
            this.clipBoardService.checkServerError(err, this.authToken)
          }
        )
      }
    })
  }

  filter() {
    let body = {};
    if (this.filterByClient != undefined && this.filterByClient != "") {
      body['selectedClient'] = this.filterByClient
    }
    if (this.filterByProject != undefined && this.filterByProject != "") {
      body['selectedProject'] = this.filterByProject
    }
    if (this.selectStatus != undefined && this.selectStatus.length != 0) {
      body["selectStatus"] = this.selectStatus
    }
    if (this.selectUser != undefined && this.selectUser != "") {
      body["selectUser"] = this.selectUser
    }
    if (this.bookingDate != undefined && this.bookingDate != "") {
      body["bookingDate"] = this.bookingDate
    }
    if (this.createdAt != undefined && this.createdAt != "") {
      body["createdAt"] = this.createdAt
    }

    //console.log(this.selectUser)
    //console.log(body)

    this.dialog.open(BookingFilterModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    }).afterClosed().subscribe(result => {
      //console.log(result)
      if (result != undefined) {
        this.showComponentLoader = true
        if (result.selectedClient != undefined && result.selectedClient != "") {
          this.filterByClient = result.selectedClient
        } else {
          this.filterByClient = ""
        }
        if (result.selectedProject != undefined && result.selectedProject != "") {
          this.filterByProject = result.selectedProject
        } else {
          this.filterByProject = ""
        }
        if (result.selectStatus != undefined && result.selectStatus.length != 0) {
          this.selectStatus = result.selectStatus
        } else {
          this.selectStatus = []
        }
        if (result.user_id != undefined && result.user_id != "") {
          this.selectUser = result.user_id
        } else {
          this.selectUser="";
        }
        if (result.bookingDate != undefined && result.bookingDate != "") {
          this.bookingDate = result.bookingDate
          this.bookingDateFormate = [result.bookingDate.formatted.split(" - ")[0], result.bookingDate.formatted.split(" - ")[1]]
        } else {
          this.bookingDate = ""
          this.bookingDateFormate = ""
        }
        if (result.createdAt != undefined && result.createdAt != "") {
          this.createdAt = result.createdAt
          this.createdAtFormate = [result.createdAt.formatted.split(" - ")[0], result.createdAt.formatted.split(" - ")[1]]
        } else {
          this.createdAt = ""
          this.createdAtFormate = ""
        }

        //console.log(this.selectUser)
        //console.log(body)

        this.getListBookings()
      }
    })
  }




}
