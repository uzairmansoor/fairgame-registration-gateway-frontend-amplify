import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { ApiInterceptor } from '@core/interceptors';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingComponent, LandingComponent, LeaderboardComponent, LeaderboardInfoComponent, TermsNConditionsComponent } from './pages';
import { InviteComponent } from './pages/invite/invite.component';

const PagesComponents = [BookingComponent, LandingComponent, TermsNConditionsComponent, LeaderboardComponent, LeaderboardInfoComponent];

@NgModule({
    declarations: [AppComponent, ...PagesComponents, InviteComponent],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule, SharedModule, FormsModule],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }],
    bootstrap: [AppComponent],
})
export class AppModule {}
