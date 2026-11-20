import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SocialService {
  constructor() {}

  socialFriendId = new BehaviorSubject<string | undefined>("");

  getSocialFriendId() {
    return this.socialFriendId.asObservable();
  }
}
