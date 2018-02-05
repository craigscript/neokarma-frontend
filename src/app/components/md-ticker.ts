import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { Scrollable } from "@angular/material";
import { ObservableMedia } from "@angular/flex-layout";

@Component({
  selector: 'md-ticker',
  styleUrls: ["md-ticker.scss"],
  templateUrl: './md-ticker.html',
})
export class MdTicker
{
	@Input('ticker')
	ticker: any = {};

	increased = true;

	ngOnChanges(changes)
	{
		if(!changes.previousValue)
			return this.increased = true;
		
		if(changes.previousValue.value < changes.currentValue.value)
			return this.increased = false;
		
		if(changes.previousValue.value > changes.currentValue.value)
			return this.increased = true;
	}
}

