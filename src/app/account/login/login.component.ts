import { AuthService } from './../../shared/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public emailDoesNotExist: boolean;
  private _subscription: Subscription;

  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this._authService.doLogout();
    this.loginForm = new FormGroup({
      emailControl: new FormControl('', [Validators.email, Validators.required]),
      passwordControl: new FormControl('', [Validators.required]),
    });

    this.loginForm.controls.emailControl.valueChanges.subscribe(res => {
      this.emailDoesNotExist = false;//shows error message based on http response
    })
  }
  ngOnDestroy() {
    this._subscription && this._subscription.unsubscribe()
  }

  onSubmit() {
    for (let i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsTouched();
    }
    if (this.loginForm.valid) {
      this._subscription = this._authService.doLogin(
        this.loginForm.controls.emailControl.value,
        this.loginForm.controls.passwordControl.value
      ).subscribe(
        res => this._router.navigate(["/account"]),
        err => this.emailDoesNotExist = true
      );
    }
  }
}
