import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagenotfoundComponent } from './layouts/pagenotfound/pagenotfound.component';
import { MatIconModule } from '@angular/material/icon';
import { OfflineSnackbarComponent } from './layouts/offline-snackbar/offline-snackbar.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './modules/auth/auth.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { LoginComponent } from './pages/auth/login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {AuthGuard} from "./shared/guards/auth.guard";
import {ReleasedGuard} from "./shared/guards/released.guard";
import { DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [AppComponent, PagenotfoundComponent, OfflineSnackbarComponent, AuthComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 10 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:10000',
    }),
    BrowserAnimationsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    HttpClientModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  providers: [AuthGuard, ReleasedGuard, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
