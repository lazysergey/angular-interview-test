import { AuthService } from './../../shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { timer, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public user$: ReplaySubject<User>;

  constructor(
    private authService: AuthService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
  }

}
