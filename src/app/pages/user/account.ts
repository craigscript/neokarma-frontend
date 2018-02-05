import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MdDialog } from '@angular/material';
import { Request, Alert, User } from "../../services";
import { ChangePasswordDialog, UserUpdatePersonalDialog, ChangeEmailDialog } from "./dialogs";

@Component({
	selector: 'neo-user-account',
	templateUrl: './account.html',
	styleUrls: ['./account.scss'],
})
export class UserAccountPage implements OnInit
{
	loadingPayments = true;
	payments: any[] = [];

	constructor(
		private title: Title,
		public request: Request,
		public dialog: MdDialog,
		public alert: Alert,
		public user: User
	)
	{

	}

	ngOnInit()
	{
		this.title.setTitle( 'User Account' );
		this.getPayments();
	}

	changePassword()
	{
		this.dialog.open(ChangePasswordDialog);
	}

	changeEmail()
	{
		this.dialog.open(ChangeEmailDialog, {
			data: {
				email: this.user.UserData.email
			}
		});
	}

	updatePersonal()
	{
		let dialogRef = this.dialog.open(UserUpdatePersonalDialog, {
			data: this.user.Personal
		});

		dialogRef.afterClosed().subscribe((personal) => {
			if(personal)
			{
				this.user.UpdateUserData();
			}
		});
	}

	getPayments()
	{
		this.loadingPayments = true;
		this.request.get("/subscription/getPayments").then( response => {
			this.loadingPayments = false;
			if(!response.success)
				return this.alert.error(response.message);

			this.payments = response.payments;
		});
	}
}
