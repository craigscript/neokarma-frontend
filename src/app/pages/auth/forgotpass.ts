import { Component, ChangeDetectorRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Request, Alert, User } from "../../services/";
import { Recaptcha } from "../../config";

@Component({
	selector: 'auth-forgotpass-page',
	templateUrl: './forgotpass.html',
})
export class ForgotPasswordPage
{
	recoveryEmail: string;

	// Recaptcha
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
		this.titleService.setTitle( 'Forgot Password' );
	}

	ngOnInit()
	{
		if(this.user.IsAuthenticated())
			this.router.navigateByUrl("/app/dashboard");
	}


	recoveryPass()
	{
		let loading = this.alert.loading("Sending...");

		this.request.post("/auth/recoverPassword", {
			email: this.recoveryEmail,
			captcha: this.captchaSolution
		}).then( response => {
			loading.close();
			if(!response.success)
			{
				this.captchaRef.reset();
				return this.alert.error(response.message);
			}
			
			this.alert.open("Password Recovery", "Please check your email! We've sent instructions about restoring your password!");
			this.router.navigateByUrl("/login");

		});
	}

	captchaResolved(captchaResponse: string)
	{
		this.captchaSolution = captchaResponse;
	}
}
