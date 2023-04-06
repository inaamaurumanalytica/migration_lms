import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { IMyDrpOptions } from 'mydaterangepicker';
import { ClipBoardService } from '../../services/clipboard.service'
import { ServerService } from '../../services/server.service'

@Component({
  selector: 'app-call-report',
  templateUrl: './call-report.component.html',
  styleUrls: ['./call-report.component.scss']
})
export class CallReportComponent implements OnInit {
  showComponentLoader: boolean = false
  showComponentLoader1: boolean = false;
  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  userList: any[] = []

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageIndex: number = 0;
  pageSize: number = 100;


  expandedElement: any;
  showAllReports: boolean = false
  reportAvailable: boolean = false

  objects = Object

  selectedUser: any = ""
  filterTimelineCreateDate: any;
  filterTimelineAllCreateDate: any;
  myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd.mm.yyyy',
  };

  displayColumns: any[] = []
  reportData: any[] = []


  dataSource: any = {}

  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService
  ) {
    this.titleService.setTitle('AutomateLeads - Call Report');
    this.showComponentLoader = true
  }

  ngOnInit() {
    this.getUserList()
  }

  getUserList() {
    this.serverService.usersList(this.authToken).subscribe(
      data => {
        this.userList = data.users
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getAllReports() {
    this.showComponentLoader = true;
    let body = {}
    if (this.selectedUser != "") {
      body["user_id"] = this.selectedUser
    }
    if (this.filterTimelineCreateDate != undefined && this.filterTimelineCreateDate != '') {
      body["from_date"] = this.filterTimelineCreateDate.beginDate.year + '-' + this.filterTimelineCreateDate.beginDate.month + '-' + this.filterTimelineCreateDate.beginDate.day
    }
    if (this.filterTimelineCreateDate != undefined && this.filterTimelineCreateDate != '') {
      body["till_date"] = this.filterTimelineCreateDate.endDate.year + '-' + this.filterTimelineCreateDate.endDate.month + '-' + this.filterTimelineCreateDate.endDate.day
    }
    this.reportData = []
    this.serverService.getReportByUser(body, this.authToken).subscribe(
      data => {
        this.showAllReports = false
        this.reportAvailable = true
        this.showComponentLoader = false;
        this.dataSource = data;
        if (Object.keys(this.dataSource).length !== 0) {
          this.objects.entries(this.dataSource).map(([key, value]) => {
            this.displayColumns = this.objects.keys(value)
            let dataForReport = this.objects.values(value)
            dataForReport.unshift(key)
            this.reportData.push(dataForReport)
          })
          this.displayColumns.unshift("Date")
        }
      },
      err => {
        this.showComponentLoader = false;
        this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
      }
    )
  }

  getAllReportsUser() {
    this.showComponentLoader = true;
    let body = {}
    if (this.filterTimelineAllCreateDate != undefined && this.filterTimelineAllCreateDate != '') {
      body["from_date"] = this.filterTimelineAllCreateDate.beginDate.year + '-' + this.filterTimelineAllCreateDate.beginDate.month + '-' + this.filterTimelineAllCreateDate.beginDate.day
    }
    if (this.filterTimelineAllCreateDate != undefined && this.filterTimelineAllCreateDate != '') {
      body["till_date"] = this.filterTimelineAllCreateDate.endDate.year + '-' + this.filterTimelineAllCreateDate.endDate.month + '-' + this.filterTimelineAllCreateDate.endDate.day
    }
    this.reportData = []
    this.serverService.getAllReportOfUser(body, this.authToken).subscribe(
      data => {
        this.showAllReports = true
        this.reportAvailable = true
        this.showComponentLoader = false;
        this.dataSource = data;
        if (Object.keys(this.dataSource).length !== 0) {
          this.objects.entries(this.dataSource).map(([key, value]) => {
            this.displayColumns = this.objects.keys(value["report"])
            let dataForReport = this.objects.values(value["report"])
            dataForReport.unshift(value["org_admin"] ? "Yes" : "No")
            dataForReport.unshift(value["name"])
            this.reportData.push(dataForReport)
          })
          this.displayColumns.unshift("Admin")
          this.displayColumns.unshift("Name")
        }
      },
      err => {
        this.showComponentLoader = false;
        this.clipBoardService.checkServerError(err, localStorage.getItem("token"))
      }
    )
  }

  clearfilterTimeline() {
    this.filterTimelineCreateDate = ""
    this.selectedUser = ""
  }

  clearfilterTimelineAll() {
    this.filterTimelineAllCreateDate = ""
  }


  filterTimelineApply() {
    if (this.selectedUser == "" &&
      (this.filterTimelineCreateDate == null ||
        this.filterTimelineCreateDate == undefined ||
        this.filterTimelineCreateDate == "")) {
      this.clipBoardService.showMessgeInText("Please fill some feild in filter", "error-snackbar")
      return
    } else {
      this.getAllReports()
    }
  }

  filterTimelineApplyAll() {
    if (this.filterTimelineAllCreateDate == null ||
      this.filterTimelineAllCreateDate == undefined ||
      this.filterTimelineAllCreateDate == "") {
      this.clipBoardService.showMessgeInText("Please fill some feild in filter", "error-snackbar")

      return
    } else {
      this.getAllReportsUser()
    }
  }

  checkeDate(val) {
    var date = Date.parse(val);
    if (isNaN(val) && !isNaN(date)) {
      return false
    } else {
      return true
    }
  }

  quit() {
    this.reportAvailable = false
    this.showAllReports = false
    this.reportData = []
    this.displayColumns = []
    this.selectedUser = ""
    this.filterTimelineCreateDate = ""
    this.filterTimelineAllCreateDate = ""
  }

  downloadCSV() {
    var newLine = '\n';
    let csv = this.displayColumns.join(',') + newLine
    for (let index = 0; index < this.reportData.length; index++) {
      csv += this.reportData[index].join(',') + newLine
    }
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    var csvData1 = new Blob([csv], { type: "text/csv" });
    var csvUrl = URL.createObjectURL(csvData1);
    var link = document.createElement("a");
    link.setAttribute("href", csvUrl);
    link.setAttribute("download", "Call-Report" + dd + "-" + mm + "-" + yyyy + ".csv");
    link.innerHTML = "Click Here to download";
    document.body.appendChild(link);
    link.click();
  }


}