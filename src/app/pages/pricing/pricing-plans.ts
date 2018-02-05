import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MdDialog } from '@angular/material';
import { TdMediaService } from "@covalent/core";
import { Router } from "@angular/router";
import { Request, Alert, User } from "../../services/";
import { PayPalGatewayPage } from "./payment-gateways/paypal.gateway";
import { CoinPaymentsGatewayPage } from "./payment-gateways/coinpayments.gateway";
import { cryptoData } from "./cryptoData";

const PaymentMethods = {
	paypal: PayPalGatewayPage,
	coinpayments: CoinPaymentsGatewayPage,
};

@Component({
	selector: 'neo-pricing-plans-page',
	templateUrl: './pricing-plans.html',
	styleUrls: ['./pricing-plans.scss'],
})
export class PricingPlansPage implements OnInit
{
	pricingPlans: any[] = [];
	loadingPlans = true;
	selectedPlan = null;
	cryptoData: any [];

	constructor(
		private titleService: Title,
		public request: Request,
		public dialog: MdDialog,
		public media: TdMediaService,
		public alert: Alert,
		public user: User,
		public router: Router,
	)
	{

	}

	ngOnInit()
	{
		this.titleService.setTitle( 'User Account' );
		this.getPlans();
		this.cryptoData = cryptoData;
	}

	getPlans()
	{
		this.loadingPlans = true;
		this.request.get("/subscription/getPlans").then( response => {
			this.loadingPlans = false;
			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.pricingPlans = response.plans;
		});
	}

	selectPlan(plan)
	{
		if(this.selectedPlan)
		{
			this.selectedPlan.selected = false;
		}
		plan.selected = true;
		this.selectedPlan = plan;
	}

	resetPlans()
	{
		this.selectedPlan = null;
		for(let plan of this.pricingPlans)
		{
			plan.selected = false;
		}
	}

	selectPaymentMethod(method, currency)
	{
		if(!this.selectedPlan)
		{
			return this.alert.error("First please select a plan.");
		}
		this.router.navigateByUrl("/app/payment/" + method + "/" + this.selectedPlan._id + "/" + currency);
		console.log("Paying via:", method, this.selectedPlan);
	}

	startTrial(plan)
	{
		if(plan.trial)
		{
			let loading = this.alert.loading("Starting trial");
			this.request.get("/subscription/executeTrial/" + plan._id).then( response => {
				loading.close();
				if(!response.success)
				{
					return this.alert.error(response.message);
				}
				this.alert.success("Trial started! Thank you!");
				this.user.UpdateUserData();
				setTimeout(() => {
					this.router.navigateByUrl("/app/user/account");
				}, 2000);
			});
		}
	}
}
