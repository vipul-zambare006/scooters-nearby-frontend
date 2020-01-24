import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScooterService } from './services/scooter.service';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ScooterService]
})
export class AppRoutingModule { }
