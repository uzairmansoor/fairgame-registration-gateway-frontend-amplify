import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AppComponent } from '@app/app.component';
import { Subject } from 'rxjs';

@Component({
    template: '',
})
export abstract class BaseComponent implements OnInit, OnDestroy {
    @ViewChild('hostTemplate', { static: false }) hostTemplate!: TemplateRef<any>;
    @Input() renderHostWrapper: boolean = true;
    readonly app = AppComponent;

    alive = false;
    destroyed$ = new Subject<boolean>();

    constructor(private hostViewContainerRef?: ViewContainerRef) {}

    ngOnInit() {
        this.alive = true;
    }

    ngAfterViewInit() {
        if (this.renderHostWrapper && this.hostViewContainerRef && this.hostTemplate) {
            this.hostViewContainerRef.createEmbeddedView(this.hostTemplate);
            this.hostViewContainerRef.element.nativeElement.remove();
        }
    }

    ngOnDestroy(): void {
        this.alive = false;
        if (this.destroyed$) {
            this.destroyed$.next(true);
            this.destroyed$.complete();
        }
    }
}
