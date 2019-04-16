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

  constructor(
    // private postDataService: PostDataService,
    // private authService: AuthService
  ) {
    // this.postDataService.getPost(2).subscribe(res => console.log(res));
    // this.postDataService.createPost({title: "123", body: "456", userId: 13}).subscribe(res => console.log(res));    
  }

  doLogout(){
    // this.authService.doLogout();
  }

  doLoginCorrectUser(){
    // this.authService.doLogin("Sincere@april.biz", 1234);
  }
}