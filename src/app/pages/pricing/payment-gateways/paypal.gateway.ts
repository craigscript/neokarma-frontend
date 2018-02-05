import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MdDialog } from '@angular/material';
import { Router, ActivatedRoute } from "@angular/router";
import { Request, Alert, User} from "../../../services/";

@Component({
	selector: 'neo-paypal-gateway',
	templateUrl: './paypal.gateway.html',
	styleUrls: ['./paypal.gateway.scss'],
})
export class PayPalGatewayPage implements OnInit
{
	loadingPlan = false;
	paymentPlan: any = {};
	confirmation = false;
	paymentId = null;
	paymentDetails = null;

	constructor(
		private titleService: Title,
		public request: Request,
		public dialog: MdDialog,
		public alert: Alert,
		public user: User,
		public activeRoutes: ActivatedRoute,
		public router: Router,
	)
	{

	}

	ngOnInit()
	{
		this.activeRoutes.data.subscribe( (data) => {
			console.log("data:", data);
			if(data.status == 'confirm')
			{
				this.confirmation = true;
			}
		});
		this.activeRoutes.params.subscribe((params) => {
			console.log("Params:", params);
			if(params.planId)
			{
				this.getPlan(params.planId);
			}
			if(params.paymentId)
			{
				this.getPayment(params.paymentId);
			}
		});
		this.titleService.setTitle( 'Pay via Paypal' );
	}

	getPlan(planId)
	{
		this.loadingPlan = true;
		this.request.get("/subscription/getUpgradePlan/" + planId).then( response => {
			this.loadingPlan = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.paymentPlan = response.plan;
		})
	}

	startPayment()
	{
		let loading = this.alert.loading("Connecting to paypal.");
		this.request.post("/subscription/createSubscription/" + this.paymentPlan._id + "/paypal", {
			currency: "USD",
		}).then( response => {
			loading.close();
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			let waiting = this.alert.loading("Redirecting to paypal.");
			let transaction = response.payment.transaction;
			console.log("transaction:", transaction);
			if(transaction.method == 'redirect')
			{
				window.location.href = transaction.href;
			}

			setTimeout(() => {
				waiting.close();
			}, 10*1000);

		});
	}

	getPayment(paymentId)
	{
		this.loadingPlan = true;
		this.request.get("/subscription/getPayment/" + paymentId).then( response => {
			this.loadingPlan = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.paymentDetails = response.payment;
			this.paymentPlan = response.payment.plan;
		});
	}

	confirmPayment()
	{
		let loading = this.alert.loading("Connecting to paypal.");
		this.request.post("/subscription/executeSubscription/" + this.paymentDetails._id, {}).then( response => {
			loading.close();
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.alert.success("Payment complete! Thank you");
			this.user.UpdateUserData();
			setTimeout(() => {
				this.router.navigateByUrl("/app/user/account");
			}, 2000);

		});
	}
}
