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
  public showEmailValidationError: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    window['auth'] = this.authService;

    this.authService.isAuthChanges().subscribe()

    // this.authService.doLogin("asdf@fasd.e", 1234).subscribe(
    //   res => console.log(res),
    //   err => console.log(err)
    // );
    // this.authService.doLogin("Sincere@april.biz", 1234).subscribe(
    //   res => console.log(res),
    //   err => console.log(err)
    // );
  }

  ngOnInit() {
    this.authService.doLogout();
    this.loginForm = new FormGroup({
      emailControl: new FormControl('', [Validators.email, Validators.required]),
      passwordControl: new FormControl('', [Validators.required]),
      // checkboxControl: new FormControl('', [Validators.requiredTrue]),
    });

    this.loginForm.controls.emailControl.valueChanges.subscribe(res => {
      this.showEmailValidationError = false;
    })

    // this.emailControl.valueChanges.subscribe(res => console.log(res));
  }

  onSubmit() {
    for (let i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsTouched();
    }
    // "Sincere@april.biz" || 
    if (this.loginForm.valid) {
      this.authService.doLogin(
        this.loginForm.controls.emailControl.value,
        this.loginForm.controls.passwordControl.value
      ).subscribe(
        res => this.router.navigate(["/account"]),
        err => this.showEmailValidationError = true
      );
    }
  }

  // doLogout() {
  //   this.authService.doLogout();
  // }

}
