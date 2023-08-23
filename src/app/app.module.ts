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
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LoginComponent } from './pages/auth/login/login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { AuthGuard } from "./shared/guards/auth.guard";
import { ReleasedGuard } from "./shared/guards/released.guard";
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from "@angular/material/tooltip";
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { MessagingService } from './shared/services/messaging/messaging.service';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { MatDividerModule } from '@angular/material/divider';
import { CpQrScannerModule } from './components/cp-qr-scanner/cp-qr-scanner.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ErrorStateMatcher, MAT_DATE_LOCALE, MatNativeDateModule, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@NgModule({
  declarations: [AppComponent, PagenotfoundComponent, OfflineSnackbarComponent, AuthComponent, LoginComponent, SignupComponent],
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
    MatTooltipModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatDividerModule,
    CpQrScannerModule,
    MatExpansionModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [AuthGuard, ReleasedGuard, DatePipe, AsyncPipe, MessagingService,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    {provide: MAT_DATE_LOCALE, useValue: 'vi-VN'},
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
