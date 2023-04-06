import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ClipBoardService } from 'src/app/services/clipboard.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-project-insight',
  templateUrl: './project-insight.component.html',
  styleUrls: ['./project-insight.component.scss']
})
export class ProjectInsightComponent implements OnInit {

  statusSpinner: boolean = false
  authToken: any = localStorage.getItem("token")
  project: any = {}

  projectId: any;

  airportData: any;
  ITGroupData: any;
  BFSIGroupData: any;
  legalData: any;
  PSUData: any;
  pharmaGroupData: any;
  SMEGroupData: any;
  similarProjectData: any;

  viewMoreSimilar : any = false;

  bankingData : any;
  bfsiData : any;
  businessPlanData : any;
  competitorData : any;
  geo10KMData : any;
  geo6KMData : any;
  hniData : any;
  homeByuerData : any;
  itData : any;
  investorData : any;
  educationData : any;
  manufacturingData : any;
  marketPlaceData : any;
  nriData : any;
  relianceEmployeesData : any;
  sealineData : any;
  pastAudienceData : any;

  showComponentLoader: boolean = false

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
    private _activatedRoute: ActivatedRoute
  ) {

    this.showComponentLoader = true
    this.projectId = this._activatedRoute.snapshot.params.id;
    if (this.projectId) {
      this.getProjectInfo()
      this.getInsight();
    } else {
      this.clipBoardService.showMessgeInText("No Project Found", "error-snackbar");
      this.router.navigate(['/page/project']);
    }

  }

  ngOnInit() { }

  getProjectInfo() {
    this.serverService.getProjectById({ id: this.projectId }, this.authToken).subscribe(
      data => {
        this.project = data
      },
      err => {
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  getInsight() {

    this.showComponentLoader = true

    let url = "nearby?project_id=" + this.projectId;

    this.serverService.getInsight(url, this.authToken).subscribe(data => {
      //console.log(data)

      this.airportData = data['Airport'];
      this.ITGroupData = data['Information Technology'];
      this.BFSIGroupData = data["BFSI"];
      this.legalData = data["Lawyers"];
      this.PSUData = data.PSU;
      this.pharmaGroupData = data["Pharmaceutical"];
      this.SMEGroupData = data["RoC/SME"];
      this.similarProjectData = data["Similar Project"];
      this.bankingData = data["Banking"];
      this.bfsiData = data["BFSI"];
      this.businessPlanData = data["Business Man"];
      this.competitorData = data["Competitor"];
      this.geo10KMData = data["Geo Fencing (10KM)"];
      this.geo6KMData = data["Geo Fencing (6KM)"];
      this.hniData = data["HNIs"];
      this.homeByuerData = data["Home Buyer"];
      this.itData = data["Information Technology"];
      this.investorData = data["Investor"];
      this.educationData = data["Education(Prof/Teacher)"]
      this.manufacturingData = data["Manufacturing"];
      this.marketPlaceData = data["Market Place"];
      this.nriData = data["NRI(GCC)"];
      this.relianceEmployeesData = data["Reliance Employees"];
      this.sealineData = data["Sealine"];
      this.pastAudienceData = data["past_audiences"];
      if (this.similarProjectData) {
        for (var _i = 0; _i < this.similarProjectData.entries.length; _i++) {
          this.similarProjectData.entries[_i].extra.min_price = this.changeNumberFormat(this.similarProjectData.entries[_i].extra.min_price, 2);
        }
      }

      this.showComponentLoader = false
    },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  changeNumberFormat(number, decimals, recursiveCall?) {

    const decimalPoints = decimals || 2;
    const noOfLakhs = number / 100000;
    let displayStr;
    let isPlural;

    // Rounds off digits to decimalPoints decimal places
    function roundOf(integer) {
      return +integer.toLocaleString(undefined, {
        minimumFractionDigits: decimalPoints,
        maximumFractionDigits: decimalPoints,
      });
    }

    if (noOfLakhs >= 1 && noOfLakhs <= 99) {
      const lakhs = roundOf(noOfLakhs);
      isPlural = lakhs > 1 && !recursiveCall;
      displayStr = `${lakhs} Lakh${isPlural ? 's' : ''}`;
    } else if (noOfLakhs >= 100) {
      const crores = roundOf(noOfLakhs / 100);
      const crorePrefix = crores >= 100000 ? this.changeNumberFormat(crores, decimals, true) : crores;
      isPlural = crores > 1 && !recursiveCall;
      displayStr = `${crorePrefix} Crore${isPlural ? 's' : ''}`;
    } else {
      displayStr = roundOf(+number);
    }
    return displayStr;
  }

  percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } }];

  getColorForPercentage(pct) {
    for (var i = 1; i < this.percentColors.length - 1; i++) {
      if (pct < this.percentColors[i].pct) {
        break;
      }
    }
    var lower = this.percentColors[i - 1];
    var upper = this.percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
  };
  delete(element){
    // let id = element.id;
    // let body = element.project_id;
    let body = {
      'id':element.id,
      'project_id':element.project_id
    }
    let url = 'delete_nearby/';
    this.serverService.deleteInsight(url,body,this.authToken).subscribe((data)=>{
      this.clipBoardService.showMessgeInText("Insight Deleted Successfully", "success-snackbar")
      this.getInsight();

    },err =>{
      this.clipBoardService.checkServerError(err, this.authToken)

    });
    
    
    
  }

}
