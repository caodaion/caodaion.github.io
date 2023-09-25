import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagenotfoundComponent } from '../../layouts/pagenotfound/pagenotfound.component';
import { AuthComponent } from './auth.component';
import {LoginComponent} from "../../pages/auth/login/login.component";
import { SignupComponent } from 'src/app/pages/auth/signup/signup.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AuthComponent,
      },
      {
        path: 'dang-nhap',
        component: LoginComponent,
      },
      {
        path: 'dang-ky',
        component: SignupComponent,
      },
      { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
