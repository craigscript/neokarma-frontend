import { Component, Injectable, Inject } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'alert-dialog',
	template: `
		<h2 md-dialog-title>{{Title}}</h2>
		<md-dialog-content>{{Message}}</md-dialog-content>
		<md-dialog-actions class="mt-20">
			<button md-raised-button md-dialog-close>Ok</button>
		</md-dialog-actions>
	`,
})
export class AlertDialog {
	Title: string = "";
	Message: string = "";

	constructor(@Inject(MD_DIALOG_DATA) public data: any)
	{
		this.Title = data.title;
		this.Message = data.message;
	}
}

@Component({
	selector: 'loading-dialog',
	template: `
		<p>
			<i class="fa fa-circle-o-notch fa-spin fa-fw"></i>
			{{Message}}
		</p>
	`,
})
export class LoadingDialog {
	Message: string = "Loading...";

	constructor(@Inject(MD_DIALOG_DATA) public data: any)
	{
		this.Message = data.message;
	}
}

@Component({
	selector: 'confirmation-dialog',
	template: `
		<h3>{{title}}</h3>
		<md-dialog-content style="min-width: 280px; margin-bottom: 20px;">{{message}}</md-dialog-content>
		<md-dialog-actions layout="row" layout-align="space-around">
			<button md-raised-button color="warn" (click)="dialogRef.close(true)">Yes</button>
			<button md-raised-button color="primary" (click)="dialogRef.close(false)">No</button>
		</md-dialog-actions>
	`,
})
export class ConfirmationDialog {
	title: string = "Confirm";
	message: string;

	constructor(@Inject(MD_DIALOG_DATA) public data: any, public dialogRef: MdDialogRef<ConfirmationDialog>)
	{
		this.title = data.title;
		this.message = data.message;
	}
}

@Injectable()
export class Alert {

	constructor(public Dialog: MdDialog)
	{

	}

	error(message, title="Error")
	{
		this.open(title, message);
	}

	success(message)
	{
		this.open("Success", message);
	}

	info(message)
	{
		this.open("Note", message);
	}

	open(title, message): MdDialogRef<AlertDialog>
	{
		return this.Dialog.open(AlertDialog, {
			data: {
				title: title,
				message: message,
			}
		});
	}

	confirm(title, message)
	{
		return this.Dialog.open(ConfirmationDialog, {
			data: {
				title: title,
				message: message,
			}
		});
	}

	loading(message="Loading..."): MdDialogRef<LoadingDialog>
	{
		return this.Dialog.open(LoadingDialog, {
			data: {
				message: message,
			}
		});
	}
}
