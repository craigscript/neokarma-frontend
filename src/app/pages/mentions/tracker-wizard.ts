import { Component, OnInit, Input, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdLoadingService, TdMediaService, StepState, StepMode } from "@covalent/core";
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from "@angular/router";
import { MentionRedditSourceDialog, MentionTwitterSourceDialog } from "./dialogs";
import { Request, Alert, User } from "../../services/";

// Include JS Choices in content
declare var Choices: any;

@Component({
	templateUrl: './tracker-wizard.html',
	styleUrls: ['./tracker-wizard.scss'],
})
export class MentionsTrackerWizardPage implements OnInit, AfterViewInit
{
	loadingTracker: boolean = false;
	SourceMap: any = {
		reddit: MentionRedditSourceDialog,
		twitter: MentionTwitterSourceDialog,
	};
	Sources: any[] = [];
	Tracker: any = {};
	TrackerId = null;
	keywords: any = {
		required: "",
		optional: "",
		ignored: "",
	}

	trackingStepActive = true;


	constructor(
		public titleService: Title,
		public media: TdMediaService,
		private el:ElementRef,
		public request: Request,
		public alert: Alert,
		public user: User,
		public dialog: MdDialog,
		public route: ActivatedRoute
	)
	{

	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Mentions Trackers & Words' );
		this.route.params.subscribe((params) => {
			if (params.trackerId)
			{
				this.TrackerId = params.trackerId;
				this.getTracker(params.trackerId);
			}
		});
	}

	initChoices()
	{
		const choices = new Choices('.js-choices', {
			removeItemButton: true,
			editItems: true,
			addItems: true,
			duplicateItems: true,
		});
	}

	ngAfterViewInit() {
		// for create route
		if (!this.TrackerId)
		{
			this.initChoices();
		}
	}

	getSources()
	{
		this.loadingTracker = true;
		this.request.get("/mentions/getSources/" + this.Tracker._id).then( response => {
			this.loadingTracker = false;
			if (!response.success)
			{
				return this.alert.error(response.message);
			}
			this.Sources = response.sources;

			this.initChoices();
		});
	}

	getTracker(trackerId)
	{
		this.loadingTracker = true;
		this.request.get("/mentions/getTracker/" + trackerId).then( response => {
			this.loadingTracker = false;
			if (!response.success)
			{
				return this.alert.error(response.message);
			}

			this.Tracker = response.tracker;

			this.keywords.required = this.Tracker.tracking.required.join(",");
			this.keywords.optional = this.Tracker.tracking.optional.join(",");
			this.keywords.ignored = this.Tracker.tracking.ignored.join(",");

			this.getSources();
		});
	}

	editSource(source)
	{
		let dialogRef = this.dialog.open(this.SourceMap[source.type], {
			data: {
				source: Object.assign({}, source)
			}
		});

		dialogRef.afterClosed().subscribe( updatedSource => {
			if(!updatedSource)
				return;

			let loading = this.alert.loading("Saving source.");
			this.request.post("/mentions/updateSource/" + source._id, {
				source: updatedSource,
			}).then( response => {
				loading.close();
				if (!response.success)
					return this.alert.error(response.message);

				this.alert.success("Source Saved");
				source.target = updatedSource.target;
				source.options = updatedSource.options;
			})
		});
	}

	deleteSource(source)
	{
		let dialogRef = this.alert.confirm("Confirm Delete", "Are you sure you want to delete this mention source?");

		dialogRef.afterClosed().subscribe(result => {
			if (result)
			{
				let loading = this.alert.loading("Deleting source.");
				this.request.get("/mentions/deleteSource/" + this.Tracker._id + "/" + source._id).then( response => {
					loading.close();
					if(!response.success)
						return this.alert.error(response.message);
					this.alert.success("Source deleted");
					this.Sources.splice(this.Sources.indexOf(source), 1);
				});
			}
		});
	}

	addSource(type)
	{
		let dialogRef = this.dialog.open(this.SourceMap[type], {
			data: {
				target: "",
				options: {},
			},
		});

		dialogRef.afterClosed().subscribe( source => {
			if (!source)
				return;

			if (!source.target || source.target.length <= 0)
			{
				return this.alert.error("No target for source.");
			}

			let loading = this.alert.loading("Creating Source.");
			this.request.post("/mentions/createSource/" + this.Tracker._id, {
				source: source,
				type: type,
			}).then( response => {
				loading.close();
				if (!response.success)
					return this.alert.error(response.message);

				// TODO: Add newly added tracker effect?
				this.alert.success("Source Saved");
				this.Sources.push(response.source);
			})
		});
	}

	saveKeywords(required, optional, ignored)
	{
		this.keywords.required = required;
		this.keywords.optional = optional;
		this.keywords.ignored = ignored;
		this.saveTracker();
	}

	saveTracker(final=false)
	{
		this.Tracker.tracking = {
			required: [],
			optional: [],
			ignored: [],
		};

		this.Tracker.tracking.required = this.keywords.required.split(",").filter((item) => {
			if(!item.length)
				return false;

			return true;
		});
		this.Tracker.tracking.optional = this.keywords.optional.split(",").filter((item) => {
			if(!item.length)
				return false;

			return true;
		});
		this.Tracker.tracking.ignored = this.keywords.ignored.split(",").filter((item) => {
			if(!item.length)
				return false;

			return true;
		});

		if(this.Tracker.tracking.required.length <= 0 && this.Tracker.tracking.optional.length <= 0)
		{
			return this.alert.error("Please specify at least one required or optional keyword!");
		}

		if(!this.TrackerId)
		{
			let loading = this.alert.loading("Creating tracker.");
			this.loadingTracker = true;
			this.request.post("/mentions/createTracker", {
				name: this.Tracker.name,
				tracking: this.Tracker.tracking,
				status: "Active",
			}).then( response => {
				this.loadingTracker = false;
				loading.close();
				if(!response.success)
					return this.alert.error(response.message);

				this.Tracker = response.tracker;
				this.TrackerId = response.tracker._id;
				this.trackingStepActive = false;
				// TODO: Add newly added tracker effect?
				//	this.alert.success("Tracker Saved");
				
			})
		}else{
			let loading = this.alert.loading("Saving tracker.");
			this.request.post("/mentions/updateTracker/" + this.TrackerId, {
				name: this.Tracker.name,
				tracking: this.Tracker.tracking,
				status: "Active",
			}).then( response => {
				loading.close();
				
				if (!response.success)
					return this.alert.error(response.message);
				
				this.trackingStepActive = false;
				if(final)
				{
					loading.afterClosed().subscribe(() => {
						this.alert.success("Tracker Saved");
					});
				}
				
			});
		}
	}

	finishSetup()
	{
		this.saveTracker(true);
	}
}
