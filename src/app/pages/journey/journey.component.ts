import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateJourneyComponent } from './update-journey/update-journey.component';
import { AttendanceComponent } from './attendance/attendance.component';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss']
})
export class JourneyComponent implements OnInit {

  updateJourneyDialogRef: any

  constructor(
    public matDialog: MatDialog
    ) {

  }

  ngOnInit(): void {

  }

  onUpdateJourney() {
    this.updateJourneyDialogRef = this.matDialog.open(UpdateJourneyComponent)
  }

  onUpdateAttendance() {
    this.updateJourneyDialogRef = this.matDialog.open(AttendanceComponent)
  }
}
