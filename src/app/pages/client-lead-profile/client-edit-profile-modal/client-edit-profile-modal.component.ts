import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { ClipBoardService } from '../../../services/clipboard.service'
import { ServerService } from '../../../services/server.service'

@Component({
  selector: 'app-client-edit-profile-modal',
  templateUrl: './client-edit-profile-modal.component.html',
  styleUrls: ['./client-edit-profile-modal.component.scss']
})
export class ClientEditProfileModalComponent implements OnInit {

  public currentUser = JSON.parse(localStorage.getItem("userInfo"));
  authToken = localStorage.getItem("token")
  projectInfo: any = JSON.parse(localStorage.getItem("projectInfo"))
  leadInfo: any = JSON.parse(localStorage.getItem("leadInfo"))
  saveStatus: boolean = false

  header: any = ""

  lookingForLocation: any[] = []
  location: any = ''
  tags: any[] = []
  tag: any = ''

  websiteLinks: any[] = []
  websiteLink: any = ''

  numberVerified: boolean = false
  emailVerified: boolean = false

  profileData: any = {
    "description": "",
    "company": "",
    "email": "",
    "gender": "",
    "alternate_number": "",
    "occupation": "",
    "looking_for_location": [],
    "property_category": "",
    "tag": [],
    "fax": "",
    "social_links": {},
    "website": []
  }

  fieldArray: Array<any> = [];
  fieldStaticArray: Array<any> = [];
  constructor(
    private serverService: ServerService,
    private clipBoardService: ClipBoardService,
    private dialogRef: MatDialogRef<ClientEditProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.header = data.header
    this.profileData = Object.assign({}, this.data.profile);
  }

  ngOnInit() {
    this.profileData = {
      "id": this.profileData.id,
      "description": this.profileData.description,
      "company": this.profileData.company,
      "email": this.profileData.email,
      "gender": this.profileData.gender,
      "alternate_number": this.profileData.alternate_number,
      "occupation": this.profileData.occupation,
      "looking_for_location": this.profileData.looking_for_location,
      "property_category": this.profileData.property_category,
      "budget": this.profileData.budget,
      "tag": this.profileData.tag,
      "fax": this.profileData.fax,
      "social_links": this.profileData.social_links,
      "website": this.profileData.website
    }
    this.verifyNumber()
    this.verifyEmail()
    this.lookingForLocation = this.profileData.looking_for_location;
    this.tags = this.profileData.tag;
    //console.log(this.profileData.social_links)
    if (Object.keys(this.profileData.social_links).length !== 0) {
      for (var i in this.profileData.social_links) {
        this.fieldArray.push({ "key": i, "value": this.profileData.social_links[i] });
      }
    } else {
      this.fieldArray.push({ "key": "", "value": "" })
    }

    if (this.profileData.website.length != 0) {
      this.websiteLinks = this.profileData.website
    }
  }

  addnewrow() {
    this.fieldArray.push({ "key": "", "value": "" })
  }

  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }


  addLocation() {
    if (this.location.trim() != '') {
      this.lookingForLocation.push(this.location)
      this.location = '';
    }
  }

  removeLocation(location): void {
    const index = this.lookingForLocation.indexOf(location);
    if (index > -1) {
      this.lookingForLocation.splice(index, 1);
    }
  }

  addTag() {
    if (this.tag.trim() != '') {
      this.tags.push(this.tag)
      this.tag = '';
    }
  }

  removeTag(tag): void {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
  }

  addWebsiteLink() {
    if (this.websiteLink.trim() != '') {
      this.websiteLinks.push(this.websiteLink)
      this.websiteLink = '';
    }
  }

  removeWebsiteLink(link): void {
    const index = this.tags.indexOf(link);
    if (index > -1) {
      this.websiteLinks.splice(index, 1);
    }
  }

  close() {
    this.dialogRef.close();
  }

  updateProfile() {
    this.saveStatus = true
    let body = {
      "description": this.profileData.description,
      "company": this.profileData.company,
      "email": this.profileData.email,
      "alternate_number": this.profileData.alternate_number,
      "occupation": this.profileData.occupation,
      "gender": this.profileData.gender,
      "looking_for_location": this.lookingForLocation,
      "property_category": this.profileData.property_category,
      "tag": this.tags,
      "budget": this.profileData.budget,
      "fax": this.profileData.fax,
      "social_links": {},
      "website": this.websiteLinks,
      "lead_id": this.profileData.lead_id,
    }
    if (this.fieldArray.length != 0) {
      this.fieldArray.forEach(element => {
        if (element.key != "" && element.value != "") {
          body.social_links[element.key] = element.value
        }
      });
    }

    this.serverService.updateLeadProfile(this.profileData.id, body, this.authToken).subscribe(
      data => {
        this.saveStatus = false
        this.clipBoardService.showMessgeInText("Profile Upadted Successfully", "success-snackbar");
        this.dialogRef.close("Profile Upadted Successfully")
      },
      err => {
        this.saveStatus = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  verifyEmail() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(this.profileData.email).toLowerCase())) {
      this.emailVerified = true
    } else if (this.profileData.email == null || this.profileData.email == "") {
      this.emailVerified = true
    } else {
      this.emailVerified = false
    }
  }

  verifyNumber() {
    if (String(this.profileData.alternate_number).length <= 13 && String(this.profileData.alternate_number).length >= 10) {
      this.numberVerified = true
    } else if (this.profileData.alternate_number == null || String(this.profileData.alternate_number).length == 0) {
      this.numberVerified = true
    } else {
      this.numberVerified = false
    }
  }
}
