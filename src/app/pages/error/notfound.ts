import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'neo-notfound',
	templateUrl: './notfound.html',
})
export class NotFoundPage implements OnInit
{

	constructor( private titleService: Title )
	{

	}

	ngOnInit()
	{
		// this.titleService.setTitle( 'Not found' );
	}
}
