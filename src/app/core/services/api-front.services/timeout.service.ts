import { Observable, Subject, Subscription, timer } from 'rxjs';

export class TimeoutService {
  private _count = 0;
  private timerSubscription: Subscription;
  private _timer: Observable<number>;
  private readonly resetOnTrigger = false;
  private dateTimer: Observable<any>;
  private dateTimerSubscription: Subscription;
  private readonly dateTimerInterval: number = 1000 * 60 * 5;
  public timeoutExpired: Subject<number> = new Subject<number>();
  private timeoutMilliseconds: any;

  constructor() {
    this.startDateCompare();
  }

  private startDateCompare() {
    this.dateTimer = timer(this.dateTimerInterval);
    this.dateTimerSubscription = this.dateTimer.subscribe(n => {
      this.dateTimerSubscription.unsubscribe();
      this.startDateCompare();
    });
  }

  private setSubscription() {
    this._timer = timer(this.timeoutMilliseconds);
    this.timerSubscription = this._timer.subscribe(n => {
      this.timerComplete(n);
    });
  }

  private timerComplete(n: number) {
    this.timeoutExpired.next(++this._count);

    if (this.resetOnTrigger) {
      this.startTimer();
    }
  }

  public setTimeoutMilliseconds(timeoutMilliseconds: any) {
    this.timeoutMilliseconds = timeoutMilliseconds;
  }

  public startTimer() {
    if (this.timerSubscription) {
      this.stopTimer();
    }

    this.setSubscription();
  }

  public stopTimer() {
    this.timerSubscription.unsubscribe();
  }
}
