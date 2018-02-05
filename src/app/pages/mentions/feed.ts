import { Component, OnInit, OnDestroy, Input, ViewChild, HostListener, ElementRef, Renderer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TdLoadingService, TdMediaService } from "@covalent/core";
import { Request, Alert} from "../../services/";
import { MentionsFeedList } from "./feed-list";
//import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
	selector: 'neo-mentions-feed',
	templateUrl: './feed.html',
	styleUrls: ['./feed.scss'],
})
export class MentionsFeedPage implements OnInit, OnDestroy
{
	Trackers: any [] = [];
	FilterTracker: any = {};
	FilterWord: string = null;
	FilterSource: string = null;
	SourceType: string = null;
	EndDate = new Date(Date.now() + (3600 * 12 * 1000) );
	StartDate = new Date(Date.now() - (3600 * 12 * 1000) );

	scrollListener: Function = null;
	scoreRange: any [];
	scoreRangeConfig: object;

	Sources: any [] = [
		{
			name: "All",
			value: null,
		},
		{
			name: "Reddit",
			value: "reddit"
		},
		{
			name: "Twitter",
			value: "twitter",
		},
		{
			name: "Facebook",
			value: "facebook",
		}
	];

	Categories: any[] = [
		{
			name: "All",
			value: null,
		},
		{
			name: "Title",
			value: "title",
		},
		{
			name: "Content",
			value: "content",
		},
		{
			name: "URL",
			value: "url",
		},
	];

	@ViewChild(MentionsFeedList)
	feedList: MentionsFeedList;

	@ViewChild('infinityScrollPoint')
	infinityScrollPoint;

	constructor(
		public titleService: Title,
		private el:ElementRef,
		public request: Request,
		public alert: Alert,
		public renderer: Renderer,
		public media: TdMediaService,
		//public toastr: ToastsManager
	)
	{

	}

	ngOnInit()
	{
		this.titleService.setTitle( 'Mentions Feed' );
		this.scoreRangeSlider(-10, 10);

		// add scroll listener
		const scrolableElement = document.querySelector('.main');
		this.scrollListener = this.renderer.listen(scrolableElement, 'scroll', () => {
		 	this.infinityScroll();
		});

		this.getTrackers();
	}

	ngOnDestroy()
	{
		if(!this.scrollListener)
			return;
		// remove scroll listener
		this.scrollListener();
	}

	startDateChanged($event)
	{
		this.StartDate = $event;
		this.applyFilters();
	}

	endDateChanged($event)
	{
		this.EndDate = $event;
		this.applyFilters();
	}

	applyFilters()
	{
		this.feedList.clearFeed();
		this.feedList.getFeed(0, this.createFilters());
	}

	createFilters()
	{
		return {
			tracker: this.FilterTracker._id,
			title: this.FilterWord,
			date: {
				start: this.StartDate.getTime() || null,
				end: this.EndDate.getTime() || null,
			},
			sentiment: {
				start: this.scoreRange[0],
				end: this.scoreRange[1],
			},
			source: this.FilterSource,
			category: this.SourceType,
		};
	}

	getTrackers()
	{
		this.request.get("/mentions/getTrackers").then( response => {
			if (!response.success)
				return this.alert.error(response.message);

			this.Trackers = [{
				_id: null,
				name: "All",
			}];
			Array.prototype.push.apply(this.Trackers, response.trackers);
		});
	}

	infinityScroll()
	{
		if(this.feedList.loadingFeed || this.feedList.NoMore)
			return;

		let rect = this.infinityScrollPoint.nativeElement.getBoundingClientRect();
		let top = rect.top;
		let height = window.innerHeight;
		if((height - top) > -100)
		{
			this.feedList.loadMore();
		}
	}

	toggleFilters(el)
	{
		el.classList.toggle("active");
	}

	scoreRangeSlider(min, max)
	{
		this.scoreRange = [min, max];
		this.scoreRangeConfig = {
			behaviour: 'tap-drag',
			connect: true,
			tooltips: true,
			step: 0.1,
			range: {
				min: min,
				max: max
			},
		};
	}
}
