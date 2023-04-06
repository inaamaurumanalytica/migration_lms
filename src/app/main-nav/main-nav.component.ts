import { Component, OnInit, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, pipe, Subscription, timer } from 'rxjs';
import { startWith, switchMap, skipWhile, takeUntil, map, timeout } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { ClipBoardService } from '../services/clipboard.service'
import { ServerService } from '../services/server.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { UserProfileModalComponent } from '../pages/users/user-profile-modal/user-profile-modal.component';
import { ResourceModalComponent } from './resource-modal/resource-modal.component';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent implements OnInit {
  userInfo: any = JSON.parse(localStorage.getItem("userInfo"))
  authToken: any = localStorage.getItem("token")

  sidebarFix: boolean = true
  sidebarPin: boolean = false
  notifications: any[] = []
  isExpanded = true;
  badge: any = ""
  showSubmenu: boolean = false;
  showSubmenu1: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  public dummyElem = document.createElement('DIV');
  menus = [];

  vendorDashboard = {
    'name': 'Dashboard',
    'icon': '/assets/images/sidenav-icon/ic_menu_home.png',
    'link': '/page/dashboard-vendor',
  }

  vendors = {
    'name': 'Vendors',
    'icon': '/assets/images/sidenav-icon/ic_menu_vender.png',
    'link': '/page/vendors',
  }

  clients = {
    'name': 'Clients',
    'icon': '/assets/images/sidenav-icon/ic_menu_partners.png',
    'link': '/page/clients',
  }

  campaign = {
    'name': 'Campaign',
    'icon': '/assets/images/sidenav-icon/ic_subscription.png',
    'link': '/page/campaign',
  }

  vendorLeads = {
    'name': 'Master Leads',
    'icon': '/assets/images/sidenav-icon/ic_menu_home.png',
    'link': '/page/leads',
  }

  vendorRules = {
    'name': 'Rules',
    'icon': '/assets/images/sidenav-icon/ic_menu_home.png',
    'link': '/page/assignment-rules',
  }

  vendorAuditLogs = {
    'name': 'Audit Logs',
    'icon': '/assets/images/sidenav-icon/ic_menu_audit_logs.png',
    'link': '/page/logs',
  }

  vendorCallReport = {
    'name': 'Call Reports',
    'icon': '/assets/images/sidenav-icon/ic_log-3.png',
    'link': '/page/call-report',
  }

  vendorLeadReport = {
    'name': 'Lead Reports',
    'icon': '/assets/images/sidenav-icon/ic_menu_lead-details.png',
    'link': '/page/lead-report',
  }

  clientDashboard = {
    'name': 'Dashboard',
    'icon': '/assets/images/sidenav-icon/ic_menu_home.png',
    'link': '/page/dashboard',
  }
  users = {
    'name': 'Users',
    'icon': '/assets/images/sidenav-icon/ic_menu_client.png',
    'link': '/page/users',
  }
  registration = {
    'name': 'Registration',
    'icon': '/assets/images/sidenav-icon/ic_menu_lead-generator.png',
    'link': '/page/registration',
  }

  project = {
    'name': 'Projects',
    'icon': '/assets/images/sidenav-icon/ic_menu_projects.png',
    'link': '/page/project',
  }

  whatsappRule = {
    'name': 'Whatsapp Rules',
    'icon': '/assets/images/sidenav-icon/ic_menu_projects.png',
    'link': '/page/whatsapp-rules',
  }

  lead = {
    'name': 'Master Leads',
    'icon': '/assets/images/sidenav-icon/ic_menu_leads.png',
    'link': '/page/leads',
  }
  rules = {
    'name': 'Rules',
    'icon': '/assets/images/sidenav-icon/ic_rule.png',
    'link': '/page/rules',
  }
  logs = {
    'name': 'Logs',
    'icon': '/assets/images/sidenav-icon/ic_logs.png',
    'link': '/page/logs',
  }
  clientNotification = {
    'name': 'Notifications',
    'icon': '/assets/images/sidenav-icon/ic_notification.png',
    'link': '/page/notification',
  }

  persona = {
    'name': 'Persona',
    'icon': '/assets/images/sidenav-icon/ic_menu_lead-generator.png',
    'link': '/page/persona',
  }

  bookings = {
    'name': 'Bookings',
    'icon': '/assets/images/sidenav-icon/ic_menu_booking.png',
    'link': '/page/bookings',
  }
  salesAccount = {
    'name': 'Sales Account',
    'icon': '/assets/images/sidenav-icon/ic_notification.png',
    'link': '/page/sales-account',
  }
  callLogs = {
    'name': 'Call Logs',
    'icon': '/assets/images/sidenav-icon/phone_forward.png',
    'link': '/page/call-logs',
  }


  userProfileModalComponent: MatDialogRef<UserProfileModalComponent>
  resourceModelComponent:MatDialogRef<ResourceModalComponent>

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );


  clientLead: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private serverService: ServerService,
    public clipBoardService: ClipBoardService,
  ) {
    this.clipBoardService.select(window.location.pathname)
    this.clipBoardService.isActive(window.location.pathname)
    if (this.authToken != null) {
      this.serverService.userInfo(this.authToken).subscribe(
        data => {
          localStorage.removeItem("userInfo")
          localStorage.setItem("userInfo", JSON.stringify(data))
        },
        err => {
          this.clipBoardService.checkServerError(err, this.authToken)
        }
      )
    } else {
      this.clipBoardService.backToLogin()
      return
    }
    if (this.userInfo.admin) {
      this.menus = []
      this.menus.push(this.vendorDashboard)
      this.menus.push(this.users)
      this.menus.push(this.project)
      this.menus.push(this.vendors)
      this.menus.push(this.clients)
      this.menus.push(this.lead)
      this.menus.push(this.campaign)
      this.menus.push(this.vendorAuditLogs)
      this.menus.push(this.bookings)
      this.menus.push(this.salesAccount)
      this.menus.push(this.callLogs);


    } else {
      if (this.userInfo.member_type == "Vendor") {
        this.menus = []
        if (this.userInfo.org_admin) {
          this.menus.push(this.vendorDashboard)
          this.menus.push(this.users)
          this.menus.push(this.project)
          this.menus.push(this.clients)
          this.menus.push(this.lead)
          this.menus.push(this.rules)
          this.menus.push(this.vendorAuditLogs)
          this.menus.push(this.vendorCallReport)
          this.menus.push(this.vendorLeadReport)
          this.menus.push(this.persona)
          this.menus.push(this.bookings)
          this.menus.push(this.whatsappRule)
        }
        //role == null

        // if (this.userInfo.role == null) {
        //   this.menus = []
        // //   if (this.userInfo.org_admin) {
        //     this.menus.push(this.vendorDashboard)

        // }

        else if (this.userInfo.role == "SalesAdmin") {
          this.menus.push(this.vendorDashboard)
          this.menus.push(this.project)

        }

        // changes made.....
        else {
          this.menus.push(this.project)
          // // this.menus.push(this.clients)
          this.menus.push(this.lead)
          this.menus.push(this.vendorAuditLogs)
          // this.menus.push(this.vendorDashboard);

        }

      } else {
        this.menus = []
        if (this.userInfo.org_admin) {
          this.menus.push(this.clientDashboard)
          this.menus.push(this.users)
          this.menus.push(this.project)
          // this.menus.push(this.vendors)
          this.menus.push(this.rules)
          // this.menus.push(this.registration)
        } else {
          this.menus.push(this.project)
          // this.menus.push(this.vendors)
          // this.menus.push(this.registration)
        }
        // this.menus.push(this.bookings)
      }
    }
  }

  ngOnInit() {

    // setTimeout(() => {
    //   alert('Hi')
    //   //this.getLeadCount()
    // }, 1000);


    this.getLeadCount()
  }

  logout() {
    localStorage.clear()
    sessionStorage.clear()
    this.clipBoardService.showMessgeInText("Logged Out Successfully", "success-snackbar")
    this.router.navigate([""])
  }

  pinActive() {
    this.sidebarPin = true;
    this.sidebarFix = false
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    })
  }

  pinDeactive() {
    this.sidebarPin = false;
    this.sidebarFix = true
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    })
  }

  showProfile() {
    this.userProfileModalComponent = this.dialog.open(UserProfileModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '500px',
      panelClass: 'cdk-overlay-panel-right-side'
    });
  }

  refresh() {
    this.router.navigateByUrl('/page/***', { skipLocationChange: true }).then(() =>
      this.router.navigate([location.pathname]));
  }


  subscription: any;
  getLeadCount() {

    this.subscription = timer(0, 5000).pipe(switchMap(() => this.serverService.getFreshLeadCount('get_lead_count', this.authToken))
    ).subscribe(data => {
      this.clientLead = data;
      //alert('Hi')
    }
    );

  }
  showResource(){
    const dialogRef = this.dialog.open(ResourceModalComponent, {
      hasBackdrop: true,
      disableClose: false,
      autoFocus: true,
      width: '600px',
      height:'190px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    
    });
  }
  

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
