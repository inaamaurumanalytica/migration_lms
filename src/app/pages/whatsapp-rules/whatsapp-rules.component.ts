import { Component, OnInit } from "@angular/core";
import { ServerService } from "../../services/server.service";
import { ClipBoardService } from "../../services/clipboard.service";
import {
  MatPaginator,
  MatSort,
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
  MatMenuTrigger,
} from "@angular/material";
import { CreateWhatsappRulesComponent } from "../create-whatsapp-rules/create-whatsapp-rules.component";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
@Component({
  selector: "app-whatsapp-rules",
  templateUrl: "./whatsapp-rules.component.html",
  styleUrls: ["./whatsapp-rules.component.scss"],
})
export class WhatsappRulesComponent implements OnInit {
  filteredRules: any[] = [];
  elasticSearch: any = "";
  showComponentLoader: boolean = false;
  authToken: any = localStorage.getItem("token");
  authInfo: any = JSON.parse(localStorage.getItem("authInfo"));
  createWhatsappRulesMatDialog: MatDialogRef<CreateWhatsappRulesComponent>;
  projects: any;

  rules: any[] = [];
  action = "exit";
  constructor(
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit() {
    this.clipBoardService.whatsappRuleAssignmnetInfo = [];
    //this.getProjects();

    // setTimeout(() => {
    //   this.getAllRules();
    //   console.log('Hi')
    // }, 10000);

    this.getAllRules()
  }
  
  getAllRules() {
    this.showComponentLoader = true;
    this.serverService.whatsappRuleList(this.authToken).subscribe(
      (data) => {
        this.showComponentLoader = false;
        this.rules = data;
        this.filteredRules = data;
      },
      (err) => {
        this.showComponentLoader = false;
        this.clipBoardService.checkServerError(
          err,
          localStorage.getItem("token")
        );
      }
    );
  }

  createWhatsappRule() {
    this.createWhatsappRulesMatDialog = this.dialog.open(
      CreateWhatsappRulesComponent,
      {
        hasBackdrop: true,
        disableClose: true,
        width: "400px",
        autoFocus: true,
      }
    );
    this.createWhatsappRulesMatDialog.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.showComponentLoader = true;
        this.getAllRules();
      }
    });
  }
  edit(value) {
    this.clipBoardService.whatsappRuleAssignmnetInfo = value;
    this.router.navigate(["page/whatsapp-rule-entry"]);
  }

  searchRule() {
    this.filteredRules = this.rules.filter(
      (el) =>
        el.rule_name.toLowerCase().includes(this.elasticSearch.toLowerCase()) ||
        el.project.name
          .toLowerCase()
          .includes(this.elasticSearch.toLowerCase()) ||
        el.created_by.toLowerCase().includes(this.elasticSearch.toLowerCase())
    );
  }

  removeSearch() {
    this.elasticSearch = "";
    this.getAllRules();
  }
  delete(value) {
    let body = {
      project_id: value.project_id,
    };
    this.serverService
      .deleteWhatsappRule(value.id, body, this.authToken)
      .subscribe(
        (data) => {
          this.snackBar.open("Deleted Successfully", this.action, {
            duration: 2000,
            verticalPosition: "top",
            horizontalPosition: "end",
            panelClass: "blue-snackbar",
          });
          this.getAllRules();
        },
        (err) => {
          this.clipBoardService.checkServerError(
            err,
            localStorage.getItem("token")
          );
        }
      );
  }
  getProjects() {
    this.serverService.projectsList(localStorage.getItem("token")).subscribe(
      (data) => {
        this.projects = data;
        console.log(this.projects);
        // this.showAssignUser = true;
      },
      (err) => {
        // this.showAssignUser = false;
        // this.dialogRef.close();
        this.clipBoardService.checkServerError(
          err,
          localStorage.getItem("token")
        );
      }
    );
  }
}
