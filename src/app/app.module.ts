import { CUSTOM_ELEMENTS_SCHEMA, NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { AuthGuard } from "./shared/guards/auth.guard";
import { ReleasedGuard } from "./shared/guards/released.guard";
import { AsyncPipe, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from "@angular/material/tooltip";
import { AngularFireModule } from '@angular/fire/compat';
import { MessagingService } from './shared/services/messaging/messaging.service';
import { MatDividerModule } from '@angular/material/divider';
import { CpQrScannerModule } from './components/cp-qr-scanner/cp-qr-scanner.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ErrorStateMatcher, MAT_DATE_LOCALE, MatNativeDateModule, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MarkdownModule } from 'ngx-markdown';
import { register } from 'swiper/element/bundle';
import { DienThoPhatMauGuard } from './shared/guards/dien-tho-phat-mau.guard';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';
import { RouterModule } from '@angular/router';

register();

@NgModule({
  declarations: [
    AppComponent,
  ],
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
    MatNativeDateModule,
    MatGridListModule,
    MarkdownModule.forRoot({ sanitize: SecurityContext.NONE }),
    TourMatMenuModule,
    RouterModule 
  ],
  providers: [
    AuthGuard, ReleasedGuard, DatePipe, AsyncPipe, MessagingService, DecimalPipe, DienThoPhatMauGuard, CurrencyPipe,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
