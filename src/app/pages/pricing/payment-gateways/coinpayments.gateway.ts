import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MdDialog } from '@angular/material';
import { Router, ActivatedRoute } from "@angular/router";
import { Request, Alert, User } from "../../../services/";

const Currencies = {
	btc: {
		name: "BitCoin",
	}
};

@Component({
	selector: 'neo-coinpayments-gateway',
	templateUrl: './coinpayments.gateway.html',
	styleUrls: ['./coinpayments.gateway.scss'],
})
export class CoinPaymentsGatewayPage implements OnInit
{
	Currency = "BTC";
	loadingPayment = false;
	TransactionInfo = {};
	loadingPlan = false;
	paymentPlan: any = {};
	paymentId = null;
	paymentDetails = null;

	ticker = null;
	
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
		this.activeRoutes.params.subscribe((params) => {
			this.paymentDetails = null;
			this.TransactionInfo = null;
			if(params.planId && params.currency)
			{
				this.getPlan(params.planId);
				this.Currency = params.currency;
			}
		});
		this.titleService.setTitle( 'Pay with Cryptocurrency' );
	}

	ngOnDestroy()
	{
		clearInterval(this.ticker);
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

	createPayment()
	{
		if(this.paymentDetails)
		{
			return this.alert.error("Payment already created");
		}

		let loading = this.alert.loading("Creating payment address");
		this.request.post("/subscription/createPayment/" + this.paymentPlan._id + "/coinpayments", {
			paymentOptions: {
				targetCurrency: this.Currency,
			}
		}).then( response => {
			loading.close();
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.startTicker();
			this.paymentDetails = response.payment;
			this.TransactionInfo = response.payment.transaction;
		});
	}

	startTicker()
	{
		clearInterval(this.ticker);
		this.ticker = setInterval(() => {
			this.getPayment(this.paymentDetails._id);
		}, 5000);
	}
	
	getPayment(paymentId)
	{
		this.loadingPayment = true;
		this.request.get("/subscription/getPayment/" + paymentId).then( response => {
			this.loadingPayment = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.paymentDetails = response.payment;
			if(this.paymentDetails.status == "Paid")
			{
				clearInterval(this.ticker);
				this.alert.success("Payment complete! Thank you");
				this.user.UpdateUserData();
				setTimeout(() => {
					this.router.navigateByUrl("/app/user/account");
				}, 2000);
			}
			this.paymentPlan = response.payment.plan;
		});
	}

}
