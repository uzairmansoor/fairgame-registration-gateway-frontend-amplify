import { Component } from '@angular/core';
import { Booking } from '@app/core/models';
import { BookingService, UtilService } from '@app/core/services';
import { BaseComponent } from '@app/shared/components/base-component';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
})
export class LandingComponent extends BaseComponent {
    booking: Booking = this.bookingService.booking;

    constructor(private bookingService: BookingService, public utilService: UtilService) {
        super();
    }
}
