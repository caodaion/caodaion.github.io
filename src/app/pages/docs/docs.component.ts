import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.scss',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
  ]
})
export class DocsComponent {

}
