import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
    @Input() bgColor: string = 'white';
    @Input() type: 'button' | 'submit' = 'button';
    @Input() text: string = '';
    @Input() classes: string = '';
    @Input() disabled: boolean = false;
    @Input() iconOnly: boolean = false;

    @Output() onClick = new EventEmitter();

    currentBgColor: string = this.bgColor;

    constructor(private el: ElementRef) {}

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if (!changes) return;
        if (changes.bgColor) this.currentBgColor = changes.bgColor.currentValue;
        if (changes.disabled) this.setDisabledState();
    }

    ngAfterViewInit() {
        this.setDisabledState();
    }

    private setDisabledState() {
        const el = this.el.nativeElement as HTMLElement;
        if (this.disabled) {
            el.setAttribute('disabled', 'true');
            el.classList.add('pe-none');
        } else {
            el.setAttribute('disabled', 'false');
            el.classList.remove('pe-none');
        }
    }
}
