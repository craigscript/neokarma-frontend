import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Request, Alert } from "../../../services";

@Component({
	templateUrl: './change-email.dialog.html',
})
export class ChangeEmailDialog
{
	email: string;

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService, dialog: MdDialog,
		public dialogRef: MdDialogRef<ChangeEmailDialog>,
		public request: Request,
		public alert: Alert,
	)
	{
		this.email = data.email;
	}

	saveEmail()
	{
		let loading = this.alert.loading("Updating Email Address");

		this.request.post("/user/email", {
			email: this.email
		}).then( response =>
			{
				loading.close();
				if (!response.success)
				{
					this.alert.error(response.message);
				} else {
					this.dialogRef.close(this.email);
					this.alert.success("Email address has been change.");
				}
			});
		}
	}
