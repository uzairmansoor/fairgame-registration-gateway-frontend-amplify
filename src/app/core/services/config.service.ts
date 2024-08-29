import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/core/models';
import { environment } from '@environments/environment';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
    bookingLandingWithoutGroup = {
        bookingTitle: "Let's get started",
        bookingSetupLeaderboard:
            "Now you'll need to set up your leaderboard with your guests and don't forget to give your group an awesome name! Names can be edited when you check-in, so dont worry if you're not feeling inspired right now!",
    };
    bookingLandingWithGroup = {
        bookingTitle: 'Now invite your mates',
        bookingInviteYourMates:
            "Share an invite with your mates so they know when the fun's happening and can easily check-in on the day! Check-in is fast and flexible with our kiosks. You don't even have to all arrive at the same time!",
    };

    constructor(private httpClient: HttpClient) {}

    getConfig() {
        return this.httpClient.get<ApiResponse<any>>(`${environment.apiBaseUrl}/config/registration-gateway`).pipe(
            tap((res) => {
                if (!res.success || !res.data || !res.data.content) return;
                const { bookingLandingWithoutGroup, bookingLandingWithGroup } = res.data.content;
                if (bookingLandingWithoutGroup) {
                    this.bookingLandingWithoutGroup = {
                        ...this.bookingLandingWithoutGroup,
                        ...bookingLandingWithoutGroup,
                    };
                }
                if (bookingLandingWithGroup) {
                    this.bookingLandingWithGroup = {
                        ...this.bookingLandingWithGroup,
                        ...bookingLandingWithGroup,
                    };
                }
            })
        );
    }
}
