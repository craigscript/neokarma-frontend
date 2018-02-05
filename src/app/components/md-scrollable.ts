import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { Scrollable } from "@angular/material";
import { ObservableMedia } from "@angular/flex-layout";

@Component({
  selector: 'md-scrollable',
  styleUrls: ["md-scrollable.scss"],
  templateUrl: './md-scrollable.html',
})
export class MdScrollable
{
	@Output("scrolled-down")
	ScrolledDown = new EventEmitter();

	@Input('scroll-distance')
	ScrollDistance: number = 0;
	
	bTriggered = false;

	constructor(public media: ObservableMedia, private el:ElementRef)
	{
		media.subscribe();
		
	}

 	@HostListener('scroll', ["$event"])
	onScrolledHost(event: Event)
	{
		let element = this.el.nativeElement;
		if(element.offsetHeight+element.scrollTop >= (element.scrollHeight - this.ScrollDistance))
		{
			this.ScrolledDown.emit();
		}
	}

}

