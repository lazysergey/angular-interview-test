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
    path: '*', redirectTo: 'posts'
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
    // pathMatch: 'full'
  },
  {
    path: 'posts/:id', 
    component: PostDetailsComponent,
    canActivate: [],
    data: {},
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
