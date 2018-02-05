import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Request, Alert } from "../../services/";

@Component({
	templateUrl: './helpdesk.html',
	styleUrls: ['./helpdesk.scss'],
})
export class HelpDeskPage implements OnInit
{
	categories: any [];
	subject: string;
	category: string;
	message: string;
	ticketSent: boolean = false;

	constructor(
		private titleService: Title,
		public request: Request,
		public alert: Alert,
	)
	{

	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Help Desk' );
		this.getCategories();
	}

	getCategories()
	{
		this.request.get("/tickets/categories").then( response => {
			if(response.success)
			{
				this.categories = response.categories;
			}
		});
	}

	createTicket()
	{
		let loading = this.alert.loading("Sending...");

		this.request.post("/tickets/createTicket", {
			subject: this.subject,
			category: this.category,
			message: this.message,
		}).then( response =>
			{
				loading.close();
				if (!response.success)
				{
					return this.alert.error(response.message);
				}
				this.ticketSent = true;
				this.alert.success("Your ticket has been created, please allow us 24 hours to reply!");
			});
		}
	}
