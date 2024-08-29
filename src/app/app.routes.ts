import { Routes } from '@angular/router';
import { BookingResolverService } from './core/services';
import {
    BookingComponent,
    InviteComponent,
    LandingComponent,
    LeaderboardComponent,
    LeaderboardInfoComponent,
    TermsNConditionsComponent,
} from './pages';

export const enum AppRoutes {
    Booking = 'booking',
    Landing = '',
    TermsAndConditions = 'terms-n-conditions',
    Leaderboard = 'leaderboard',
    LeaderboardInfo = 'leaderboard-info',
    Invite = 'invite',
}

export const routes: Routes = [
    {
        path: 'bookings',
        component: BookingComponent,
    },
    {
        path: 'bookings/:bookingId',
        component: BookingComponent,
        resolve: {
            booking: BookingResolverService,
        },
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: AppRoutes.Landing,
                component: LandingComponent,
            },
            {
                path: AppRoutes.TermsAndConditions,
                component: TermsNConditionsComponent,
            },
            {
                path: AppRoutes.Leaderboard,
                component: LeaderboardComponent,
            },
            {
                path: AppRoutes.LeaderboardInfo,
                component: LeaderboardInfoComponent,
            },
            {
                path: AppRoutes.Invite,
                component: InviteComponent,
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/bookings',
    },
];
