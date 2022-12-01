import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-offline-snackbar',
  templateUrl: './offline-snackbar.component.html',
  styleUrls: ['./offline-snackbar.component.scss'],
})
export class OfflineSnackbarComponent implements OnInit {
  isOffline: boolean = false;
  constructor() {}

  ngOnInit() {
    this.isOffline = !navigator.onLine;
  }
}
