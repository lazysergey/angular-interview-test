import { AuthService } from './shared/auth.service';
import { PostDataService } from './shared/post-data.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'intStuccoMedia';

  constructor() { }
}