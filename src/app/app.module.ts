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
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import { LoginComponent } from './pages/auth/login/login.component';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {FormsModule} from "@angular/forms";
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {AuthGuard} from "./shared/guards/auth.guard";
import {ReleasedGuard} from "./shared/guards/released.guard";

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
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule
  ],
  providers: [AuthGuard, ReleasedGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
