import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Request, Alert } from "../../../services/";

@Component({
	selector: 'change-password-dialog',
	templateUrl: './change-password.dialog.html',
})
export class ChangePasswordDialog
{
	newPassword: string;
	confirmPassword: string;

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService, dialog: MdDialog,
		public dialogRef: MdDialogRef<ChangePasswordDialog>,
		public request: Request,
		public alert: Alert,
	)
	{

	}

	submit()
	{
		let loading = this.alert.loading("Updating password.");

		this.request.post("/user/password", {
			password: this.newPassword
		}).then( response =>
			{
				loading.close();
				if (!response.success)
				{
					this.alert.error(response.message);
				} else {
					this.alert.success("Password has been changed.");
					this.dialogRef.close();
				}
			});
		}
	}
