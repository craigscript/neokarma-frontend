import { Component, OnInit } from '@angular/core';
import { Request } from "../../services/";

@Component({
	selector: 'neo-faq',
	templateUrl: './faq.html',
	styleUrls: ['./faq.scss'],
})
export class Faq implements OnInit
{
	faqs: any [];
	loading: boolean = true;

	constructor(public request: Request)
	{

	}

	ngOnInit()
	{
		this.getFaq();
	}

	getFaq()
	{
		this.loading = true;
		this.request.get("/faq").then( response => {
			this.loading = false;
			if(response.success)
			{
				this.faqs = response.qa;
			}
		});
	}

	faqToggle(item)
	{
		item.classList.toggle("isOpen");
	}
}
