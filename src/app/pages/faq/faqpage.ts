import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Request } from "../../services/";

@Component({
	templateUrl: './faqpage.html',
	styleUrls: ['./faqpage.scss'],
})
export class FaqPage implements OnInit
{

	constructor(private titleService: Title, public request: Request)
	{

	}

	ngOnInit()
	{
		this.titleService.setTitle( 'FAQ' );
	}
}
