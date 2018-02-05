import {EventEmitter, ElementRef, OnInit, Directive, Input, Output} from '@angular/core';

@Directive({ selector: '[debugChanges]' })
export class ChangeDebugDirective
{
    constructor(
        private elementRef: ElementRef,
    )
    {
    }

    ngDoCheck()
	{
		console.log("ChangeDebugDirective does checking");
	}

	

	ngOnChanges()
	{
		console.log("ChangeDebugDirective has chanes?");
	}

}