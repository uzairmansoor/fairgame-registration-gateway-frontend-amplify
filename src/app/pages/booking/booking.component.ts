import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppRoutes } from '@app/app.routes';
import { Booking } from '@app/core/models';
import { BookingService, UtilService } from '@app/core/services';
import { BaseComponent } from '@app/shared/components/base-component';

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss'],
})
export class BookingComponent extends BaseComponent {
    booking!: Booking;
    isLoading: boolean = false;
    err: string = '';

    removeTopMargin: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bookingService: BookingService,
        public utilService: UtilService
    ) {
        super();
        this.setRouteDataListener();
        this.setRouterEventsListener();
    }

    private setRouteDataListener() {
        this.route.data.subscribe(({ booking }) => {
            if (!booking) {
                this.err = 'Invalid link';
                return;
            }
            if (typeof booking == 'string') this.err = booking;
            else {
                this.booking = booking;
                this.bookingService.booking = booking;
            }
        });
    }

    setRouterEventsListener() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.removeTopMargin = event.urlAfterRedirects.endsWith(AppRoutes.Invite);
            }
        });
    }
}
