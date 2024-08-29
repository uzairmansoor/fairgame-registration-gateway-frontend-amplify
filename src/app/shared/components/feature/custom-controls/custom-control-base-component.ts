import { Component, EventEmitter, forwardRef, Input, Output, Type } from '@angular/core';
import { AbstractControl, ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '../../base-component';

export function controlValueAccessorProviders(type: Type<any>) {
    return [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => type), multi: true }];
}

// common input properties for component which extends this component
export const commonInputProps = [
    'label',
    'id',
    'name',
    'disabled',
    'readonly',
    'class',
    'style',
    'placeholder',
    'control',
    'formControlName',
    'color',
    'useFloatingLabel',
];
// common output events for component which extends this component
export const commonOutputProps = ['change'];

@Component({
    template: '',
})
export abstract class CustomControlBaseComponent extends BaseComponent implements ControlValueAccessor {
    label!: string;
    showLabel: boolean = false;
    id: any;
    name!: string;
    disabled: boolean = false;
    readonly: boolean = false;
    class: string = '';
    style: string = '';
    placeholder: string = '';
    color: string = 'golden';

    formControlName!: string;
    control: AbstractControl | undefined;
    controlContainer!: ControlContainer;
    useFloatingLabel: boolean = false;

    @Input('value') _value: any = '';
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.onChange(value);
        this.onTouched();
    }
    @Output() change = new EventEmitter();

    private onChange: any = (value: any) => {};
    private onTouched: any = () => {};

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    get controlId() {
        return this.id || this.controlName;
    }

    get controlName() {
        return this.name || this.formControlName;
    }

    get formSubmitted() {
        return (this.controlContainer?.formDirective as any)?.submitted;
    }

    constructor() {
        super();
    }

    override ngOnInit(): void {
        super.ngOnInit();
        if (this.controlContainer) {
            if (this.formControlName) {
                this.control = this.controlContainer?.control?.get(this.formControlName) as AbstractControl;
            }
            // else {
            //     console.warn('Missing FormControlName directive from host element of the component');
            // }
        } else {
            console.warn("Can't find parent FormGroup directive");
        }
    }
}
