import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdMediaService } from "@covalent/core";
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Request, Alert } from "../../../services/";

@Component({
	selector: 'user-update-personal-dialog',
	templateUrl: './update-personal.dialog.html',
})
export class UserUpdatePersonalDialog
{
	personal: any;

	constructor(
		@Inject(MD_DIALOG_DATA)
		public data: any,
		public media: TdMediaService, dialog: MdDialog,
		public dialogRef: MdDialogRef<UserUpdatePersonalDialog>,
		public request: Request,
		public alert: Alert,
	)
	{
		this.personal = Object.assign({}, data);
	}

	savePersonal()
	{
		let loading = this.alert.loading("Saving personal information");

		this.request.post("/user/personal", {
			personal: {
				firstname: this.personal.firstname,
				lastname: this.personal.lastname
			}
		}).then( response => {
			loading.close();
			if (!response.success)
			{
				this.alert.error(response.message);
			}
			else
			{
				this.dialogRef.close(this.personal);
				this.alert.success("Personal information has been saved.");
			}
		});
	}
}
