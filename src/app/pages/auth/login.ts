import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Request, Alert, User } from "../../services/";

@Component({
	selector: 'auth-login-page',
	templateUrl: './login.html',
})
export class LoginPage implements OnInit
{
	email: string;
	password: string;
	remember: boolean = true; // set to default
	failed: boolean = false;

	constructor(
		public request: Request,
		public alert: Alert,
		public user: User,
		public router: Router,
		private titleService: Title,
	)
	{
		this.titleService.setTitle( 'Login' );
	}

	ngOnInit()
	{
		if(this.user.IsAuthenticated())
			this.router.navigateByUrl("/markets");
	}

	login()
	{
		let loading = this.alert.loading("Authenticating...");

		this.user.logIn(this.email, this.password, this.remember).then( () => {
			loading.close();
			this.failed = false;
			this.router.navigateByUrl("/markets");
		}).catch( (error) => {
			loading.close();
			this.failed = true;
			this.alert.open("Failed to log in.", error);
		});
	}
}
