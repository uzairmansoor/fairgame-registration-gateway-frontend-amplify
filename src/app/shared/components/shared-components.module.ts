import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomControlsModule } from './feature/custom-controls/custom-controls.module';
import { SpinnerComponent } from './ui';

const Modules = [CustomControlsModule];
const Components = [SpinnerComponent];

@NgModule({
    declarations: [...Components],
    imports: [CommonModule, ...Modules],
    exports: [...Modules, ...Components],
    providers: [],
})
export class SharedComponentsModule {}
