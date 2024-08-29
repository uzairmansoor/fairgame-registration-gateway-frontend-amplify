import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '@app/app.routes';
import { blobToBase64 } from '@app/core/functions';
import { Booking } from '@app/core/models';
import { BookingService, ConfigService, SpinnerService, UtilService } from '@core/services';
import { BaseComponent } from '@shared/components/base-component';
import { take, takeUntil } from 'rxjs';

@Component({
    selector: 'app-leaderboard-info',
    templateUrl: './leaderboard-info.component.html',
    styleUrls: ['./leaderboard-info.component.scss'],
})
export class LeaderboardInfoComponent extends BaseComponent {
    @Input() booking!: Booking;

    isNewGroup: boolean = false;
    qrCodeData: { uri: string; blob?: Blob; base64?: string; loaded?: boolean } = { uri: '' };
    googlePassLink: string = '';

    readonly termsAndConditionsRoute = AppRoutes.TermsAndConditions;
    readonly leaderboardRoute = AppRoutes.Leaderboard;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public bookingService: BookingService,
        public configService: ConfigService,
        private spinnerService: SpinnerService,
        private utilService: UtilService
    ) {
        super();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.setBookingQRCode();
        if (!this.booking && this.bookingService.booking) {
            this.booking = this.bookingService.booking;
            this.isNewGroup = true;
        }
        if (this.booking.group) this.getGooglePass();
    }

    getApplePass() {
        this.bookingService.getApplePass().pipe(takeUntil(this.destroyed$)).subscribe();
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

    openGooglePass() {
        if (!this.googlePassLink) return;
        window.open(this.googlePassLink, '_blank');
    }

    downloadInvite() {
        this.spinnerService.set(true);
        try {
            let bookingDatetime = this.utilService.getReadableDate(this.booking.eventDate);
            if (this.booking.eventTime) bookingDatetime += `, ${this.booking.eventTime}`;
            this.bookingService
                .generateBookingPDF(
                    this.booking.leadbookerName,
                    this.booking.reservationId,
                    bookingDatetime,
                    this.booking.memberCount || 0,
                    this.booking.upgrades?.game1 || 0,
                    this.booking.upgrades?.food1 || 0,
                    this.booking.upgrades?.drink1 || 0,
                    this.qrCodeData.base64 || ''
                )
                .download(`${this.booking.reservationId}.pdf`);
        } catch (ex) {
            console.error(ex);
        } finally {
            this.spinnerService.set(false);
        }
    }

    async shareInvite() {
        const link = `${location.origin}/bookings/${this.booking.reservationId}/invite`;
        const text = `I'm inviting you to join my group, so that we can play together at Fairgame: ${link}`;
        this.utilService.share({
            title: document.title,
            text,
        });
    }

    updateLeaderboardNames() {
        if (!this.booking.group?.acceptedTerms) {
            this.router.navigate([AppRoutes.TermsAndConditions], { relativeTo: this.route });
            return;
        }
        this.router.navigate([AppRoutes.Leaderboard], { relativeTo: this.route });
    }
}
