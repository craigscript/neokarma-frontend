import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Request, Alert } from "../../services/";

@Component({
	selector: 'email-verification',
	templateUrl: './email-verification.html',
})
export class EmailVerificationPage implements OnInit
{
	email: string;
	emailToken: string;

	loading = false;
	success: boolean;

	constructor(
		public request: Request,
		public alert: Alert,
		public router: Router,
		public route: ActivatedRoute,
		private titleService: Title,
	)
	{
		this.titleService.setTitle( 'Email Verification' );
		route.params.subscribe( params => {
			this.email = params.emailAddress;
			this.emailToken = params.emailToken;
			if(this.email && this.emailToken)
			{
				this.verification();
			}
			else
			{
				this.success = false;
			}
		});
	}

	ngOnInit()
	{

	}

	verification()
	{
		this.loading = true;
		this.request.post("/auth/verifyEmail", {
			email: this.email,
			emailToken: this.emailToken,
		}).then( response => {
			this.loading = false;
			if(!response.success)
			{
				this.success = false;
				return;
			}
			this.success = true;
		});
	}
}
