import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'
import * as Highcharts from 'highcharts';
import { IMyDateRangeModel, IMyDrpOptions } from 'mydaterangepicker';

@Component({
    selector: 'client-project-stats-modal',
    templateUrl: './client-project-stats-modal.component.html',
    styleUrls: ['./client-project-stats-modal.component.scss']
})
export class ClientProjectStatsModalComponent implements OnInit {
    authToken = localStorage.getItem("token")
    showProjectAccess: boolean = false
    public authInfo = JSON.parse(localStorage.getItem("authInfo"));
    public userInfo = JSON.parse(localStorage.getItem("userInfo"));
    highcharts = Highcharts;

    showComponentLoader = true;
    createdAt: any = "";
    myDateRangePickerOptions = {     
        dateFormat: 'dd.mm.yyyy'      
    };

    userChart = {
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

    score: any = []
    filterByStatus: any = []
    source = []
    medium = []
    campaign = []
    term = []
    content = []
    utmSource = []
    utmScore = []
    utmStats: any = {}

    totalCount = 0

    project: any = {}

    constructor(
        private serverService: ServerService,
        private clipBoardService: ClipBoardService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<ClientProjectStatsModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data
    ) {
        this.project = data
        
        this.getUTMStatus()
    }

    ngOnInit() { }

    getUTMStatus() {

        let body = {}

        if (this.filterByStatus.length != 0) {
            body["statuses"] = this.filterByStatus
        }
        if (this.score.length != 0) {
            body["score"] = this.score
        }

        if (this.createdAt != undefined && this.createdAt != "") {
            if (this.createdAt.formatted != undefined) {
              body["created_at"] = [this.createdAt.formatted.split(" - ")[0], this.createdAt.formatted.split(" - ")[1]];
            } else {
              body["created_at"] = this.createdAt
            }
          }

        this.totalCount = 0
        this.source = []
        this.medium = []
        this.campaign = []
        this.term = []
        this.content = []
        this.utmSource = []
        this.utmScore = []
        this.utmStats = {}
        this.showComponentLoader = true

        this.serverService.getUTMStatsByProject(this.data.id, body, this.authToken).subscribe(
            data => {
                this.utmStats = data
                for (let [key, value] of Object.entries(this.utmStats.utm_source_stats)) {
                    let body = {
                        type: key,
                        count: value
                    }
                    this.source.push(body)
                }
                if (this.source.length > 0) {
                    this.source.sort((a, b) => parseFloat(a.count) - parseFloat(b.count)).reverse()
                    this.source = this.percentage(this.source)
                }
                for (let [key, value] of Object.entries(this.utmStats.utm_medium_stats)) {
                    let body = {
                        type: key,
                        count: value
                    }
                    this.medium.push(body)
                }
                if (this.medium.length > 0) {
                    this.medium.sort((a, b) => parseFloat(a.count) - parseFloat(b.count)).reverse()
                    this.medium = this.percentage(this.medium)
                }
                for (let [key, value] of Object.entries(this.utmStats.utm_campaign_stats)) {
                    let body = {
                        type: key,
                        count: value
                    }
                    this.campaign.push(body)
                }
                if (this.campaign.length > 0) {
                    this.campaign.sort((a, b) => parseFloat(a.count) - parseFloat(b.count)).reverse()
                    this.campaign = this.percentage(this.campaign)
                }
                for (let [key, value] of Object.entries(this.utmStats.utm_term_stats)) {
                    let body = {
                        type: key,
                        count: value
                    }
                    this.term.push(body)
                }
                if (this.term.length > 0) {
                    this.term.sort((a, b) => parseFloat(a.count) - parseFloat(b.count)).reverse()
                    this.term = this.percentage(this.term)
                }
                for (let [key, value] of Object.entries(this.utmStats.utm_content_stats)) {
                    let body = {
                        type: key,
                        count: value
                    }
                    this.content.push(body)
                }
                if (this.content.length > 0) {
                    this.content.sort((a, b) => parseFloat(a.count) - parseFloat(b.count)).reverse()
                    this.content = this.percentage(this.content)
                }
                for (let [key, value] of Object.entries(this.utmStats.source_stats)) {
                    let body = {
                        type: key,
                        count: value
                    }
                    this.utmSource.push(body)
                }
                if (this.utmSource.length > 0) {
                    this.utmSource.sort((a, b) => parseFloat(a.count) - parseFloat(b.count)).reverse()
                    this.utmSource = this.percentage(this.utmSource)
                }
                for (let [key, value] of Object.entries(this.utmStats.score_stats)) {
                    let body = {
                        type: key,
                        count: value
                    }
                    this.utmScore.push(body)
                }
                if (this.utmScore.length > 0) {
                    this.utmScore.sort((a, b) => parseFloat(a.count) - parseFloat(b.count)).reverse()
                    this.utmScore = this.percentage(this.utmScore)
                }
                if (this.createdAt != undefined && this.createdAt != "") {
                    body["createdAt"] = this.createdAt
                }
                this.showComponentLoader = false
            },
            err => {
                this.showComponentLoader = false
                this.clipBoardService.checkServerError(err, '')
            }
        )
    }

    close() {
        this.dialogRef.close()
    }

    reset() {
        this.filterByStatus = []
        this.score = []
        this.createdAt = []
        this.getUTMStatus()
    }

    percentage(value) {
        this.totalCount = this.sumTotal(value)
        for (let index = 0; index < value.length; index++) {
            value[index].percentage = (100 * value[index].count) / this.totalCount;
            value[index].percentage = value[index].percentage.toFixed(2)
        }
        return value
    }

    sumTotal(data) {
        return data.reduce((sum, { count }) => sum + count, 0)
    }
}

