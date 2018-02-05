import { Component, HostListener, ViewChild, OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewContainerRef, NgZone } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { Subscription } from "rxjs/Subscription";
import { MdDialog } from '@angular/material';
import { User, Request, Alert, Market } from "../services/";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { TdMediaService } from "@covalent/core";

@Component({
	selector: 'public-layout',
	templateUrl: './public.html',
	styleUrls: ['./public.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicLayout implements OnInit, OnDestroy, AfterViewInit
{
	personalName: string;
	email: string;
	pageLoading: boolean = false;
	
	requiresCaptcha = false;

	marketSearchActive = true;

	@ViewChild("sidenav")
	sidenav;

	ListView = false;
	// Important Notifications
	Alerts: any[] = [];

	get Notifications()
	{
		return [];
	}

	mediaSub: Subscription;
	constructor(
		public media: TdMediaService,
		private changeDetectorRef: ChangeDetectorRef,
		public router: Router,
		public user: User,
		public alert: Alert,
		public toastr: ToastsManager,
		public vcr: ViewContainerRef,
		public dialog: MdDialog,
		public market: Market,
		public request: Request,
		public zone: NgZone,
		
	)
	{
		//	this.changeDetectorRef.detach();
		//	this.preventCloseApp();
		//this.toastr.setRootViewContainerRef(vcr);

		
		// zone.runOutsideAngular(() => {
		// 	media.registerQuery('gt-sm');
		// })
		
		//this.toastr.success('Welcome to neokarma!');
	}


	ngDoCheck()
	{
		console.log("PublicLayout does checking");
	}

	ngOnChanges()
	{
		console.log("PublicLayout has chanes?");
	}

	ngOnInit(): void
	{
		this.router.events.subscribe( event => {
			if(this.router.isActive("/markets", true))
			{
				this.marketSearchActive = true;
			}else{
				this.marketSearchActive = false;
			} 

			if (event instanceof NavigationStart)
			{
				this.pageLoading = true;
			}
			if (event instanceof NavigationEnd || event instanceof NavigationCancel)
			{
				setTimeout(() => {
					this.pageLoading = false;
				}, 250);
			}
		});
	}

	ngAfterViewInit()
	{
		this.media.broadcast();
		this.changeDetectorRef.detectChanges();
	}
	
	ngOnDestroy()
	{
		//this.mediaSub.unsubscribe();
	}

	closeNav()
	{
		return !this.media.query('gt-sm') && this.sidenav.close();
	}

	toggleLoading()
	{
		this.pageLoading = !this.pageLoading;
	}

	preventCloseApp()
	{
		window.onbeforeunload = (event) => {

			let message = "Are you sure?";
			let e = event || window.event;
			if(e)
			{
				e.returnValue = message;
			}
			return message;
		};
	}
	
	addMarket()
	{

	}

	createAlert()
	{

	}
	
	quickSignUp()
	{
		var name = this.personalName.split(" ", 2);
		var personal = {
			firstname: name[0],
			lastname: name[1],
		};

		var loading = this.alert.loading("Registering account...")
		this.request.post("/auth/signUp", {
			personal: personal,
			email: this.email,
			generatePassword: true,
			captcha: null,
		}).then( response => {
			loading.afterClosed().subscribe(() => {
				if(!response.success)
					return this.alert.error(response.message);
				this.alert.success("We've sent you an email to confirm your registration!");
			});
			loading.close();
		});
	}

	logOut()
	{
		let confirmDialog = this.alert.confirm("Confirm log out", "Are you sure you want to log out?");

		confirmDialog.afterClosed().subscribe( result => {
			if(!result)
				return;
			this.closeNav();
			
			this.user.logOut();
			this.router.navigateByUrl("/");

		});
	}

	marketName: string = null;

	searchMarket()
	{
		this.market.search(this.marketName);
		//this.marketSearch.update(this.marketName);
	}

	onSearchKeyDown(event)
	{
		if(event.keyCode == 27)
		{
			this.marketName = "";
			this.market.search(null);
		}

		if(event.keyCode == 13)
		{
			this.searchMarket();
		}
	}

	setMarketViewMode(mode, columnSize)
	{
		this.ListView = mode == 'list';
		this.market.setViewMode(mode, columnSize);
	}
}
