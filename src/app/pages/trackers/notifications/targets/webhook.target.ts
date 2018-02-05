import { Component, OnInit, Input, Output, EventEmitter, Directive, ViewContainerRef} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { Request, Alert } from "../../../../services";

@Component({
	templateUrl: './webhook.target.html',
})
export class WebhookTarget
{
	@Input()
	targetOptions: any = {
		method: "GET",
		url: "https://",
	};
	loadingTest = false;
	constructor(
		public request: Request,
		public alert: Alert,
		public media: TdMediaService,
	)
	{
	}

	ngOnInit()
	{
	}

	testWebHook()
	{
		this.loadingTest = true;
		this.request.post("/notificationtrackers/testTarget", {
			method: "webhook",
			options: this.targetOptions,
		}).then( response => {
			this.loadingTest = false;

			if(!response.success)
			{
				return this.alert.error(response.message);
			}
			this.alert.success("Webhook request sent.");
		})
	}
}
