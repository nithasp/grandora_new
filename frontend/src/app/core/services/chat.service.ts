import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  isChatBoxDisplay = new BehaviorSubject<boolean>(false);

  handleChatBoxDisplay(value: boolean) {
    this.isChatBoxDisplay.next(value);
  }

  getIsChatBoxDisplay() {
    return this.isChatBoxDisplay.asObservable();
  }
}
