import { Component, inject } from '@angular/core';
import { MatMenuModule } from "@angular/material/menu";
import { IconComponent } from "../icon/icon.component";
import { AppTour } from 'src/app/shared/services/app-tour';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-app-tour-menu',
  imports: [MatMenuModule, MatTooltipModule],
  templateUrl: './app-tour-menu.html',
  styleUrl: './app-tour-menu.scss'
})
export class AppTourMenu {

  appTour = inject(AppTour);

  openAppTour(tourName: string) {
    this.appTour.startTour(tourName);
  }
}
