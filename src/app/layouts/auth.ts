import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Request, Alert, User } from "../services/";

@Component({
	selector: 'auth-layout',
	templateUrl: './auth.html',
})
export class AuthLayout implements OnInit
{
	constructor(
		public request: Request,
		public alert: Alert,
		public user: User,
		public router: Router,
		private titleService: Title,
	)
	{
	}

	ngOnInit()
	{
		
	}

}
