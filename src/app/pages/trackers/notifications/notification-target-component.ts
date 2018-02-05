import { Component, OnInit, Input, Output, EventEmitter, Directive, ViewContainerRef, ViewChild, ElementRef, ComponentFactoryResolver} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { NotificationTargetMap } from "./targets/targetmap";

export { TargetComponents } from "./targets/targetmap";

@Component({
	selector: "notification-target-component",
	templateUrl: './notification-target-component.html',
	styleUrls: ['./notification-target-component.scss'],
})
export class NotificationTargetComponent
{
	@Input("targetComponent")
	targetComponent = "";

	@Input("targetOptions")
	targetOptions = "";

	@Output("updated")
	updated = new EventEmitter();

	@Output()
	delete = new EventEmitter();

	@ViewChild("targetComponentView", {read: ViewContainerRef})
	targetComponentView: ViewContainerRef;

	isActive = true;

	constructor(
		public media: TdMediaService,
		private componentFactoryResolver: ComponentFactoryResolver
	)
	{

	}

	ngOnInit()
	{
		this.createComponent();
	}

	createComponent()
	{

		let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.target.component);

		let componentRef = this.targetComponentView.createComponent(componentFactory);
		(<any>componentRef.instance).targetOptions = this.targetOptions;
	}

	toggleEdit()
	{
		this.isActive = !this.isActive;
	}

	deleteTarget()
	{
		this.delete.emit();
	}

	get target()
	{
		return NotificationTargetMap[this.targetComponent];
	}




}
