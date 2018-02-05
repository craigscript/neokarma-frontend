import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Scrollable } from "@angular/material";
import { ObservableMedia } from "@angular/flex-layout";

@Component({
  selector: 'md-counter',
  styleUrls: ["md-counter.scss"],
  templateUrl: './md-counter.html',
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdCounter
{
	@Input('target')
	TargetNumber: number = 0;
	
	@Input('start')
	OutputNumber: number = 0;

	@Input('decimals')
	Decimals: number = 0;
	
	@Input('digits')
	Digits: number = 1;

	DecimalFormat = "1.0-0";

	@Input("speed")
	Speed = 1;

	InterpNumber = 0;

	LastTime = Date.now();

	constructor(public media: ObservableMedia, private el:ElementRef, public changeDetector: ChangeDetectorRef, public zone: NgZone)
	{
		//changeDetector.detach();
	}

	ngOnChanges(changes, oldChanges)
	{
		console.log("MdCounter Change detector is running?", changes);
	//	this.InterpNumber = this.OutputNumber;
		this.LastTime = Date.now();
		this.DecimalFormat = this.Digits + "." + this.Decimals + "-" + this.Decimals;
		//this.scheduleNextTick(100);
	}
	
	ngOnInit()
	{
		this.LastTime = Date.now();
	//	this.updateNumber();
	}

	ngOnDestroy()
	{
		clearTimeout(this.tickTimer);
	}

	tickTimer = null;
	updateNumber()
	{
		if(Math.abs(this.InterpNumber - this.TargetNumber) > 0)
		{
			var delta = Date.now() - this.LastTime;
			this.LastTime = Date.now();
			this.InterpNumber = this.interPolate(this.InterpNumber, this.TargetNumber, 0.1, this.Speed);
			
		//	this.scheduleNextTick();
			// window.requestAnimationFrame(() => {
			// 	this.updateNumber();
			// })
		}
	}

	scheduleNextTick(delay=10)
	{

	}

	interPolate(Current, Target, DeltaTime, InterpSpeed = 1.0)
	{
		if( InterpSpeed <= 0.0 )
		{
			return Target;
		}

		// Distance to reach
		let Dist = Target - Current;

		if( Dist * Dist < 0.00001 )
		{
			return Target;
		}
		
		
		// Delta Move, Clamp so we do not over shoot.
		let DeltaMove = Dist * Math.min(Math.max(DeltaTime * InterpSpeed, 0.0), 1.0);

		return Current + DeltaMove;
	}
}

