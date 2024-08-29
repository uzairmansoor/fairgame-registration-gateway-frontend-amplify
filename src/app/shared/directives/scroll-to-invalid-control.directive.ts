import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { debounceTime, fromEvent, take } from 'rxjs';

@Directive({
    selector: '[scrollToInvalidControlContainer]',
})
export class ScrollToInvalidControlContainerDirective {
    readonly containerEl: HTMLElement = this.el.nativeElement;

    constructor(private el: ElementRef) {}
}

@Directive({
    selector: '[scrollToInvalidControl]',
})
export class ScrollToInvalidControlDirective {
    private get containerEl(): any {
        return this.scrollContainerDir ? this.scrollContainerDir.containerEl : window;
    }

    constructor(
        private el: ElementRef,
        private formGroupDir: FormGroupDirective,
        @Optional()
        private scrollContainerDir: ScrollToInvalidControlContainerDirective
    ) {}

    @HostListener('ngSubmit') onSubmit() {
        if (this.formGroupDir.control.invalid) {
            this.scrollToFirstInvalidControl();
        }
    }

    private scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector('.ng-invalid:not(form):not(.row)');
        if (!firstInvalidControl) return;
        let top = this.getTopOffset(firstInvalidControl);
        this.containerEl.scroll({
            top: top,
            left: 0,
            behavior: 'smooth',
        });

        fromEvent(this.containerEl, 'scroll')
            .pipe(debounceTime(100), take(1))
            .subscribe(() => firstInvalidControl.focus());
    }

    private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 60;
        const controlElTop = controlEl.getBoundingClientRect().top;

        if (this.scrollContainerDir) {
            const containerTop = this.containerEl.getBoundingClientRect().top;
            const absoluteControlElTop = controlElTop + this.containerEl.scrollTop;

            return absoluteControlElTop - containerTop - labelOffset;
        } else {
            const absoluteControlElTop = controlElTop + window.scrollY; //controlEl.offsetTop;

            return absoluteControlElTop - labelOffset;
        }
    }
}
