import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Request, Alert } from "../../services/";
import { Recaptcha } from "../../config";

@Component({
	selector: 'auth-renewpass-page',
	templateUrl: './renewpass.html',
})
export class RenewPasswordPage
{
	recoveryEmail: string;
	newPassword: string;
	recoveryKey: string;
	
	// Recaptcha
	captchaRequired = true;
	captchaSolution: any = null;
	captchaSiteKey = Recaptcha.SiteKey;

	@ViewChild("captchaRef")
	captchaRef: any;

	constructor(
		public request: Request,
		public alert: Alert,
		public router: Router,
		public route: ActivatedRoute,
		private titleService: Title,
	)
	{
		this.titleService.setTitle( 'Renew Password' );
		route.params.subscribe( params => {
			this.recoveryKey = params.recoveryKey;
			this.recoveryEmail = params.email;
		});
	}

	renewPass()
	{
		let loading = this.alert.loading("Sending...");

		this.request.post("/auth/renewPassword", {
			email: this.recoveryEmail,
			recoveryKey: this.recoveryKey,
			password: this.newPassword,
			captcha: this.captchaSolution
		}).then( response => {
			loading.close();
			
			if(!response.success)
			{
				this.captchaRef.reset();
				return this.alert.error(response.message);
			}
			
			let alert = this.alert.open("Success", "Your password has been changed!");
			alert.afterClosed().subscribe(() => {
				this.router.navigateByUrl("/auth/login");
			});
			
		});
	}

	captchaResolved(captchaResponse: string)
	{
		this.captchaSolution = captchaResponse;
	}
}
