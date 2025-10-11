import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnRoutingModule } from './learn-routing.module';
import { Learn } from './learn';
import { Lessons } from './components/lessons/lessons';
import { Lesson } from './components/lesson/lesson';
import { LearnProgressComponent } from './components/learn-progress/learn-progress.component';
import { ChildHeaderComponent } from 'src/app/components/child-header/child-header.component';
import { IconComponent } from 'src/app/components/icon/icon.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LearnDataService } from './services/learn-data.service';
import { LearnResultsService } from './services/learn-results.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LearnRoutingModule,
    Learn,
    Lessons,
    Lesson,
    LearnProgressComponent,
    ChildHeaderComponent,
    IconComponent,
    MatSidenavModule
  ],
  providers: [LearnDataService, LearnResultsService]
})
export class LearnModule { }