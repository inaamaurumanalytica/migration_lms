import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { log } from 'console';
import { Observable } from 'rxjs';

@Injectable({
  
  providedIn: 'root'
})
export class CsAdminGuard implements CanActivateChild{
  constructor(public router:Router){

  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):any{
    let obj = JSON.parse(localStorage.getItem("userInfo"));
    let memberType = obj.member_type;
    let orgAdmin = obj.org_admin;
    let role = obj.role;
    let superAdmin = obj.admin;
    let accessUrls = [];
    if(memberType == "Client" && orgAdmin == true ){
      accessUrls = ['dashboard','new-client-project','users','project','rules','bookings','registration'];
    }
    else if(memberType == "Client" && orgAdmin == false){
      accessUrls = ['project','registration','bookings'];
    }
    else if(memberType == "Vendor" && orgAdmin == false && superAdmin == false && role !="SalesAdmin"){
      accessUrls = ['project','leads','logs'];
    }
    else if(memberType == "Vendor" && orgAdmin == true){
      accessUrls = ['edit-whatsapp-rule-entry','create-whatsapp-rule-entry','whatsapp-rule-entry','whatsapp-rules','dashboard-vendor','users','project','clients','leads','rules','logs','lead-report','call-report','persona','bookings','audience-recommendation-engine'];
    }
    else if(memberType == "Vendor" && role == "SalesAdmin"){
      accessUrls = ['dashboard-vendor','project'];
    }
    else if(superAdmin){
      accessUrls = ['call-logs','dashboard-vendor','sales-account-create-modal','sales-account','users','project','vendors','clients','leads','campaign','logs','bookings','permission','policy','color','persona','audience-recommendation-engine'];
    }
    let presentUrl = childRoute.url[0].path;
    if(memberType == "Vendor" && role == "SalesAdmin"){
      if(!accessUrls.includes(presentUrl))
      {
        this.router.navigate(['/page/dashboard-vendor']); 
      }
    }
    else{
      if(!accessUrls.includes(presentUrl)){
        let dashboard = memberType == "Client"? "dashboard":"dashboard-vendor";
        orgAdmin?this.router.navigate(['/page/'+dashboard]):this.router.navigate(['/page/project']);
      }
    }
    return true;
  }
}
