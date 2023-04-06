import { AfterViewInit, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PromptUpdateService } from './services/prompt-update.service';
declare const ga: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lms-revamp';
  constructor(private router: Router, private promptUpdateService: PromptUpdateService) {
    setTimeout(()=>{
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (<any>window).ga('set', 'page', event.urlAfterRedirects);
          (<any>window).ga('send', 'pageview');
        }
        this.promptUpdateService.checkForUpdates();
      });
    }, 1000)
  }
}
