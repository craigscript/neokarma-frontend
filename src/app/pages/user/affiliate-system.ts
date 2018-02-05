import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MdDialog } from '@angular/material';
import { Request, Alert, User } from "../../services";
import { PayoutAddressDialog } from "./dialogs";

@Component({
	templateUrl: './affiliate-system.html',
	styleUrls: ['./affiliate-system.scss'],
})
export class AffiliateSystemPage implements OnInit
{
	payoutAddress: string;
	affiliates = [
		{
			id: 1,
			name: 'Richard Graham',
			username: 'richardgenki',
			paid: 0.00,
			status: 'Active',
		},
		{
			id: 2,
			name: 'Richard Graham',
			username: 'richardgenki',
			paid: 0.00,
			status: 'Active',
		},
		{
			id: 3,
			name: 'Richard Graham',
			username: 'richardgenki',
			paid: 0.00,
			status: 'Active',
		},
	];

	constructor(
		private title: Title,
		private dialog: MdDialog,
	)
	{

	}

	ngOnInit()
	{
		this.title.setTitle( 'Affiliate System' );
	}

	changeAddress()
	{
		this.dialog.open(PayoutAddressDialog);
	}
}
