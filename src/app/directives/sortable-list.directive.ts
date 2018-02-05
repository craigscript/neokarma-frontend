import {
	HostListener, EventEmitter, ElementRef,
	OnInit, Directive, Input, Output, NgZone, ChangeDetectorRef,
	Renderer2, Self
} from '@angular/core';
import { Observable } from 'rxjs';
import { NgModel } from '@angular/forms';

@Directive({
	selector: "[sortable-item]",
})
export class SortableItemDirective
{
	constructor(
		private hostItem: ElementRef,
		public renderer: Renderer2,
	)
	{
		this.renderer.addClass(this.hostItem.nativeElement, "sortable-item");
		this.renderer.setAttribute(this.hostItem.nativeElement, "draggable", "true");
	}
}

@Directive({
	selector: "[sortable-list]",
})
export class SortableListDirective
{
	@Input("animSpeed")
	public animationSpeed = 100;

	@Input("repositionDelay")
	public repositionDelay = 10;

	@Input("dragDelay")
	public dragDelay = 0;

	@Input("dragTouchDelay")
	public dragTouchDelay = 200;

	// Triggered when the list is updated
	@Output("sort-updated")
	public onUpdated = new EventEmitter();

	@Input("disabledElements")
	public disabledElements = ["button-card"];

	@Input("disabledTags")
	disabledTags = ["button", "input", "a", "textarea"];


	private dragTimer = null;
	private dragTouchTimer = null;
	private emulatedDragElement = null;
	private draggedElement = null;
	private dragOffset = {x:0, y:0};

	private dragEnabled = false;
	constructor(
		private sortingList: ElementRef,
		public zone: NgZone,
		public renderer: Renderer2,
		public changedetector: ChangeDetectorRef,
	)
	{
		//this.changedetector.detach();
	}
	
	ngOnChanges(changes)
	{
		console.log("SortableListDirective Change detector is running?", changes);
	}

	@HostListener('dragover', ['$event'])
	onDragOver(e: DragEvent)
	{	
		e.preventDefault();
		e.stopPropagation();

		this.zone.runOutsideAngular(() => {
			if(this.dragEnabled)
			{
				var element = document.elementFromPoint(e.clientX, e.clientY);
				if(!element)
					return;

				var sortableElement = this.getSortableElement(element);
				
				if(!sortableElement)
					return;

				if(!this.isSortable(sortableElement))
					return;
				
				this.repositionItem(sortableElement, this.draggedElement);
				//this.scrollEdge(e.clientX, e.clientY);
			}
		});
	}

	@HostListener("dragenter", ['$event'])
	onDragEnter(e)
	{
		e.preventDefault();
	}

	@HostListener("selectstart", ['$event'])
	onSelectStart(e)
	{
		e.preventDefault();
	}


	@HostListener('dragstart', ['$event'])
	onDragStart(e)
	{	
		this.changedetector.detach();
		if(this.touchDragReady)
		{
			e.preventDefault();
			return;
		}
		
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("Text", e.target.textContent);
		this.dragEnabled = true;
		this.draggedElement = e.target;
	}

	touchDragReady = false;
	@HostListener('drop', ['$event'])	
	@HostListener('dragend', ['$event'])
	onDragend(e: DragEvent)
	{	
		this.changedetector.reattach();
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		this.zone.runOutsideAngular(() => {
			this.dragEnabled = false;
			this.draggedElement = null;
			this.stopEmulatedDrag();
		});
	}
	
	@HostListener('touchstart', ['$event'])
	touchStart(e)
	{
	
		this.touchDragReady = true;
		this.zone.runOutsideAngular(() => {
			this.stopEmulatedDrag();
			clearTimeout(this.dragTouchTimer);
			this.dragTouchTimer = setTimeout(() => {
				this.startEmulatedDrag(e.target, e.touches[0].clientX, e.touches[0].clientY);
				this.updateDrag(e.touches[0].clientX, e.touches[0].clientY);
				this.dragTouchTimer = null;
			}, this.dragTouchDelay)
		});
	}
	
	@HostListener('touchend', ['$event'])
	touchEnd(e)
	{
		this.changedetector.detach();
		this.touchDragReady = false;
		this.zone.runOutsideAngular(() => {
			if(this.dragTouchTimer)
			{
				clearTimeout(this.dragTouchTimer);
				this.dragTouchTimer = null;
			}
			this.stopEmulatedDrag();
		});
	}
	
	@HostListener('touchmove', ['$event'])
	touchMove(e: TouchEvent)
	{
		this.zone.runOutsideAngular(() => {
			if(this.emulatedDragElement)
			{
				e.preventDefault();
				return this.updateDrag(e.touches[0].clientX, e.touches[0].clientY);
			}

			if(this.dragTouchTimer)
			{
				clearTimeout(this.dragTouchTimer);
				this.dragTouchTimer = null;
			}
		});
	}

	startEmulatedDrag(element, x, y)
	{
		if(!element)
			return;
		
	//	this.changedetector.detach();
		var sortableElement = this.getSortableElement(element);
		
		if(!sortableElement)
			return;

		if(!this.isSortable(sortableElement))
			return;
		
		var scroll = this.getScrollBasis();
		var rect = sortableElement.getBoundingClientRect();
		
		this.dragOffset.x = x - rect.left;
		this.dragOffset.y = y - rect.top;
		
		this.emulatedDragElement = sortableElement.cloneNode(true);
		this.draggedElement = sortableElement; // Element that needs to be repositioned
		
		this.emulatedDragElement.classList.add("sortable-item-clone");
		this.draggedElement.classList.add("sortable-item-dragged");
		this.emulatedDragElement.style.position = "fixed";
		this.sortingList.nativeElement.appendChild(this.emulatedDragElement);
	}

	stopEmulatedDrag()
	{
		if(!this.emulatedDragElement)
			return;
		
		//this.changedetector.reattach();
		this.draggedElement.classList.remove("sortable-item-dragged");
		this.sortingList.nativeElement.removeChild(this.emulatedDragElement);
		
		this.emulatedDragElement = null;
		this.draggedElement = null;

		clearInterval(this.scrollTimer);
		this.scrollTimer = null;

		clearTimeout(this.repositionTimer);
		this.repositionTimer = null;
	}

	updateDrag(x, y)
	{
		if(!this.emulatedDragElement)
			return;

		var scroll = this.getScrollBasis();

		var rect = this.sortingList.nativeElement.getBoundingClientRect();

		var left = x - this.dragOffset.x - rect.left - scroll.x;
		var top = y - this.dragOffset.y - rect.top - scroll.y;
	
		this.emulatedDragElement.style.transform = "translate(" + (left)  + "px, " + (top) + "px)"
		// this.emulatedDragElement.style.top = (top) + "px";
		// this.emulatedDragElement.style.left = (left) + "px";

		
		var element = document.elementFromPoint(x, y);
		if(!element)
			return;

		var sortableElement = this.getSortableElement(element);
		
		if(!sortableElement)
			return;

		if(!this.isSortable(sortableElement))
			return;
		
		this.repositionItem(sortableElement, this.draggedElement);
		this.scrollEdge(x, y);
	}

	updateList(oldIndex, newIndex)
	{
		this.onUpdated.emit({
			oldIndex: oldIndex,
			newIndex: newIndex,
		});
		
		
		
	}

	repositionTimer = null;
	repositionElement = null;
	repositionItem(replaceElement, withElement)
	{
		
		if(replaceElement == withElement)
			return;
		
		if(this.animTimer)
			return;

		if(this.repositionElement != replaceElement)
		{
			clearTimeout(this.repositionTimer);
			console.log("respositioning element");
			this.repositionTimer = setTimeout(() => {
			
				var previousRect = withElement.getBoundingClientRect();
				var newRect = withElement.getBoundingClientRect();

				var oldIndex = this.getChildIndex(withElement);
				
				// Switch positions based on order
				var position = withElement.compareDocumentPosition(replaceElement);
				if(position & 0x04)
				{
					replaceElement.parentNode.insertBefore(withElement, replaceElement.nextSibling);
				}
				if(position & 0x02)
				{
					
					replaceElement.parentNode.insertBefore(withElement, replaceElement);
					
				}
				
				this.animatePosition(previousRect, withElement);
				this.animatePosition(newRect, replaceElement);
				
				var newIndex = this.getChildIndex(withElement);
				
				this.updateList(oldIndex, newIndex);
				
				this.repositionElement = null;
			}, this.repositionDelay);
		}
		this.repositionElement = replaceElement;
	}

	animTimer = null;
	animPrevTransition = null;
	animatePosition(previousRect, targetElement: HTMLElement)
	{
		var currentRect = targetElement.getBoundingClientRect();
		
		if(!this.animPrevTransition)
		{
			this.animPrevTransition = targetElement.style.transition;
		}
		targetElement.style.transition = "none";
		targetElement.style.transform = 'translate3d('+ (previousRect.left - currentRect.left) + 'px,' + (previousRect.top - currentRect.top) + 'px, 0)';

		targetElement.offsetWidth;

		targetElement.style.transition = "all " + this.animationSpeed + "ms";
		targetElement.style.transform = 'translate3d(0, 0, 0)';

		if(this.emulatedDragElement)
			this.emulatedDragElement.style.transition = "none";
		
		clearTimeout(this.animTimer);
		this.animTimer = setTimeout(() => {
			targetElement.style.transform = '';
			targetElement.style.transition = this.animPrevTransition;
			this.animTimer = null;
			this.animPrevTransition = null;
		}, this.animationSpeed);
	}

	getSortableElement(element)
	{
		if(element.nodeType !== Node.ELEMENT_NODE)
			return null;

		
		if(this.disabledElements.find(item => {
			if(element.classList.contains(item))
				return true;
			return false;
		})) return null;


		if(this.disabledTags.indexOf(element.tagName.toLowerCase()) >= 0)
			return null;

		// if the element is the same as the container then return null
		if(element == this.sortingList.nativeElement)
			return null;
		
		// Traverse up the HTML Tree and find the element containing the item
		var rootElement = element;
		while(rootElement)
		{
			if(rootElement.parentElement == this.sortingList.nativeElement)
			{
				return rootElement;
			}
			rootElement = rootElement.parentElement;
		}
		return null;
	}

	isSortable(element: Element)
	{
		if(!element)
			return false;

		if(element.parentElement == this.sortingList.nativeElement)
			return true;
		return false;
	}

	getChildIndex(element: HTMLElement)
	{
		// element is not the sortable element
		if(element.parentNode != this.sortingList.nativeElement)
			return -1;

		var children = this.sortingList.nativeElement.children;
		for(var i=0;i<children.length;++i)
		{
			if(children[i] == element)
			{
				return i;
			}
		}
		return -1;
	}

	getScrollBasis()
	{
		var scrollable = this.getScrollElement();
		return { x: scrollable.scrollLeft, y: scrollable.scrollTop };
		//return {x:0, y: 0};
		//return {x: window.pageXOffset || document.documentElement.scrollLeft, y: window.pageYOffset || document.documentElement.scrollTop};

	}

	getScrollElement()
	{
		let scrollElement = this.sortingList.nativeElement;
		do
		{
			if(scrollElement.scrollHeight == 0)
				continue;
				
			if(scrollElement.scrollHeight > scrollElement.clientHeight)
			{
				return scrollElement;
			}

		} while (scrollElement = scrollElement.parentNode);
		return window;
	}

	@Input("scroll-sensitivity")
	scrollSensitivity = 10;

	@Input("scroll-distance")
	scrollDistance = 150;

	@Input("scroll-speed")
	scrollSpeed = 10;

	scrollTimer = null;
	scrollEdge(x:any, y:any)
	{
		clearInterval(this.scrollTimer);
		this.scrollTimer = null;
		if(this.draggedElement)
		{
			
			
			var scrollElement = this.getScrollElement();
			if(!scrollElement)
				return;
			
				
			var scrollX = 0;
			var scrollY = 0;
			
			if(scrollElement == window)
			{
				if(y > window.innerHeight - this.scrollDistance)
				{
					scrollY += this.scrollSensitivity;
				}
				
				if(y < this.scrollDistance)
				{
					scrollY -= this.scrollSensitivity;
				}

				if(x > window.innerWidth - this.scrollDistance)
				{
					scrollX += this.scrollSensitivity;
				}
				
				if(x < this.scrollDistance)
				{
					scrollX -= this.scrollSensitivity;
				}

				return;
			}else{
				let rect:any = scrollElement.getBoundingClientRect();
		
				if(y > rect.bottom - this.scrollDistance)
				{
					scrollY += this.scrollSensitivity;
				}
				
				if(y < rect.top + this.scrollDistance)
				{
					scrollY -= this.scrollSensitivity;
				}

				if(x > rect.right - this.scrollDistance)
				{
					scrollX += this.scrollSensitivity;
				}
				
				if(x < rect.left + this.scrollDistance)
				{
					scrollX -= this.scrollSensitivity;
				}
			}

			
			this.scrollElement(scrollElement, scrollX, scrollY);
			if(!this.scrollTimer && (scrollX != 0 || scrollY != 0))
			{
				this.scrollTimer = setInterval(() => {
					this.scrollElement(scrollElement, scrollX, scrollY);
				}, this.scrollSpeed);
			}
			


		}
	}

	scrollElement(element, x, y)
	{
		element.scrollTop += y;
		element.scrollLeft += x;
	}

}