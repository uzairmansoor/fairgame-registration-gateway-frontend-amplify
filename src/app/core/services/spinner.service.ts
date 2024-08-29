import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SpinnerService {
    public loading$: Observable<boolean>;
    private _loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    loadingText: string = '';

    constructor() {
        this.loading$ = this._loading$.asObservable();
    }

    get isSpinnerActive() {
        return this._loading$.value;
    }

    set(loading: boolean) {
        this._loading$.next(loading);
        if (!loading) this.loadingText = '';
    }
}
