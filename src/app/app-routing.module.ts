import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from "./main/main.component";
import { StationDetailsComponent } from "./station-details/station-details.component";

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent
  },
  {
    path: 'details',
    component: StationDetailsComponent
  },
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
