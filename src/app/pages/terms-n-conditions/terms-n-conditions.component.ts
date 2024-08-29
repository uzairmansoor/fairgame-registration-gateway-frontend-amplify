import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '@app/app.routes';
import { BookingService, SpinnerService, UtilService } from '@app/core/services';
import { BaseComponent } from '@app/shared/components/base-component';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'app-terms-n-conditions',
    templateUrl: './terms-n-conditions.component.html',
    styleUrls: ['./terms-n-conditions.component.scss'],
})
export class TermsNConditionsComponent extends BaseComponent {
    receiveUpdates: boolean = false;
    agreeToTnc: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private bookingService: BookingService,
        private spinnerService: SpinnerService,
        public utilService: UtilService
    ) {
        super();
    }

    ngOnInit() {
        if (this.bookingService.booking.group?.acceptedTerms) {
            this.router.navigate(['..'], { relativeTo: this.route });
        }
    }

    continue() {
        this.spinnerService.loadingText = 'Please wait...';
        this.spinnerService.set(true);
        this.bookingService
            .updateGroup({ acceptedTerms: true })
            .pipe(takeUntil(this.destroyed$))
            .subscribe(
                (res) => {
                    if (!res.success || !res.data) {
                        this.spinnerService.set(false);
                        return;
                    }
                    this.router.navigate(['..', AppRoutes.Leaderboard], { relativeTo: this.route });
                },
                (err) => console.error(err)
            );
    }
}
