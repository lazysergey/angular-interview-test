import { AccountComponent } from './account/account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from '../shared/auth.guard';
import { PostEditComponent } from './account-post-edit/post-edit.component';
import { PostListComponent } from './account-post-list/post-list.component';
import { SharedModule } from '../shared/shared.module';


const accountRoutes: Routes = [
  {
    path: '', 
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login', 
    component: LoginComponent,
    canActivate: []
  },
  {
    path: 'posts',
    component: PostListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts/update',
    component: PostEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts/create',
    component: PostEditComponent,
    canActivate: [AuthGuard]
  },
]

@NgModule({
  declarations: [
    LoginComponent, 
    AccountComponent, 
    PostEditComponent, 
    PostListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(accountRoutes)
  ],
  providers: [
    CookieService
  ]
})
export class AccountModule { }
