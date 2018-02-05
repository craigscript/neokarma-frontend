import { Component, HostListener, ViewChild, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { TdLoadingService, TdMediaService } from '@covalent/core';
import { MdDialog } from '@angular/material';
import { User, Alert } from "../services/";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
	selector: 'user-layout',
	templateUrl: './user.html',
	styleUrls: ['./user.scss'],
})
export class UserLayout implements OnInit
{
	

	pageLoading: boolean = false;

	@ViewChild("sidenav")
	sidenav;

	// Important Notifications
	Alerts: any[] = [];

	get Notifications()
	{
		return [];
	}

	constructor(
		public media: TdMediaService,
		private changeDetectorRef: ChangeDetectorRef,
		public loadingBar: TdLoadingService,
		public router: Router,
		public user: User,
		public alert: Alert,
		public toastr: ToastsManager,
		public vcr: ViewContainerRef,
		public dialog: MdDialog,
	)
	{
		//this.preventCloseApp();
		this.toastr.setRootViewContainerRef(vcr);
		//this.toastr.success('Welcome to neokarma!');
	}

	ngAfterViewInit()
	{
		this.media.broadcast();
		this.changeDetectorRef.detectChanges();
	}

	ngOnInit(): void
	{
		this.router.events.subscribe( event => {
			if (event instanceof NavigationStart)
			{
				this.pageLoading = true;
			}
			if (event instanceof NavigationEnd || event instanceof NavigationCancel)
			{
				this.pageLoading = false;
			}
		});


	}

	closeNav()
	{
		!this.media.query('gt-sm') && this.sidenav.close();
	}

	toggleLoading()
	{
		this.pageLoading = !this.pageLoading;
	}

	logOut()
	{
		let confirmDialog = this.alert.confirm("Confirm log out", "Are you sure you want to log out?");

		confirmDialog.afterClosed().subscribe( result => {
			if(!result)
				return;
			this.closeNav();

			this.user.logOut();
			this.router.navigateByUrl("/auth/login");

		});
	}

	// checkAlerts()
	// {
	// 	if(!this.user.UserData.emailVerified)
	// 	{
	// 		let message = {
	// 			message: "Your email address is not verified. Please verify your email address."
	// 		}
	// 		this.Alerts.push(message);
	// 	}
	// 	if(!this.user.UserData.accountVerified)
	// 	{
	// 		let message = {
	// 			message: "Your account is not verified. Please verify your account."
	// 		}
	// 		this.Alerts.push(message);
	// 	}
	// }

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
}
