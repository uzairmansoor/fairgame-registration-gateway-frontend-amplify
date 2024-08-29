import { Component, EventEmitter, Host, Input, Optional, Output, SkipSelf } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { UtilService } from '@app/core/services';
import { stringToArray } from '@app/core/functions';
import {
    CustomControlBaseComponent,
    commonInputProps,
    commonOutputProps,
    controlValueAccessorProviders,
} from '../custom-control-base-component';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss'],
    providers: [...controlValueAccessorProviders(SwitchComponent)],
    inputs: [...commonInputProps],
    outputs: [...commonOutputProps],
})
export class SwitchComponent extends CustomControlBaseComponent {
    @Input() isReverse: boolean = false;
    @Input() wrapperClass: string = '';
    @Input() wrapperStyle: string = '';
    @Input() needToConfirm: boolean = false;
    // @Input() confirmForValue: boolean = false;
    @Output() toggleStatus = new EventEmitter<boolean>();

    get classText() {
        let classes: string[] = [...stringToArray(this.class)];
        if (!this.disabled && !this.readonly) classes.push('cursor-pointer');;
        if (this.formSubmitted && this.control?.errors) classes.push('is-invalid');
        return classes.join(' ');
    }

    get wrapperClassText() {
        let classes: string[] = [...stringToArray(this.wrapperClass)];
        if (this.isReverse) classes.push('form-check-reverse');
        if (this.color) classes.push(`form-check-${this.color}`);
        return classes.join(' ');
    }

    constructor(
        @Optional()
        @Host()
        @SkipSelf()
        public override controlContainer: ControlContainer,
        private utilService: UtilService
    ) {
        super();
    }

    preventDefault = async (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        // const currentValue = e.target.checked;
        // if (this.needToConfirm && currentValue === this.confirmForValue) {
        //     const confirmed = await this.utilService.showConfirmationDialog('static');
        //     if (!confirmed) {
        //         e.target.checked = !currentValue;
        //         this.value = e.target.checked;
        //         return;
        //     }
        // }
        this.toggleStatus.emit(this.value);
    };
}
