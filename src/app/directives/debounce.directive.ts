import {EventEmitter, ElementRef, OnInit, Directive, Input, Output} from '@angular/core';
import { Observable } from 'rxjs';
import { NgModel } from '@angular/forms';

@Directive({ selector: '[debounce]' })
export class DebounceDirective implements OnInit
{
    @Input("debouncedelay")
    debouncedelay: number = 700;

    @Output("debounced")
    debounced: EventEmitter<any> = new EventEmitter();

    constructor(
        private elementRef: ElementRef,
        private model: NgModel
    )
    {
    }

    ngOnInit(): void
    {
        const eventStream = Observable.fromEvent(this.elementRef.nativeElement, 'keyup')
            .map(() => this.model.value)
            .debounceTime(this.debouncedelay);

        eventStream.subscribe(input => this.debounced.emit(input));
    }

}