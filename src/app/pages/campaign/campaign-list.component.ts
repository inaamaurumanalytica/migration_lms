import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatPaginator } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ClipBoardService } from '../../services/clipboard.service'
import { ServerService } from '../../services/server.service'
import { CampaignCreateModalComponent } from './campaign-create-modal/campaign-create-modal.component';
@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  showComponentLoader: boolean = false
  authToken: any = localStorage.getItem("token")
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  campaigns: any[] = []
  showChartStats: boolean = false
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  campaignCreateModalComponent: MatDialogRef<CampaignCreateModalComponent>
  constructor(
    private dialog: MatDialog,
    private serverService: ServerService,
    private titleService: Title,
    private clipBoardService: ClipBoardService
  ) {
    this.showComponentLoader = true
    this.titleService.setTitle('AutomateLeads - Campaign');
  }

  ngOnInit() {
    this.getAllCampaign()
  }

  getAllCampaign() {
    this.serverService.campaignList(this.authToken).subscribe(
      data => {
        this.campaigns = data
        this.showComponentLoader = false
      },
      err => {
        this.showComponentLoader = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }


  create() {
    this.campaignCreateModalComponent = this.dialog.open(CampaignCreateModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side',
    });
  }
}