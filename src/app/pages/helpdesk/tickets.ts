import { Component, OnInit } from '@angular/core';
import { Request, Alert } from "../../services/";

@Component({
	selector: 'tickets',
	templateUrl: './tickets.html',
	styleUrls: ['./tickets.scss'],
})
export class Tickets implements OnInit
{
	tickets: any [] = [];
	loadingTickets = true;

	constructor(
		public request: Request,
		public alert: Alert,
	)
	{

	}

	ngOnInit()
	{
		this.getTickets();
	}


	getTickets()
	{
		this.loadingTickets = true;
		this.request.get("/tickets").then( response => {
			this.loadingTickets = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.tickets = response.tickets;
		});
	}
}
