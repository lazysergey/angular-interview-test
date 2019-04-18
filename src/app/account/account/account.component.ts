import { AuthService } from './../../shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public user$: Observable<User>;
  
  constructor(authService: AuthService) {
    this.user$ = authService.user$;
  }
  
  ngOnInit() { }
}
