import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
@Injectable()
export class PromptUpdateService {

  constructor(public updates: SwUpdate) {
    if (updates.isEnabled) {
      interval(600000).subscribe(() => updates.checkForUpdate()
        .then(() => console.log('checking for updates')));
    }
  }

  public checkForUpdates() {
    if (this.updates.isEnabled) {
      interval(600000).subscribe(() => this.updates.checkForUpdate()
        .then(() => console.log('checking for updates')));
    }
    this.updates.available.subscribe(event => this.promptUser());
  }

  private promptUser(): void {
    this.updates.activateUpdate().then(() => document.location.reload()); 
  }
}