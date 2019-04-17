import { SharedModule } from './shared/shared.module';
import { PostDataService } from './shared/post-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostDetailsComponent } from './public/public-post-details/post-details.component';
import { PostListComponent } from './public/public-post-list/post-list.component';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

@NgModule({
  declarations: [
    AppComponent,
    PostDetailsComponent,
    PostListComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [PostDataService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
