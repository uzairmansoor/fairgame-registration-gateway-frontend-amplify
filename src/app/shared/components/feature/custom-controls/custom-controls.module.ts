import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonSwitchComponent } from './button-switch/button-switch.component';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { SwitchComponent } from './switch/switch.component';

const Modules = [FormsModule, ReactiveFormsModule];
const Components = [ButtonComponent, ButtonSwitchComponent, SwitchComponent, InputComponent];

@NgModule({
    declarations: [...Components],
    imports: [CommonModule, ...Modules],
    exports: [...Modules, ...Components],
    providers: [],
})
export class CustomControlsModule {}
