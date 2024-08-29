import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NavigationService } from '@core/services';

@Directive({
    selector: '[backButton]',
})
export class BackButtonDirective {
    constructor(private navigation: NavigationService, private renderer: Renderer2, private el: ElementRef) {}

    @HostListener('click')
    onClick(): void {
        this.navigation.back();
    }
}
