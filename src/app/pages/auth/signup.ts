import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Request, Alert, User } from "../../services/";
import { Recaptcha } from "../../config";

@Component({
	selector: 'auth-signup-page',
	templateUrl: './signup.html',
})
export class SignUpPage implements OnInit
{
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	captchaRequired = true;
	captchaSolution: any = null;
	captchaSiteKey = Recaptcha.SiteKey;

	@ViewChild("captchaRef")
	captchaRef: any;

	constructor(
		public request: Request,
		public alert: Alert,
		public user: User,
		public router: Router,
		private titleService: Title,
	)
	{
		this.titleService.setTitle( 'Sign Up' );
	}

	ngOnInit()
	{
		if(this.user.IsAuthenticated())
		{
			this.router.navigateByUrl("/app/dashboard");
		}
		this.getCaptchaSettings();
	}

	signUp()
	{
		let loading = this.alert.loading("Please wait...");

		this.request.post("/auth/signUp", {
			email: this.email,
			password: this.password,
			personal: {
				firstname: this.firstname,
				lastname: this.lastname
			},
			captcha: this.captchaSolution
		}).then( response => {
			loading.close();

			if (!response.success)
			{
				this.captchaRef.reset();
				this.alert.open("Failed to sign up.", response.message);
			}
			else
			{
				this.alert.success("Registration success!");
				this.router.navigateByUrl("/app/plans");
			}
		});
	}

	captchaResolved(captchaResponse: string)
	{
		this.captchaSolution = captchaResponse;
	}

	getCaptchaSettings()
	{
		this.request.get("/auth/captcha").then( response => {
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.captchaRequired = response.captcha.required;
			this.captchaSiteKey = response.captcha.publicKey;
		});
	}
}
