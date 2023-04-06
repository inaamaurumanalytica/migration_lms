import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';

@Injectable()
export class ClipBoardService {
    action: string = ""
    expirationDays: any = ""
    public authData: any = {};
    projectInfo: any = {}
    selected: any
    userName: string = ""
    vendorName: string = ""
    public whatsappRuleAssignmnetInfo: any = {}
    public whatsappRuleEntryData: any = {}
    constructor(
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }
    backToLogin() {
        localStorage.clear();
        this.router.navigate([""]);
    }

    checkServerError(err, token) {
        if (err.status == 401) {
            let msg = JSON.parse(err._body);
            if (msg.error == "Not Authorized") {
                this.showMessgeInText("Not Authorized", 'error-snackbar')
                this.dialog.closeAll()
                this.backToLogin();
            } else {
                if (msg.message != undefined) {
                    this.showMessgeInText(msg.message, 'error-snackbar')
                } else {
                    if (msg.error.user_authentication != undefined) {
                        this.showMessgeInText(msg.error.user_authentication, 'error-snackbar')
                    } else {
                        this.showMessgeInText(msg.error, 'error-snackbar')
                    }

                }
            }
        } else if (err.status == 422) {
            if (typeof err._body === 'string') {
                let error = JSON.parse(err._body)
                if (error.error != undefined) {
                    if (typeof error.error === 'string') {
                        this.showMessgeInText(error.error, 'error-snackbar')
                    } else {
                        this.showMessgeInText(JSON.stringify(error.error), 'error-snackbar')
                    }
                } else if (error.message != undefined) {
                    this.showMessgeInText(error.message, 'error-snackbar')
                } else {
                    this.showMessgeInText(err._body, 'error-snackbar')
                }
            } else {
                this.showMessgeInText(err._body, 'error-snackbar')
            }
        } else if (err.status == 404) {
            if (token == null) {
                let msg: any = {}
                if (typeof err._body === 'string') {
                    if (err._body != "") {
                        if (JSON.parse(err._body) != undefined) {
                            let error = JSON.parse(err._body)
                            if (error.message != undefined) {
                                msg = error.message
                            } else {
                                msg = error.error
                            }
                        }
                    } else {
                        msg = ""
                    }
                } else {
                    msg = err._body
                }
                if (msg == "") {
                    msg = "Internal Server Error"
                }
                this.showMessgeInText(msg, 'error-snackbar')
            } else {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                this.authData = JSON.parse(window.atob(base64));
                if (this.authData.exp < Date.now() / 1000) {
                    this.showMessgeInText("Session Expired", 'error-snackbar')
                    this.dialog.closeAll()
                    this.backToLogin();
                } else {
                    let msg: any = {}
                    if (typeof err._body === 'string') {
                        if (err._body != "") {
                            if (JSON.parse(err._body) != undefined) {
                                let error = JSON.parse(err._body)
                                if (error.message != undefined) {
                                    msg = error.message
                                } else {
                                    msg = error.error
                                }
                            }
                        } else {
                            msg = ""
                        }
                    } else {
                        msg = err._body
                    }
                    if (msg == "") {
                        msg = "Internal Server Error"
                    }
                    this.showMessgeInText(msg, 'error-snackbar')
                }
            }
        } else if (err.status == 403) {
            // let msg = JSON.parse(err._body)
            // this.showMessgeInText(msg.error, "error-snackbar")
            let msg: any = {}
            if (typeof err._body === 'string') {
                msg = JSON.parse(err._body)
            } else {
                msg = err._body
            }
            if (msg.message != undefined) {
                this.showMessgeInText(msg.message, 'error-snackbar')
            } else {
                this.showMessgeInText(msg, 'error-snackbar')
            }

        } else if (err.status == 0) {
            this.showMessgeInText("Network Issue", 'error-snackbar')
        } else if (err.status == 500) {
            if (err._body == "") {
                this.showMessgeInText("Internal Server Error", 'error-snackbar')
            } else {
                this.showMessgeInText(err.statusText, 'error-snackbar')
            }
        } else if (err.status == 400) {
            this.showMessgeInText(err._body, 'error-snackbar')
        } else {
            let msg: any = {}
            if (typeof err._body === 'string') {
                msg = JSON.parse(err._body)
            } else {
                msg = err._body
            }
            if (msg.message != undefined) {
                this.showMessgeInText(msg.message, 'error-snackbar')
            } else {
                this.showMessgeInText(msg, 'error-snackbar')
            }
        }
    }

    showMessgeInText(msg, color) {
        this.snackBar.open(msg, this.action, {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'end',
            panelClass: [color]
        })
    }

    select(item) {
        this.router.navigate([item])
        this.selected = item;
    };
    isActive(item) {
        if (item == "/page/project/leads") {
            this.selected = "/page/project"
            item = "/page/project"
        }
        return this.selected === item;
    };

}