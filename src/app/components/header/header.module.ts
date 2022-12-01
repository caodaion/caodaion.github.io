import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HeaderTitleComponent } from './header-title/header-title.component';
import { HeaderSubTitleComponent } from './header-sub-title/header-sub-title.component';
import {MatButtonModule} from "@angular/material/button";
import { HeaderDescriptionComponent } from './header-description/header-description.component';


@NgModule({
  declarations: [HeaderComponent, HeaderTitleComponent, HeaderSubTitleComponent, HeaderDescriptionComponent],
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  exports: [HeaderComponent, HeaderTitleComponent, HeaderSubTitleComponent, HeaderDescriptionComponent],
})
export class HeaderModule {}
