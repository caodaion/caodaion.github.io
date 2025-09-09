import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { ChildHeaderComponent } from "src/app/components/child-header/child-header.component";

@Component({
  selector: 'app-dashboard',
  imports: [ChildHeaderComponent, MatIconModule, MatButtonModule, MatTooltipModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
