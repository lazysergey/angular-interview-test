import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { PostDetailsComponent } from './public/public-post-details/post-details.component';
import { PostListComponent } from './public/public-post-list/post-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', 
    component: PostListComponent,
    canActivate: [],
    data: {},
    pathMatch: 'full'
  },
  {
    path: '404', 
    component: NotFoundPageComponent,
    canActivate: [],
    data: {},
    pathMatch: 'full'
  },
  {
    path: 'posts', 
    component: PostListComponent,
    canActivate: [],
    data: {},
    pathMatch: 'full'
  },
  {
    path: 'account', loadChildren: "./account/account.module#AccountModule",
    canActivate: [],
    data: {},
  },
  {
    path: 'posts/:id', 
    component: PostDetailsComponent,
    canActivate: [],
    data: {},
    pathMatch: 'full'
  },
  {
    path: '**', redirectTo: '404'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
