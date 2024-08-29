import { Component } from '@angular/core';
import { blobToBase64 } from '@app/core/functions';
import { Booking } from '@app/core/models';
import { BookingService } from '@app/core/services';
import { BaseComponent } from '@app/shared/components/base-component';
import { take, takeUntil } from 'rxjs';

@Component({
    selector: 'app-invite',
    templateUrl: './invite.component.html',
    styleUrls: ['./invite.component.scss'],
})
export class InviteComponent extends BaseComponent {
    booking: Booking = this.bookingService.booking;
    qrCodeData: { uri: string; blob?: Blob; base64?: string; loaded?: boolean } = { uri: '' };
    googlePassLink: string = '';

    constructor(private bookingService: BookingService) {
        super();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.setBookingQRCode();
        if (this.booking.group) this.getGooglePass();
    }

    getApplePass() {
        this.bookingService.getApplePass().pipe(takeUntil(this.destroyed$)).subscribe();
    }

    openGooglePass() {
        if (!this.googlePassLink) return;
        window.open(this.googlePassLink, '_blank');
    }

    private setBookingQRCode() {
        this.bookingService
            .getBookingQrCode()
            .pipe(take(1))
            .subscribe(async (res) => {
                if (!res) return;
                this.qrCodeData = res;
                if (res.blob) {
                    this.qrCodeData.base64 = await (<any>blobToBase64(res.blob));
                    this.qrCodeData.loaded = true;
                }
            });
    }

    private getGooglePass() {
        this.bookingService
            .getGooglePassLink()
            .pipe(takeUntil(this.destroyed$))
            .subscribe((res) => {
                if (res.success) this.googlePassLink = res.data;
            });
    }
}
