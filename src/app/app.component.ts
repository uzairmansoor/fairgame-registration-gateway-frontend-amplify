import { Component } from '@angular/core';
import { ConfigService, SpinnerService, UtilService } from '@core/services';
import { take } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    readonly app = AppComponent;
    static isMobile: boolean = false;

    constructor(private configService: ConfigService, public spinnerService: SpinnerService, public utilService: UtilService) {
        AppComponent.isMobile = utilService.isMobileView;
        this.getConfigs();
    }

    private getConfigs() {
        this.configService.getConfig().pipe(take(1)).subscribe();
    }
}
