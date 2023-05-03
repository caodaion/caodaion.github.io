import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject<any>(null);

  constructor(private angularFireMessaging: AngularFireMessaging) { }

  requestPermission() {
    try {
      this.angularFireMessaging.requestToken.subscribe((token: any) => {
        console.log(token);
      })
    } catch(error) {
      console.log(error);
    }
  }

  receiveMessaging() {
    this.angularFireMessaging.messages.subscribe((payload: any) => {
      console.log(payload);
      this.currentMessage.next(payload)
    })
  }
}
