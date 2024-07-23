import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stopAudioSubject = new Subject<void>();

  stopAudio$ = this.stopAudioSubject.asObservable();

  stopAudio() {
    this.stopAudioSubject.next();
  }
}