import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class ServerService {

  // public apiUrl = "https://lmsv2api.persquarefeet.in/";
  public mlApiUrl = "https://mlapi.persquarefeet.in/";
  public leadUrl = "https://socialsearchapi.dataasinsights.com/";
  public apiContactUrl = "https://mlapi.persquarefeet.in";

  // for production
  // public apiUrl = "https://lmsapi.persquarefeet.in/";
  
  // for staging
   public apiUrl = "https://staginglmsapi.persquarefeet.in/";

  

  // for ngrock testing
  // public apiUrl = "https://e19b-125-63-121-60.ngrok.io/";

  // public apiUrl = "http://192.168.0.98:3000/";
  // public apiUrl = "https://staginglmsv2api.persquarefeet.in/";

  constructor(private http: Http, private httpClient: HttpClient) { }

  loginPost(url, body): Observable<Response> {
    var headers = new Headers({
      'Content-Type': 'application/json'
      
    });

    var options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + url, body, options)
  }
  contactPost(url, body): Observable<Response> {
    var headers = new Headers({
    });

    var options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiContactUrl + url, body, options)
  }

  verifyPost(url, body): Observable<Response> {
    var headers = new Headers({
      'Content-Type': 'application/json'
    });

    var options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + url, body, options)
  }

  post(url, body, token): Observable<Response> {
    var headers = new Headers({
      'Authorization': token,
    });

    var options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + url, body, options)
  }

  leadpost(url, body, token): Observable<Response> {
    var headers = new Headers({
      Authorization: 'SS-Token ' + token
    });

    var options = new RequestOptions({ headers: headers });
    return this.http.post(this.leadUrl + url, body, options);
  }

  mlPost(url, body): Observable<Response> {
    var headers = new Headers({
      'Content-Type': 'application/json'
    });

    var options = new RequestOptions({ headers: headers });
    return this.http.post(this.mlApiUrl + url, body, options)
  }

  put(url, body, token): Observable<Response> {
    var headers = new Headers({
      'Authorization': token,
    });

    var options = new RequestOptions({ headers: headers });
    return this.http.put(this.apiUrl + url, body, options)
  }

  delete(url, token): Observable<Response> {
    var headers = new Headers({
      'Authorization': token,
    });

    var options = new RequestOptions({ headers: headers });
    return this.http.delete(this.apiUrl + url, options)
  }

  deleteInDiff(url, body, token): Observable<Response> {
    var headers = new Headers({
      'Authorization': token,
    });

    var options = new RequestOptions({ headers: headers, body: body });
    return this.http.delete(this.apiUrl + url, options)
  }

  get(url, token): Observable<Response> {
    var headers = new Headers({
      'Authorization': token,
    });
    var options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiUrl + url, options)
  }
  getWToken(url): Observable<Response> {
    var headers = new Headers({

    });
    var options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiUrl + url, options)
  }

  getHtml(url, token): Observable<Response> {
    var headers = new Headers({
      'Authorization': token,
      'Content-Type': 'text/html'
    });
    var options = new RequestOptions({ headers: headers });
    return this.http.get(this.apiUrl + url, options)
  }

  // Authenticate with login
  login(data): Observable<any> {
    return this.loginPost('authenticate', data).pipe(map(response => response.json()));
  }

  // Sign up
  signup(url, data): Observable<any> {
    return this.loginPost(url, data).pipe(map(response => response.json()));
  }

  // CHnage Password
  changePassword(data, token): Observable<any> {
    return this.post('change_password', data, token).pipe(map(response => response.json()));
  }

  // Verify email
  verifyEmail(data): Observable<any> {
    let body = {
      "email": data.email,
      "email_verification_token": data.code
    }
    return this.verifyPost('verify_email', body).pipe(map(response => response.json()));
  }

  // Forgot Password
  forgotpassword(data): Observable<any> {
    return this.loginPost('forgot_password', data).pipe(map(response => response.json()));
  }

  checkForgotPasswordToken(data): Observable<any> {
    let body = {
      "email": data.email,
      "token": data.code
    }
    return this.verifyPost('check_forgot_password_token', body).pipe(map(response => response.json()));
  }


  // reset Password
  resetPassword(data, data1): Observable<any> {
    let body = {
      "email": data.email,
      "token": data.code,
      "password": data1.password,
      "password_confirmation": data1.password_confirmation
    }
    return this.verifyPost('reset_password', body).pipe(map(response => response.json()));
  }

  // Get User Info after login
  userInfo(token: string): Observable<any> {
    return this.get('user_info', token).pipe(map(response => response.json()));
  }

  // get users
  allUsers(url, token: string): Observable<any> {
    return this.get(url, token).pipe(map(response => response.json()));
  }

  getUsersByFilter(url, body, token: string): Observable<any> {
    return this.post(url, body, token).pipe(map(response => response.json()));
  }

  updateUserActive(body, token: string): Observable<any> {
    return this.put('update_user_active', body, token).pipe(map(response => response.json()));
  }

  updateUserOrgAdminStatus(body, token: string): Observable<any> {
    return this.put('update_user_org_admin_status', body, token).pipe(map(response => response.json()));
  }

  resendEmail(body, token: string): Observable<any> {
    return this.post('resend_email_verification', body, token).pipe(map(response => response.json()));
  }

  clientUploadUserImage(body, token: string): Observable<any> {
    return this.post('avatar_update', body, token).pipe(map(response => response.json()));
  }
  updateUser(body, token: string): Observable<any> {
    return this.post('update_user', body, token).pipe(map(response => response.json()));
  }

  getAssignedUsersByProjectId(id,token): Observable<any> {
    return this.get('get_users_by_project/'+id, token).pipe(map(response => response.json()));
  }

  /* -------------------Start API for Vednor Dashborad------------- */
  getStats(token: string): Observable<any> {
    return this.get('stats', token).pipe(map(response => response.json()));
  }

  // Stats for CLient User
  getUsersStats(data, token): Observable<any> {
    return this.post('client_users_stats', data, token).pipe(map(response => response.json()));
  }

  getUserStats(data, token): Observable<any> {
    return this.post('client_user_stats', data, token).pipe(map(response => response.json()));
  }

  getStatsByProject(id, token): Observable<any> {
    return this.get('project_stats/' + id, token).pipe(map(response => response.json()));
  }

  multiDeleteLead(ids, token): Observable<any> {
    return this.post('disable_multiple_leads', ids, token).pipe(map(response => response.json()));
  }

  leadsListByPage(data, token: string): Observable<any> {
    return this.get(data, token).pipe(map(response => response.json()));
  }

  /* -------------------End API for Vednor Data------------- */


/*------------------------------------------------------*/



  deleteInsight(url,body,token){
    return this.post(url,body, token).pipe(map(response => response.json()));

  }
/*------------------------------------------------------*/
  /* -------------------Start CLient List APIs------------- */
  vendorsList(token: string): Observable<any> {
    return this.get('vendors', token).pipe(map(response => response.json()));
  }

  vendorsListByFilter(url, body, token: string): Observable<any> {
    return this.post(url, body, token).pipe(map(response => response.json()));
  }

  getVendorById(id, token: string): Observable<any> {
    return this.get('vendors/' + id, token).pipe(map(response => response.json()));
  }

  createVendor(data, token): Observable<any> {
    return this.post('vendors', data, token).pipe(map(response => response.json()));
  }

  updateVendor(id, data, token): Observable<any> {
    return this.put('vendors/' + id, data, token).pipe(map(response => response.json()));
  }

  disbaleVendor(id, data, token): Observable<any> {
    return this.put('vendors/' + id, data, token).pipe(map(response => response.json()));
  }

  /* -------------------ENd Vendor List APIs------------- */

  /* -------------------Start CLient List APIs------------- */
  clientsList(token: string): Observable<any> {
    return this.get('clients', token).pipe(map(response => response.json()));
  }

  clientsListByFilter(url, body, token: string): Observable<any> {
    return this.post(url, body, token).pipe(map(response => response.json()));
  }

  getClientById(id, token: string): Observable<any> {
    return this.get('clients/' + id, token).pipe(map(response => response.json()));
  }

  createClient(data, token): Observable<any> {
    return this.post('clients', data, token).pipe(map(response => response.json()));
  }

  updateClient(client, data, token): Observable<any> {
    return this.put('clients/' + client.id, data, token).pipe(map(response => response.json()));
  }

  disbaleClient(client, data, token): Observable<any> {
    return this.put('clients/' + client.id, data, token).pipe(map(response => response.json()));
  }

  exportClientAnalysis(id, token): Observable<any> {
    return this.get('export_client_analysis/' + id, token).pipe(map(response => response));
  }
  /* -------------------End CLient List APIs------------- */

  /* -------------------Start Whatsapp APIs------------- */


  deleteWithBody(url, body, token): Observable<Response> {
    var headers = new Headers({
      'Authorization': token,
    });

    var options = new RequestOptions({ headers: headers, body: body });
    return this.http.delete(this.apiUrl + url, options)
  }

  whatsappRuleList(token): Observable<any> {
    return this.get('whats_app_rules', token).pipe(map(response => response.json()));
  }

  createWhatsappRule(body, token): Observable<any> {
    return this.post('whats_app_rules', body, token).pipe(map(response => response.json()));
  }
  deleteWhatsappRule(id, body, token): Observable<any> {
    return this.deleteWithBody('whats_app_rules/' + id, body, token).pipe(map(response => response.json()));
  }
  criteriaByWhatsappId(id, token): Observable<any> {
    return this.get('whats_app_rules/' + id, token).pipe(map(response => response.json()));
  }
  
  updateWhatsappCriteria(id, data, token): Observable<any> {
    return this.put('whats_app_rule_criteria/' + id, data, token).pipe(map(response => response.json()));
  }

  updateWhatsappActiveRuleCriteria(id, data, token): Observable<any> {
    return this.put('rule_criteria_active/' + id, data, token).pipe(map(response => response.json()));
  }

  // deleteWhatsappCriteria(id:any,project_id:any): Observable<any> {
  //   debugger
  //   let token = localStorage.getItem('token');
  //   let httpHeaders = new HttpHeaders().set('Authorization', token);
  //   return this.httpClient.delete('whats_app_rule_criteria/' + id, {headers:httpHeaders, params: project_id })    
  // }

  deleteWhatsappCriteria(id,body,token): Observable<any> {
    // let token = localStorage.getItem('token');
    // let httpHeaders = new HttpHeaders().set('Authorization',token);
    // this.httpClient.delete()
    return this.deleteWithBody('whats_app_rule_criteria/' +id, body, token).pipe(map(response => response.json()));
  }


  createWhatsappCriteria(body, token): Observable<any> {
    return this.post('whats_app_rule_criteria', body, token).pipe(map(response => response.json()));
  }

  updateActiveWhatsappRule(id, body, token): Observable<any> {
    return this.put('whats_app_rules/' + id, body, token).pipe(map(response => response.json()));
  }

  // deleteWhatsappRule(id, body, token): Observable<any> {
  //   return this.deleteWithBody('whats_app_rules/' + id, body, token).pipe(map(response => response.json()));
  // }
    /* -------------------End Whatsapp APIs------------- */

  /* -------------------Start Permissions List APIs------------- */
  // Users API Call
  getPermissionList(token: string): Observable<any> {
    return this.get('permissions', token).pipe(map(response => response.json()));
  }

  createPermission(data, token): Observable<any> {
    return this.post('permissions', data, token).pipe(map(response => response.json()));
  }

  givePermissionToUser(data, token): Observable<any> {
    return this.post('add_permission_to_user', data, token).pipe(map(response => response.json()));
  }

  removePermissionToUser(data, token): Observable<any> {
    return this.post('remove_permission_from_user', data, token).pipe(map(response => response.json()));
  }
  /* -------------------End Permissions List APIs------------- */


  /* -------------------End Color List APIs------------- */

  getLeadColor(token) {
    return this.get('colors', token).pipe(map(response => response.json()));
  }

  createLeadColor(data, token): Observable<any> {
    return this.post('colors', data, token).pipe(map(response => response.json()));
  }

  updateLeadColor(id, data, token): Observable<any> {
    return this.put('colors/' + id, data, token).pipe(map(response => response.json()));
  }

  deleteLeadColor(id, token): Observable<any> {
    return this.delete('colors/' + id, token).pipe(map(response => response.json()));
  }

  setLeadColor(id, data, token): Observable<any> {
    return this.put('lead_color_update/' + id, data, token).pipe(map(response => response.json()));
  }

  resetLeadColor(id, token): Observable<any> {
    return this.put('reset_color/' + id, '', token).pipe(map(response => response.json()));
  }
  /* -------------------End Color List APIs------------- */


  /* -------------------Start Policy List APIs------------- */
  createPolicy(data, token): Observable<any> {
    return this.post('legal_docs', data, token).pipe(map(response => response.json()));
  }

  getPolicy(token): Observable<any> {
    return this.get('legal_docs', token).pipe(map(response => response.json()));
  }

  updatePublishPolicy(data, token): Observable<any> {
    return this.post('update_published/', data, token).pipe(map(response => response.json()));
  }

  // getPolicyByPP(token): Observable<any> {
  //     return this.getHtml('legal_doc/?doc_type=PP', token).pipe(map(response => response));
  // }

  // getPolicyByTANDC(token): Observable<any> {
  //     return this.getHtml('legal_doc/?doc_type=TANDC', token).pipe(map(response => response));
  // }

  /* -------------------End Policy List APIs------------- */

  /* -------------------End Lead Attachment List APIs------------- */
  // Lead Attachment
  uploadLeadAttachment(data, token): Observable<any> {
    return this.post('lead_attachments/', data, token).pipe(map(response => response.json()));
  }
  editLeadAttachment(data, formdata, token): Observable<any> {
    return this.put('lead_attachments/' + data.id, formdata, token).pipe(map(response => response.json()));
  }
  deleteLeadAtachment(id, token): Observable<any> {
    return this.delete('lead_attachments/' + id, token).pipe(map(response => response.json()));
  }
  auditLogList(url, token): Observable<any> {
    return this.get('get_audit_logs/?' + url, token).pipe(map(response => response.json()));
  }

  /* -------------------End Lead Attachment List APIs------------- */


  /* -------------------Start User List APIs------------- */
  usersList(token: string): Observable<any> {
    return this.get('all_users', token).pipe(map(response => response.json()));
  }

  getUserById(data, token: string): Observable<any> {
    return this.get('show_user/' + data.id, token).pipe(map(response => response.json()));
  }

  createUser(data, token): Observable<any> {
    return this.post('create_user', data, token).pipe(map(response => response.json()));
  }

  disbaleUser(data, token): Observable<any> {
    return this.put('update_user_status', data, token).pipe(map(response => response.json()));
  }

  updateUserOrganistationAdminStatus(data, token): Observable<any> {
    return this.put('update_user_org_admin_status', data, token).pipe(map(response => response.json()));
  }

  verifyNumber(id, body, token): Observable<any> {
    return this.put('virtual_verify_phone/' + id, body, token).pipe(map(response => response.json()));
  }

  virtualVerifyEmail(id, body, token): Observable<any> {
    return this.put('virtual_verify_email/' + id, body, token).pipe(map(response => response.json()));
  }

  getUserToken(id, token): Observable<any> {
    return this.get('get_user_token/' + id, token).pipe(map(response => response.json()));
  }

  getUsersByProject(id, token): Observable<any> {
    return this.get('get_users_by_project/' + id, token).pipe(map(response => response.json()));
  }

  // Assigned User to Lead
  assignedUser(data, token: string): Observable<any> {
    return this.post('update_lead_assignee', data, token).pipe(map(response => response.json()));
  }

  // Assigned multiple Leads to User
  multiLeadAssignedUser(data, token: string): Observable<any> {
    return this.post('update_leads_assignee', data, token).pipe(map(response => response.json()));
  }
  /* -------------------End User List APIs------------- */

 /* -------------------Start Sales Account APIs------------- */

  createSalesAccount(body,token:string): Observable<any>{
    return this.post('sales_account', body, token).pipe(map(response => response.json()));
  }
  
  getSalesAccountList(url,token){
    return this.get(url,token).pipe(map(response=>response.json()))
  }

  assignedUserOnSalesAccount(body,token): Observable<any>{
    return this.post('sales_account/assign_user',body, token).pipe(map(response => response.json()));

  }

  updateSalesAccountStatus(id,body,token):Observable<any>{
    return this.put('sales_account/'+id,body, token).pipe(map(response => response.json()));
  }

  assignedProjectToSalesAccount(body,token:string): Observable<any>{
    return this.post('sales_account/assign_project', body, token).pipe(map(response => response.json()));
  }

  getAssignedProjectsSalesAccount(id,token:string):Observable<any>{
    return this.get('sales_account/project_list?sales_account_id='+id,token).pipe(map(response => response.json()));
  }

  getAssignedUsersSalesAccount(id,token:string):Observable<any>{
    return this.get('sales_account/user_list?sales_account_id='+id,token).pipe(map(response => response.json()));
  }
  assignedUsersToSalesAccount(body,token:string): Observable<any>{
    return this.post('sales_account/assign_user', body, token).pipe(map(response => response.json()));
  }

  unAssignUsersSalesAccount(body,token:string): Observable<any>{
    return this.post('sales_account/unassigned_user', body, token).pipe(map(response => response.json()));
  }

  unAssignProjectsSalesAccount(body,token:string): Observable<any>{
    return this.post('sales_account/unassign_project', body, token).pipe(map(response => response.json()));
  }

  getLeadByIdSalesAccount(body, token: string): Observable<any> {
    return this.post('sales/lead_detail',body, token).pipe(map(response => response.json()));
  }
   /* -------------------End Sales Account APIs------------- */

  /* -------------------Start Project List APIs------------- */
  projectsList(token: string): Observable<any> {
    return this.get('projects', token).pipe(map(response => response.json()));
  }

  projectsListByFilter(url, body, token: string): Observable<any> {
    return this.post(url, body, token).pipe(map(response => response.json()));
  }

  getProjectById(data, token: string): Observable<any> {
    return this.get('projects/' + data.id, token).pipe(map(response => response.json()));
  }

  projectLeadsStatus(data, token: string): Observable<any> {
    return this.get('project_stats/' + data, token).pipe(map(response => response.json()));
  }

  getLeadsOfProject(data, token: string): Observable<any> {
    return this.get(data, token).pipe(map(response => response.json()));
  }

  createProject(data, token): Observable<any> {
    return this.post('projects', data, token).pipe(map(response => response.json()));
  }

  leadSendToMI(id, token): Observable<any> {
    return this.post('projects/send_marketing_data', id, token).pipe(map(response => response.json()));
  }

  deleteProject(id, token): Observable<any> {
    return this.delete('projects/' + id, token).pipe(map(response => response.json()));
  }

  updateProject(project, data, token): Observable<any> {
    return this.put('projects/' + project.id, data, token).pipe(map(response => response.json()));
  }

  approvedProject(data, token): Observable<any> {
    return this.post('projects/approved', data, token).pipe(map(response => response.json()));
  }

  projectUpdateExtraFields(project, data, token): Observable<any> {
    return this.post('project_update_extra_fields/' + project.id, data, token).pipe(map(response => response.json()));
  }
  deleteBroucher(body, token): Observable<any> {
    return this.post('purge_brochure/', body, token).pipe(map(response => response.json()));
  }
  getProjectBrochure(id, token: string): Observable<any> {
    return this.get('get_project_brochure/' + id, token).pipe(map(response => response.json()));
  }

  getAssignedProjects(data, token: string): Observable<any> {
    return this.get('get_projects_by_user/' + data.id, token).pipe(map(response => response.json()));
  }

  giveProjectAccess(data, token): Observable<any> {
    return this.post('give_project_access', data, token).pipe(map(response => response.json()));
  }

  removeProjectAccess(data, token): Observable<any> {
    return this.post('remove_project_access', data, token).pipe(map(response => response.json()));
  }

  updateSmsConfiguration(body, token): Observable<any> {
    return this.post('update_sms_configuration/', body, token).pipe(map(response => response.json()));
  }

  uploadProjectAvatar(body, token): Observable<any> {
    return this.post('update_project_avatar/', body, token).pipe(map(response => response.json()));
  }

  updateQualified(id, data, token): Observable<any> {
    return this.post('update_qualified_or_expiry/' + id, data, token).pipe(map(response => response.json()));
  }

  updateAlowShuffling(id, data, token): Observable<any> {
    return this.post('update_allow_shuffling/' + id, data, token).pipe(map(response => response.json()));
  }


  // Copy Leads to project
  copyLeadsToProject(body, token): Observable<any> {
    return this.post('copy_leads_between_projects', body, token).pipe(map(response => response.json()));
  }

  autoEmailNotify(id, data, token): Observable<any> {
    return this.post('update_notify_user_on_form_submit/' + id, data, token).pipe(map(response => response.json()));
  }

  removeNegativeStatus(data, token): Observable<any> {
    return this.post('update_project_remove_negative/', data, token).pipe(map(response => response.json()));
  }

  statusChangedAfterTat(data, token): Observable<any> {
    return this.post('update_project_status_changed_to_ni_after_tat/', data, token).pipe(map(response => response.json()));
  }

  telephonyCHange(data, token): Observable<any> {
    return this.post('update_project_toggle_telephony/', data, token).pipe(map(response => response.json()));
  }

  recordingAccessToClient(data, token): Observable<any> {
    return this.post('update_project_toggle_recording_access_to_client/', data, token).pipe(map(response => response.json()));
  }

  updateAutoVerified(id, data, token): Observable<any> {
    return this.post('update_auto_verify/' + id, data, token).pipe(map(response => response.json()));
  }

  updateClientAutoAssigned(id, data, token): Observable<any> {
    return this.post('update_client_auto_assign/' + id, data, token).pipe(map(response => response.json()));
  }

  multiAssignedUser(project_id, ids, token): Observable<any> {
    return this.post('assign_unassigned_leads_to_users/' + project_id, ids, token).pipe(map(response => response.json()));
  }

  /* -------------------End Project List APIs------------- */

  /* -------------------Start Facebook List APIs------------- */
  fbUserCreate(data, token): Observable<any> {
    return this.post('facebook_users', data, token).pipe(map(response => response.json()));
  }

  fbUserUpdate(id, data, token): Observable<any> {
    return this.put('facebook_user_update/' + id, data, token).pipe(map(response => response.json()));
  }

  fbAppData(data, token): Observable<any> {
    return this.post('generate_long_live_token', data, token).pipe(map(response => response.json()));
  }

  getFbUser(data, token): Observable<any> {
    return this.get('get_facebook_user_pages/' + data, token).pipe(map(response => response.json()));
  }

  getAssignedProjectsByAds(data, token): Observable<any> {
    return this.get('get_projects_by_ads/' + data, token).pipe(map(response => response.json()));
  }

  assignedFbIdToProject(data, token): Observable<any> {
    return this.post('ad_assign_to_project/', data, token).pipe(map(response => response.json()));
  }

  unAssignedFbIdToProject(data, token): Observable<any> {
    return this.post('ad_unassign_from_projects/', data, token).pipe(map(response => response.json()));
  }
  /* -------------------End Facebook List APIs------------- */

  /* -------------------Start Managment List APIs------------- */
  getClientsByVendor(data, token): Observable<any> {
    return this.post('clients_of_vendor', data, token).pipe(map(response => response.json()));
  }

  getVendorsByClient(data, token): Observable<any> {
    return this.post('vendors_of_client', data, token).pipe(map(response => response.json()));
  }

  createRelation(data, token): Observable<any> {
    return this.post('create_relation', data, token).pipe(map(response => response.json()));
  }

  removeRelation(data, token): Observable<any> {
    return this.post('remove_relation', data, token).pipe(map(response => response.json()));
  }

  getUnassignedClients(data, token): Observable<any> {
    return this.post('unassigned_clients_of_vendor', data, token).pipe(map(response => response.json()));
  }

  getUnassignedVendors(data, token): Observable<any> {
    return this.post('unassigned_vendors_of_client', data, token).pipe(map(response => response.json()));
  }

  allowApplogin(body, token): Observable<any> {
    return this.post('allow_app_login/', body, token).pipe(map(response => response.json()));
  }
  /* -------------------End Managment List APIs------------- */

  /* -------------------Start Registration List APIs------------- */

  createRegistration(data, token): Observable<any> {
    return this.post('my_registrations', data, token).pipe(map(response => response.json()));
  }

  getRegistration(url, token): Observable<any> {
    return this.get(url, token).pipe(map(response => response.json()));
  }

  deleteRegistration(id, token): Observable<any> {
    return this.delete('my_registrations/' + id, token).pipe(map(response => response.json()));
  }

  // project time limit registration

  timeLimitRegistration(id, data, token): Observable<any> {
    return this.post('update_registration_time/' + id, data, token).pipe(map(response => response.json()));
  }
  /* -------------------ENd Registration List APIs------------- */

  /* -------------------Start Assignment Rules List APIs------------- */
  // Assignment Rules
  assignmentList(token): Observable<any> {
    return this.get('assignment_rules', token).pipe(map(response => response.json()));
  }

  assignmentListByProjectId(project_id, token): Observable<any> {
    return this.get('assignment_rules_by_project/' + project_id, token).pipe(map(response => response.json()));
  }

  criteriaByAssignmnetId(id, token): Observable<any> {
    return this.get('assignment_rules/' + id, token).pipe(map(response => response.json()));
  }

  createAssignment(data, token): Observable<any> {
    return this.post('assignment_rules', data, token).pipe(map(response => response.json()));
  }

  fetchEntryList(token): Observable<any> {
    return this.get('rule_entries/', token).pipe(map(response => response.json()));
  }

  createCriteria(data, token): Observable<any> {
    return this.post('assignment_rule_criteria', data, token).pipe(map(response => response.json()));
  }

  deleteAssignment(data, token): Observable<any> {
    return this.delete('assignment_rules/' + data.id, token).pipe(map(response => response.json()));
  }

  deleteCriteria(data, token): Observable<any> {
    return this.delete('assignment_rule_criteria/' + data.id, token).pipe(map(response => response.json()));
  }

  updateCriteria(id, data, token): Observable<any> {
    return this.put('assignment_rule_criteria/' + id, data, token).pipe(map(response => response.json()));
  }

  updateActiveAssignment(id, data, token): Observable<any> {
    return this.put('assignment_rules/' + id, data, token).pipe(map(response => response.json()));
  }

  updateActiveRuleCriteria(id, data, token): Observable<any> {
    return this.put('rule_criteria_active/' + id, data, token).pipe(map(response => response.json()));
  }

  /* -------------------End Assignment Rules List APIs------------- */

  // Upload Leads
  uploadLead(data, token): Observable<any> {
    return this.post('bulk_upload_leads', data, token).pipe(map(response => response.json()));
  }
  bulkUpdateLeads(data, token): Observable<any> {
    return this.post('bulk_update_leads', data, token);
  }

  /* -------------------Start Campaign List APIs------------- */
  // Campaign Api call
  campaignList(token: string): Observable<any> {
    return this.get('conversion_sms_campaigns', token).pipe(map(response => response.json()));
  }

  getCampaignById(data, token: string): Observable<any> {
    return this.get('conversion_sms_campaigns/' + data.id, token).pipe(map(response => response.json()));
  }

  createCampaign(data, token): Observable<any> {
    return this.post('conversion_sms_campaigns', data, token).pipe(map(response => response.json()));
  }

  shortenUrl(data, token: string): Observable<any> {
    return this.get('shorten?long_url=' + data, token).pipe(map(response => response.json()));
  }

  /* -------------------End Campaign List APIs------------- */

  /* -------------------Start Leads List APIs------------- */
  // Leads API Call
  leadsElasticSearch(url, data, token): Observable<any> {
    return this.post(url, data, token).pipe(map(response => response.json()));
  }

  leadsList(token: string): Observable<any> {
    return this.get('leads', token).pipe(map(response => response.json()));
  }

  getLeadById(data, token: string): Observable<any> {
    return this.get('leads/' + data.id, token).pipe(map(response => response.json()));
  }

  getLeadDetailById(id, token: string): Observable<any> {
    return this.get('leads/' + id, token).pipe(map(response => response.json()));
  }

  createLead(data, token): Observable<any> {
    return this.post('leads', data, token).pipe(map(response => response.json()));
  }

  updateLead(lead, data, token): Observable<any> {
    return this.put('leads/' + lead.id, data, token).pipe(map(response => response.json()));
  }

  deleteLead(id, token): Observable<any> {
    return this.delete('leads/' + id, token).pipe(map(response => response.json()));
  }

  exportLead(data, token): Observable<any> {
    return this.post('export_leads', data, token).pipe(map(response => response));
  }

  // update_lead_pref_loc_budget
  updateLeadPrefLocBudget(body, token): Observable<any> {
    return this.post('update_lead_pref_loc_budget', body, token).pipe(map(response => response.json()));
  }

  // Get Projecy Adress
  getProjectAddress(token): Observable<any> {
    return this.get('get_project_addresses', token).pipe(map(response => response.json()));
  }

  getLeadRemarks(url, token): Observable<any> {
    return this.get(url, token).pipe(map(response => response.json()));
  }

  // notify User
  notifyUser(data, token): Observable<any> {
    let body = {
      "project_id": data.id
    }
    return this.post('notify_client_users', body, token).pipe(map(response => response.json()));
  }

  // Get Call List
  callsList(id, token): Observable<any> {
    return this.get('get_all_calls?lead_id=' + id, token).pipe(map(response => response.json()));
  }

  makeCall(body, token): Observable<any> {
    return this.post('make_call/', body, token).pipe(map(response => response.json()));
  }

  assignLeadCountOfProject(data, token): Observable<any> {
    return this.post('assign_lead_count_of_project/', data, token).pipe(map(response => response.json()));
  }

  activeUserByProject(data, token): Observable<any> {
    return this.get('get_active_users_by_project/' + data, token).pipe(map(response => response.json()));
  }

  transferLeads(data, token): Observable<any> {
    return this.post('assign_user_leads_to_reassign_multiple_users/', data, token).pipe(map(response => response.json()));
  }

  /* -------------------End Leads List APIs------------- */

  /* -------------------Start Webhook List APIs------------- */

  getWebhookList(data, token: string): Observable<any> {
    return this.get('list_webhooks/' + data, token).pipe(map(response => response.json()));
  }

  // Stats for CLient User
  getWebhookById(data, token): Observable<any> {
    return this.get('get_webhook/' + data, token).pipe(map(response => response.json()));
  }

  createWebhook(data, token): Observable<any> {
    return this.post('create_webhook', data, token).pipe(map(response => response.json()));
  }

  updateWebhook(id, data, token): Observable<any> {
    return this.post('update_webhook/' + id, data, token).pipe(map(response => response.json()));
  }

  deleteWebhook(data, token): Observable<any> {
    return this.delete('delete_webhook/' + data, token).pipe(map(response => response.json()));
  }
  /* -------------------End Webhook List APIs------------- */

  // lead profiles
  getLeadProfile(data, token): Observable<any> {
    return this.get('get_lead_profile/' + data.id, token).pipe(map(response => response.json()));
  }

  createLeadProfile(data, token): Observable<any> {
    return this.post('profiles', data, token).pipe(map(response => response.json()));
  }

  updateLeadProfile(id, data, token): Observable<any> {
    return this.put('profiles/' + id, data, token).pipe(map(response => response.json()));
  }

  // lead Task
  createLeadTask(data, token): Observable<any> {
    return this.post('tasks', data, token).pipe(map(response => response.json()));
  }

  updateLeadTask(id, data, token): Observable<any> {
    return this.put('tasks/' + id, data, token).pipe(map(response => response.json()));
  }

  getLeadTask(data, token): Observable<any> {
    return this.get('get_all_tasks/' + data.id, token).pipe(map(response => response.json()));
  }

  deleteLeadTask(id, token): Observable<any> {
    return this.delete('tasks/' + id, token).pipe(map(response => response.json()));
  }

  // Lead Address
  createLeadAddress(data, token): Observable<any> {
    return this.post('addresses', data, token).pipe(map(response => response.json()));
  }

  getLeadAddress(data, token): Observable<any> {
    return this.get('all_addresses/' + data.id, token).pipe(map(response => response.json()));
  }

  updateLeadAddress(id, data, token): Observable<any> {
    return this.put('addresses/' + id, data, token).pipe(map(response => response.json()));
  }

  deleteLeadAddress(id, token): Observable<any> {
    return this.delete('addresses/' + id, token).pipe(map(response => response.json()));
  }

  // Lead Notes

  createLeadNote(data, token): Observable<any> {
    return this.post('notes', data, token).pipe(map(response => response.json()));
  }

  getLeadNote(data, token): Observable<any> {
    return this.get('get_all_notes/' + data.id, token).pipe(map(response => response.json()));
  }

  updateLeadNote(id, data, token): Observable<any> {
    return this.put('notes/' + id, data, token).pipe(map(response => response.json()));
  }

  deleteLeadNote(id, token): Observable<any> {
    return this.delete('notes/' + id, token).pipe(map(response => response.json()));
  }

  // Lead Mailing
  createLeadMailing(data, token): Observable<any> {
    return this.post('mailings', data, token).pipe(map(response => response.json()));
  }

  getLeadMailing(data, token): Observable<any> {
    return this.get('get_all_mailings/' + data.id, token).pipe(map(response => response.json()));
  }

  deleteLeadEmail(id, token): Observable<any> {
    return this.delete('mailings/' + id, token).pipe(map(response => response.json()));
  }

  uploadLeadAvatar(id, data, token): Observable<any> {
    return this.put('update_profile_avatar/' + id, data, token).pipe(map(response => response.json()));
  }
  // lead profile task by pagination
  leadProfileTask(url, token): Observable<any> {
    return this.get('get_all_tasks/?' + url, token).pipe(map(response => response.json()));
  }
  // lead profile timeline by pagination
  leadProfileTimeline(url, token): Observable<any> {
    return this.get('time_line_logs/?' + url, token).pipe(map(response => response.json()));
  }
  // lead profile notes by pagination
  leadProfileNote(url, token): Observable<any> {
    return this.get('get_all_notes/?' + url, token).pipe(map(response => response.json()));
  }
  // lead profile mails by pagination
  leadProfileMail(url, token): Observable<any> {
    return this.get('get_all_mailings/?' + url, token).pipe(map(response => response.json()));
  }
  // lead Lead Attachments by pagination
  leadAttachment(url, token): Observable<any> {
    return this.get('lead_attachments/?' + url, token).pipe(map(response => response.json()));
  }
  deleteNoteFiles(data, token) {
    return this.post('purge_note_document', data, token).pipe(map(response => response.json()));
  }

  makeAddressPrimary(data, id, token) {
    return this.put('make_address_primary/' + id, data, token).pipe(map(response => response.json()));
  }

  leadEnrichment(data, token): Observable<any> {
    return this.get('lead_enrich_data/' + data, token).pipe(map(response => response.json()));
  }

  projectStatsByClient(body, token): Observable<any> {
    return this.post('projects_stats/', body, token).pipe(map(response => response.json()));
  }

  // Phone Verificatuon

  getOtp(body, token: string): Observable<any> {
    return this.post('get_otp', body, token).pipe(map(response => response.json()));
  }

  verifiedPhoneNumber(body, token: string): Observable<any> {
    return this.post('verified_phone_number', body, token).pipe(map(response => response.json()));
  }

  // Report by user
  getReportByUser(body, token): Observable<any> {
    return this.post('get_user_call_report', body, token).pipe(map(response => response.json()));
  }

  //All user Report
  getAllReportOfUser(body, token): Observable<any> {
    return this.post('get_all_users_call_report', body, token).pipe(map(response => response.json()));
  }

  // Reports
  getReportList(url,token): Observable<any> {
    return this.get(url, token).pipe(map(response => response.json()));
  }
  // Get Call List
  createReport(body, token): Observable<any> {
    return this.post('reports', body, token).pipe(map(response => response.json()));
  }

  updateReport(id, body, token): Observable<any> {
    return this.put('reports/' + id, body, token).pipe(map(response => response.json()));
  }

  deleteReport(id, token): Observable<any> {
    return this.delete('reports/' + id, token).pipe(map(response => response.json()));
  }

  /// Privacy Policy
  getPolicyByPP(token): Observable<any> {
    return this.getHtml('legal_doc/?doc_type=PP', token).pipe(map(response => response));
  }

  getPolicyByTANDC(token): Observable<any> {
    return this.getHtml('legal_doc/?doc_type=TANDC', token).pipe(map(response => response));
  }

  getInsight(url, token: string): Observable<any> {
    return this.get(url, token).pipe(map(response => response.json()));
  }

  // Stats UTM
  getUTMStatsByProject(id, body, token): Observable<any> {
    return this.post('project_utm_stats/' + id, body, token).pipe(map(response => response.json()))
  }

  getbuilder(url, token: string): Observable<any> {
    return this.get(url, token).pipe(map(response => response.json()));
  }

  createPost(url, body, token): Observable<any> {
    return this.post(url, body, token).pipe(map(response => response.json()));
  }

  getPersona(body, token): Observable<any> {
    return this.post('get_persona', body, token).pipe(map(response => response.json()));
  }

  //add audience analysis
  addAudienceAnalysis(body, token): Observable<any> {
    return this.post('projects/add_audience_analysis', body, token).pipe(map(response => response.json()))
  }
   //add media plan
   addMediaPlan(body, token): Observable<any> {
    return this.post('projects/media_plan_entries', body, token).pipe(map(response => response.json()))
  }

  // get media plan
 
  getMediaPlan(id, token: string): Observable<any> {
    return this.get('projects/media_plan_entries?project_id=' + id, token).pipe(map(response => response.json()));
  }

  // update media plan
  updateMediaPlan(data, token): Observable<any> {
    return this.post('projects/media_plan_entries/bulk_update', data, token).pipe(map(response => response.json()));
  }

  // delete media plan entry
  deleteMediaPlanEntry(id, token): Observable<any> {
    return this.delete('projects/media_plan_entries/' + id, token).pipe(map(response => response.json()));
  }



  // create bookings
  createBooking(data, token): Observable<any> {
    return this.post('bookings', data, token).pipe(map(response => response.json()));
  }
  updateBooking(id, data, token): Observable<any> {
    return this.put('bookings/' + id, data, token).pipe(map(response => response.json()));
  }

  deleteBooking(id, token): Observable<any> {
    return this.delete('bookings/' + id, token).pipe(map(response => response.json()));
  }

  listBookingsByPage(data, token: string): Observable<any> {
    return this.get(data, token).pipe(map(response => response.json()));
  }
  getWebhookLogs(data, token: string): Observable<any> {
    return this.get('get_webhook_logs?id=' + data.id, token).pipe(map(response => response.json()));
  }

  getFreshLeadCount(url:string, token: string): Observable<any> {
    return this.get(url, token).pipe(map(response => response.json()));
  }
//

createWhatsappProfile(body, token): Observable<any> {
  return this.post('whats_app_profiles', body, token).pipe(map(response => response.json()))
}

//
updateWhatsappProfile(id, body, token): Observable<any> {
  return this.put('whats_app_profiles/' + id, body, token).pipe(map(response => response.json()))
}

 // Whatsapp
 enableWhatsapp(body, token): Observable<any> {
  return this.post('projects/enabled_whatsapp', body, token).pipe(map(response => response.json()));
}

//Resources
calculateCPL(body, token): Observable<any> {
  return this.post('calculate_cpl', body, token).pipe(map(response => response.json()))
}

}
