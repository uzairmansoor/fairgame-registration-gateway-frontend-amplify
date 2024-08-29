import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from './components/shared-components.module';
import { BackButtonDirective, ScrollToInvalidControlContainerDirective, ScrollToInvalidControlDirective } from './directives';
import { SafeHtmlPipe, SafeUrlPipe } from './pipes';

const Modules = [SharedComponentsModule];
const Directives = [BackButtonDirective, ScrollToInvalidControlContainerDirective, ScrollToInvalidControlDirective];
const Pipes = [SafeUrlPipe, SafeHtmlPipe];

@NgModule({
    declarations: [...Directives, ...Pipes],
    imports: [CommonModule, ...Modules],
    exports: [...Modules, ...Directives, ...Pipes],
    providers: [...Pipes],
})
export class SharedModule {}
