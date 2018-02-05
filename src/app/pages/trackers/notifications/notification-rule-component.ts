import { Component, OnInit, Input, Output, EventEmitter, Directive, ViewContainerRef, ViewChild, ElementRef, ComponentFactoryResolver} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { NotificationRuleMap } from "./rules/rulemap";

export { RuleComponents } from "./rules/rulemap";

@Component({
	selector: "notification-rule-component",
	templateUrl: './notification-rule-component.html',
	styleUrls: ['./notification-rule-component.scss'],
})
export class NotificationRuleComponent
{
	@Input("ruleComponent")
	ruleComponent = "";

	@Input("ruleOptions")
	ruleOptions = "";

	@Input("ruleIcon")
	ruleIcon = "";

	@Input("ruleName")
	ruleName = "";

	@Output("updated")
	updated = new EventEmitter();

	@Output()
	delete = new EventEmitter();

	@ViewChild("ruleComponentView", {read: ViewContainerRef})
	ruleComponentView: ViewContainerRef;

	isActive = true;

	constructor(
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

		let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.rule.component);

		let viewContainerRef = this.ruleComponentView;
		//viewContainerRef.clear();
		let componentRef = this.ruleComponentView.createComponent(componentFactory);
		(<any>componentRef.instance).ruleOptions = this.ruleOptions;
	}

	toggleEdit()
	{
		this.isActive = !this.isActive;
	}

	deleteRule()
	{
		this.delete.emit();
	}

	get rule()
	{
		return NotificationRuleMap[this.ruleComponent];
	}




}
