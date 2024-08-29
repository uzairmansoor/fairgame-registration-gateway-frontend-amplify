import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BookingService } from './booking.service';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private history: string[] = [];

    constructor(private router: Router, private location: Location, private bookingService: BookingService) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.history.push(event.urlAfterRedirects);
            }
        });
    }

    back(): void {
        this.history.pop();
        if (this.history.length > 0) {
            this.location.back();
        } else {
            let url = '/bookings';
            if (this.bookingService.bookingId) url += `/${this.bookingService.bookingId}`;
            this.router.navigateByUrl(url);
        }
    }
}
