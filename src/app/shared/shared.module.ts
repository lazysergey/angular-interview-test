import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoBackLinkComponent } from './../go-back-link/go-back-link.component';
    

@NgModule({
  declarations: [
    GoBackLinkComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GoBackLinkComponent,
  ]
})
export class SharedModule { }
