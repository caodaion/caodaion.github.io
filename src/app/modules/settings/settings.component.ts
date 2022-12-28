import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  settingsMenu = <any>[
    {
      url: 'thong-bao',
      icon: 'edit_notifications',
      label: 'Cài đặt thông báo',
    }
  ]
}
