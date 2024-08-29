import { Component, Input } from '@angular/core';
import { ButtonSwitchConfig } from '@app/core/models';

@Component({
    selector: 'app-button-switch',
    templateUrl: './button-switch.component.html',
    styleUrls: ['./button-switch.component.scss'],
})
export class ButtonSwitchComponent {
    @Input() buttonSwitchConfig!: ButtonSwitchConfig<any>;

    onSelectOption(button: any) {
        if (this.buttonSwitchConfig.selectedOption == button.value) return;
        this.buttonSwitchConfig.selectedOption = button.value;
        if (this.buttonSwitchConfig.onChange) this.buttonSwitchConfig.onChange(button.value);
    }
}
