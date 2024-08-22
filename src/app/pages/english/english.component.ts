import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-english',
  templateUrl: './english.component.html',
  styleUrls: ['./english.component.scss']
})
export class EnglishComponent {

  currentUser: any = <any>{}

  constructor(protected authService: AuthService) {

  }

  ngAfterViewInit(): void {
    this.authService.getCurrentUser(true).subscribe((res: any) => {
      this.currentUser = res;
    })
  }
}
