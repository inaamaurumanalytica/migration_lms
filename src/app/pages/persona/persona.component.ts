import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ClipBoardService } from '../../services/clipboard.service';
import { ServerService } from '../../services/server.service';
@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.scss']
})
export class PersonaComponent implements OnInit {
  showComponentLoader: boolean = false
  authToken: any = localStorage.getItem("token")
  showData: boolean = false
  personaForm: FormGroup
  personaDetails: any = {
    first_name: '',
    last_name: '',
    display_name: '',
    profile_image: '',
    persona: {}
  }

  showProfile = false
  showError = false


  constructor(
    private titleService: Title,
    private serverService: ServerService,
    private fb: FormBuilder,
    private clipBoardService: ClipBoardService
  ) {
    this.titleService.setTitle('AutomateLeads - Persona');
    this.personaForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('(https?:\\/\\/(www.)?linkedin.com\\/(mwlite\\/|m\\/)?in\\/[a-zA-Z0-9_.-]+\\/?)')]]
    })
  }

  ngOnInit() { }

  search() {
    this.showComponentLoader = true;
    this.showError = false
    this.showProfile = false
    let body = {
      id: this.personaForm.value.id
    }
    this.serverService.getPersona(body, this.authToken).subscribe(
      data => {
        this.showComponentLoader = false;
        if (data.data != undefined && data.data.status == "error") {
          this.showError = true
        } else {
          this.personaDetails.first_name = data.results.first_name
          this.personaDetails.last_name = data.results.last_name
          this.personaDetails.display_name = data.results.display_name
          this.personaDetails.profile_image = data.results.user_profile_image
          this.personaDetails.location = data.results.location
          this.personaDetails.persona.adjectives = data.results.persona.sales.communication_advice.adjectives
          this.personaDetails.persona.dos = data.results.persona.sales.communication_advice.what_to_say
          this.personaDetails.persona.donts = data.results.persona.sales.communication_advice.what_to_avoid
          this.personaDetails.persona.description = data.results.persona.sales.communication_advice.description
          this.personaDetails.persona.key_traits = []
          for (const [key, value] of Object.entries(data.results.persona.sales.communication_advice.key_traits)) {
            let body = {
              key: key,
              value: value,
            }
            this.personaDetails.persona.key_traits.push(body)
          }
          this.personaDetails.persona.email_personalization = []
          for (const [key, value] of Object.entries(data.results.persona.sales.email_personalization.advice)) {
            let body = {
              key: key,
              value: value,
            }
            this.personaDetails.persona.email_personalization.push(body)
          }
          for (const [key, value] of Object.entries(data.results.persona.sales.email_personalization.examples)) {
            for (let i = 0; i < this.personaDetails.persona.email_personalization.length; i++) {
              if (this.personaDetails.persona.email_personalization[i].key === key) {
                this.personaDetails.persona.email_personalization[i].example = value
                break
              }
            }
          }
          this.showProfile = true
        }

      },
      err => {
        this.showComponentLoader = false;
        this.showError = false
        this.showProfile = false
        this.clipBoardService.checkServerError(err, this.authToken)
      }
    )
  }

  reset() {
    this.personaForm.reset()
    this.showError = false
    this.showProfile = false
  }
}