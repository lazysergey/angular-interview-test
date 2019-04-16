import { AuthService } from './../../shared/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public user: User;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.user = this.authService.currentUser;
    timer(1000).subscribe(data => this.router.navigate(['/account/posts']))
  }

  ngOnInit() {
  }

}
