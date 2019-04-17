import { AuthService } from './../../shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public emailDoesNotExist: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    // this.authService.isAuthChanges().subscribe()
  }

  ngOnInit() {
    this.authService.doLogout();
    this.loginForm = new FormGroup({
      emailControl: new FormControl('', [Validators.email, Validators.required]),
      passwordControl: new FormControl('', [Validators.required]),
    });

    this.loginForm.controls.emailControl.valueChanges.subscribe(res => {
      this.emailDoesNotExist = false;
    })
  }

  onSubmit() {
    for (let i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsTouched();
    }
    if (this.loginForm.valid) {
      this.authService.doLogin(
        this.loginForm.controls.emailControl.value,
        this.loginForm.controls.passwordControl.value
      ).subscribe(
        res => this.router.navigate(["/account"]),
        err => this.emailDoesNotExist = true
      );
    }
  }
}
