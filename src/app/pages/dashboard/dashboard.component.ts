import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy, HostListener, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import * as Highcharts from 'highcharts';
import { ServerService } from '../../services/server.service'
import { ClipBoardService } from '../../services/clipboard.service'
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { IMyDateRangeModel } from 'mydaterangepicker';
import { LeadListModalComponent } from './lead-list-modal/lead-list-modal.component';
import { Title, ɵDomEventsPlugin } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  stats: any = {}
  authToken: any = localStorage.getItem('token');
  showComponentLoader: boolean = false
  projects: any = []
  selectedUser: any = ""
  selectProject: any = ''
  selectLeadScore: any = ""
  selectCreatedAt: any = ""
  selectUpdatedAt: any = ""
  highcharts = Highcharts;
  //Lead Status chart keys
  showLeadStatus: boolean = false
  leadStatusChart = {
    chart: {
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },
    tooltip: {
      pointFormat: '<h2>{point.y}</h2>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        height: "400px",
        innerSize: '50%',
        showInLegend: true,
        dataLabels: {
          enabled: false
        },
      }
    },
    series: [{
      type: 'pie',
      data: []
    }]
  }
  // User Stats
  showUserStats: boolean = false
  userStatsColumn = {
    chart: {
      type: 'column',
    },
    title: {
      text: ''
    },
    subtitle: {
      text: ''
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: [],
      title: {
        text: 'User'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Lead Count'
      }
    },
    tooltip: {
      pointFormat: '<table><tr><td style = "color:{series.color};padding:0">{point.key}: </td>' +
        '<td style = "padding:0"><b>{point.y}</b></td></tr></table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 1,
        showInLegend: false
      }
    },
    series: [{
      name: 'Count',
      color: '#00C08D',
      data: [],
      data1: []
    }]
  }

  showPieChart: boolean = false

  showUserStatus: boolean = false
  clientUserStatsData: any = {
    "user_stats": [],
    "status_stats": {}
  };

  leadListModalComponent: MatDialogRef<LeadListModalComponent>

  clientLead:any;

  myDateRangePickerOptions = {     
    dateFormat: 'dd.mm.yyyy'      
};


  constructor(
    private dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private serverService: ServerService,
    public clipBoardService: ClipBoardService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.titleService.setTitle('AutomateLeads - Dashboard');
  }

  ngOnInit() {
    this.getClientStats()
    this.getAllProjects()
    this.filterByFilters()
    this.getLeadCount()
  }

  getClientStats() {
    this.serverService.getStats(this.authToken).subscribe(data => {
        this.stats = data
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getLeadCount() {
    this.serverService.getFreshLeadCount('get_lead_count', this.authToken).subscribe(data => {
      //console.log(data)
        this.clientLead = data
      }, err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getAllProjects() {
    this.serverService.projectsList(this.authToken).subscribe(
      data => {
        this.projects = data
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  filterByFilters() {
    this.showUserStatus = false
    let body = {};
    if (this.selectCreatedAt != undefined && this.selectCreatedAt != "") {
      if (this.selectCreatedAt.length != undefined && this.selectCreatedAt.length != 0) {
        body["created_at"] = this.selectCreatedAt
      } else {
        this.selectCreatedAt = [this.selectCreatedAt.beginDate.year + '-' + this.selectCreatedAt.beginDate.month + '-' + this.selectCreatedAt.beginDate.day, this.selectCreatedAt.endDate.year + '-' + this.selectCreatedAt.endDate.month + '-' + this.selectCreatedAt.endDate.day];
        body["created_at"] = this.selectCreatedAt
      }
    }
    if (this.selectUpdatedAt != undefined && this.selectUpdatedAt != "") {
      if (this.selectUpdatedAt.length != undefined && this.selectUpdatedAt.length != 0) {
        body["modified_at"] = this.selectUpdatedAt
      } else {
        this.selectUpdatedAt = [this.selectUpdatedAt.beginDate.year + '-' + this.selectUpdatedAt.beginDate.month + '-' + this.selectUpdatedAt.beginDate.day, this.selectUpdatedAt.endDate.year + '-' + this.selectUpdatedAt.endDate.month + '-' + this.selectUpdatedAt.endDate.day];
        body["modified_at"] = this.selectUpdatedAt
      }
    }
    if (this.selectProject != "") {
      body["project_id"] = this.selectProject;
    }
    if (this.selectLeadScore != "") {
      body["score"] = this.selectLeadScore;
    }
    this.userStatsColumn.xAxis.categories = []
    this.userStatsColumn.series[0].data = []
    this.leadStatusChart["series"][0].data = []
    this.showUserStats = false
    this.showLeadStatus = false
    this.showComponentLoader = true
    this.serverService.getUsersStats(body, this.authToken).subscribe(
      data => {
        this.clientUserStatsData = data;
        if (this.clientUserStatsData.user_stats.length != 0) {
          this.clientUserStatsData.user_stats.forEach(element => {
            let newBody = {
              name: element.user_name,
              id: element.user_id,
              y: element.leads_assigned
            }
            this.userStatsColumn.xAxis.categories.push(element.user_name)
            this.userStatsColumn.series[0].data.push(newBody)
          });
          this.showUserStats = true
        } else {
          this.showUserStats = false
        }
        if (Object.keys(data.status_stats).length !== 0) {
          var result = Object.keys(data.status_stats).map(el => {
            let body = {
              name: el,
              y: data.status_stats[el]
            }
            return body
          })
          this.leadStatusChart["series"][0].data = result
          this.showLeadStatus = true
        } else {
          this.showLeadStatus = false
        }
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  onCreatedAtDateRange(event: IMyDateRangeModel) {
    if (event.beginDate.year != 0) {
      this.selectCreatedAt = [event.formatted.split(" - ")[0], event.formatted.split(" - ")[1]];
    } else {
      this.selectCreatedAt = "";
    }
    this.filterByFilters()
  }
  onUpdatedAtDateRange(event: IMyDateRangeModel) {
    if (event.beginDate.year != 0) {
      this.selectUpdatedAt = [event.formatted.split(" - ")[0], event.formatted.split(" - ")[1]];
    } else {
      this.selectUpdatedAt = "";
    }
    this.filterByFilters()
  }

  reset() {
    this.selectProject = ""
    this.selectLeadScore = ""
    this.selectUpdatedAt = ""
    this.selectCreatedAt = ""
    this.showPieChart = false
    this.filterByFilters()
  }

  onPointSelect(event) {
    if (event.point == undefined) {
      return
    }
    let body = {
      "status": event.point.name,
      "url": ""
    }
    let statusArray = [];
    statusArray.push(event.point.name);
    body.url += '&statuses=' + JSON.stringify(statusArray);
    if (this.selectLeadScore != "") {
      body.url += '&score=' + parseInt(this.selectLeadScore)
    }
    if (this.selectUpdatedAt != undefined && this.selectUpdatedAt != "") {
      if (this.selectUpdatedAt.length != undefined && this.selectUpdatedAt.length != 0) {
        body.url += '&modified_at=' + JSON.stringify(this.selectUpdatedAt)
      } else {
        this.selectUpdatedAt = [this.selectUpdatedAt.beginDate.year + '-' + this.selectUpdatedAt.beginDate.month + '-' + this.selectUpdatedAt.beginDate.day, this.selectUpdatedAt.endDate.year + '-' + this.selectUpdatedAt.endDate.month + '-' + this.selectUpdatedAt.endDate.day];
        body.url += '&modified_at=' + JSON.stringify(this.selectUpdatedAt)
      }
    }
    if (this.selectCreatedAt != undefined && this.selectCreatedAt != "") {
      if (this.selectCreatedAt.length != undefined && this.selectCreatedAt.length != 0) {
        body.url += '&created_at=' + JSON.stringify(this.selectCreatedAt)
      } else {
        this.selectCreatedAt = [this.selectCreatedAt.beginDate.year + '-' + this.selectCreatedAt.beginDate.month + '-' + this.selectCreatedAt.beginDate.day, this.selectCreatedAt.endDate.year + '-' + this.selectCreatedAt.endDate.month + '-' + this.selectCreatedAt.endDate.day];
        body.url += '&created_at=' + JSON.stringify(this.selectCreatedAt)
      }
    }
    if (this.selectProject != "") {
      body.url += '&project_id=' + this.selectProject;
    }
    this.leadListModalComponent = this.dialog.open(LeadListModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '100%',
      maxWidth: '100vw',
      panelClass: 'cdk-overlay-panel-right-side',
      data: body
    });
  }

  clickElement(events) {
    if (events.point == undefined) {
      return
    }
    this.selectedUser = events.point.name
    let body = {
      "user_id": events.point.id
    }
    if (this.selectUpdatedAt != undefined && this.selectUpdatedAt != "") {
      if (this.selectUpdatedAt.length != undefined && this.selectUpdatedAt.length != 0) {
        body["modified_at"] = JSON.stringify(this.selectUpdatedAt)
      } else {
        this.selectUpdatedAt = [this.selectUpdatedAt.beginDate.year + '-' + this.selectUpdatedAt.beginDate.month + '-' + this.selectUpdatedAt.beginDate.day, this.selectUpdatedAt.endDate.year + '-' + this.selectUpdatedAt.endDate.month + '-' + this.selectUpdatedAt.endDate.day];
        body["modified_at"] = JSON.stringify(this.selectUpdatedAt)
      }
    }
    if (this.selectCreatedAt != undefined && this.selectCreatedAt != "") {
      if (this.selectCreatedAt.length != undefined && this.selectCreatedAt.length != 0) {
        body["created_at"] = JSON.stringify(this.selectCreatedAt)
      } else {
        this.selectCreatedAt = [this.selectCreatedAt.beginDate.year + '-' + this.selectCreatedAt.beginDate.month + '-' + this.selectCreatedAt.beginDate.day, this.selectCreatedAt.endDate.year + '-' + this.selectCreatedAt.endDate.month + '-' + this.selectCreatedAt.endDate.day];
        body["created_at"] = JSON.stringify(this.selectCreatedAt)
      }
    }
    if (this.selectProject != "") {
      body["project_id"] = this.selectProject;
    }
    if (this.selectLeadScore != "") {
      body["score"] = this.selectLeadScore;
    }
    this.clientUserStats(body);
  }

  clientUserStats(value) {
    this.showComponentLoader = true
    this.showPieChart = true
    this.showLeadStatus = false
    this.showUserStatus = false
    this.serverService.getUserStats(value, this.authToken).subscribe(
      data => {
        if (Object.keys(data.stats).length !== 0) {
          var result = Object.keys(data.stats).map(el => {
            let body = {
              name: el,
              y: data.stats[el]
            }
            return body
          })
          this.leadStatusChart["series"][0].data = result
          this.showUserStatus = true
        } else {
          this.showUserStatus = false
        }
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.showUserStatus = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  routeTo(val) {
    if (val == 'Project') {
      this.clipBoardService.select('/page/project')
      this.clipBoardService.isActive('/page/project')
      this.router.navigate(['/page/project'])
    } else if (val == 'Vendor') {
      this.clipBoardService.select('/page/vendors')
      this.clipBoardService.isActive('/page/vendors')
      this.router.navigate(['/page/vendors'])
    } else if (val == 'User') {
      this.clipBoardService.select('/page/users')
      this.clipBoardService.isActive('/page/users')
      this.router.navigate(['/page/users'])
    }
  }
}