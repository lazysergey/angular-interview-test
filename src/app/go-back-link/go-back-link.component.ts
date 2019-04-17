import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'go-back-link',
  templateUrl: './go-back-link.component.html',
  styleUrls: ['./go-back-link.component.scss']
})
export class GoBackLinkComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  goBack(){
    return history ? history.back() : this.router.navigate(['posts']);
  }
}
