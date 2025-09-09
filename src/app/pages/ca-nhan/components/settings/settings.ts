import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ChildHeaderComponent } from "src/app/components/child-header/child-header.component";

@Component({
  selector: 'app-settings',
  imports: [ChildHeaderComponent, MatFormFieldModule, FormsModule, MatInputModule, MatSelectModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  settingsData: any = <any>{}
}
