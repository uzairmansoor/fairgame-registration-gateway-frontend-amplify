import { Component, Host, Input, Optional, SkipSelf } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { stringToArray } from '@app/core/functions';
import {
    commonInputProps,
    commonOutputProps,
    controlValueAccessorProviders,
    CustomControlBaseComponent,
} from '../custom-control-base-component';
@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [...controlValueAccessorProviders(InputComponent)],
    inputs: [...commonInputProps],
})
export class InputComponent extends CustomControlBaseComponent {
    @Input() maxlength: number = 0;
    @Input() size: string = '';
    @Input() type: 'text' | 'number' | 'password' | 'tel' | 'email' | 'url' | 'search' = 'text';
    @Input() useInputGroup = false;
    @Input() note: string = '';

    get inputGroupClassText() {
        let classes: string[] = [];
        if (this.size) classes.push(`input-group-${this.size}`);
        return classes.join(' ');
    }

    get classText() {
        let classes: string[] = [...stringToArray(this.class)];
        if (this.size) classes.push(`form-control-${this.size}`);
        if (this.formSubmitted && this.control?.errors) classes.push('is-invalid');
        return classes.join(' ');
    }

    constructor(
        @Optional()
        @Host()
        @SkipSelf()
        public override controlContainer: ControlContainer
    ) {
        super();
    }
}
