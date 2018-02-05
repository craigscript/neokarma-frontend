import { Component, ElementRef, ViewChild, Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

// (mousedown)="mouseDown($event)" (mouseup)="mouseUp($event)" (mousemove)="moueMove($event)"
// (touchstart)="touchStart($event)" (touchend)="touchEnd($event)" (touchmove)="touchMove($event)"
@Directive({
	selector: "[sortable-list]",
	
	
})
export class SortableListDirective
{
	@Input("sortable-list")
	public items: any[] | any; // Array of items to sort

	@Input("animSpeed")
	public animationSpeed = 100;

	@Input("dragDelay")
	public dragDelay = 100;

	@Input("dragTouchDelay")
	public dragTouchDelay = 100;

	// Triggered when a drag operation started
	@Output("DragStart")
	public onDragStart = new EventEmitter();

	// Triggered when a drag operation ended
	@Output("DragEnd")
	public onDragEnd = new EventEmitter();

	// Triggered when the list is updated
	@Output("updated")
	public onUpdated = new EventEmitter();

	private dragTimer = null;
	private dragTouchTimer = null;
	private draggingElement = null;
	private draggedElement = null;
	private dragPosition = {x:0, y:0};

	constructor(
		private sortingList: ElementRef,
	)
	{
	}

	// @HostListener('mouseout', ['$event'])
	// mouseOut(e)
	// {
	// 	if(e.target != this.sortingList.nativeElement)
	// 		return;
		
	// 	this.stopDrag();
	// }

	@HostListener('mousedown', ['$event'])
	mouseDown(e)
	{	

		e.preventDefault();
		this.stopDrag();
		this.startDrag(e.target, e.target.offsetLeft - e.clientX, e.target.offsetTop - e.clientY);

		return this.updateDrag(e.pageX, e.pageY);
	}
	
	@HostListener('mouseup', ['$event'])
	mouseUp(e: MouseEvent)
	{
		e.preventDefault();
		this.stopDrag();
	}

	@HostListener('mousemove', ['$event'])
	mouseMove(e: MouseEvent)
	{
		if(this.draggingElement)
		{
			return this.updateDrag(e.pageX, e.pageY);
		}
	}

	@HostListener('touchstart', ['$event'])
	touchStart(e)
	{
		this.stopDrag();
		clearTimeout(this.dragTouchTimer);
		this.dragTouchTimer = setTimeout(() => {
			console.log(" e.target.offsetLeft");
			this.startDrag(e.target, e.target.offsetLeft - e.touches[0].clientX, e.target.offsetTop - e.touches[0].clientY);
			this.updateDrag(e.touches[0].pageX, e.touches[0].pageY);
		}, this.dragTouchDelay)
		console.log("touchStart:", e);
	}
	
	@HostListener('touchend', ['$event'])
	touchEnd(e)
	{
		if(this.dragTouchTimer)
		{
			clearTimeout(this.dragTouchTimer);
			this.dragTouchTimer = null;
		}
		this.stopDrag();
	}
	
	@HostListener('touchmove', ['$event'])
	touchMove(e: TouchEvent)
	{
		if(this.draggingElement)
		{
			e.preventDefault();
			return this.updateDrag(e.touches[0].pageX, e.touches[0].pageY);
		}

		if(this.dragTouchTimer)
		{
			clearTimeout(this.dragTouchTimer);
			this.dragTouchTimer = null;
		}

		
	}

	startDrag(element, x, y)
	{
		if(!element)
			return;
		
		console.log("element.parentNode != this.sortingList.nativeElement", element.parentNode == this.sortingList.nativeElement);
		if(element.parentNode != this.sortingList.nativeElement)
			return;
		
		this.dragPosition.x = x - window.scrollX;
		this.dragPosition.y = y - window.scrollY;
		this.draggingElement = element.cloneNode(true);
		this.draggedElement = element; // Element that needs to be repositioned
		
		this.draggingElement.classList.add("sortable-item-clone");
		this.draggedElement.classList.add("sortable-item-dragged");
		
		this.sortingList.nativeElement.appendChild(this.draggingElement);
	}

	stopDrag()
	{
		if(!this.draggingElement)
			return;
		
		this.draggedElement.classList.remove("sortable-item-dragged");
		this.sortingList.nativeElement.removeChild(this.draggingElement);
	
		
		this.draggingElement = null;
		this.draggedElement = null;

		clearTimeout(this.repositionTimer);
		this.repositionTimer = null;

	}

	updateDrag(x, y)
	{
		console.log("x:", x, "y:", y);
		var top = y + this.dragPosition.y;
		var left = x + this.dragPosition.x;
		this.draggingElement.style.top = top + "px";
		this.draggingElement.style.left = left + "px";
		
		var element = document.elementFromPoint(x - window.scrollX, y - window.scrollY);
		if(!element)
			return;
		
		if(element.parentNode != this.sortingList.nativeElement)
			return;

		this.repositionItem(element, this.draggedElement);

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
			this.repositionTimer = setTimeout(() => {
			
				var previousRect = withElement.getBoundingClientRect();
				var newRect = replaceElement.getBoundingClientRect();
				// Switch positions based on order
				var position = withElement.compareDocumentPosition(replaceElement);
				if(position & 0x04)
				{
					console.log("replaceElement:", replaceElement.id, "dragging", this.draggingElement.id);
					//this.animatePosition(withElement.getBoundingClientRect(), replaceElement);
				//	this.animatePosition(withElement, replaceElement.nextSibling);
					replaceElement.parentNode.insertBefore(withElement, replaceElement.nextSibling);
					
				}
				if(position & 0x02)
				{
					
					replaceElement.parentNode.insertBefore(withElement, replaceElement);
					
				}
				this.animatePosition(previousRect, withElement);
				this.animatePosition(newRect, replaceElement);
				var newIndex = this.getChildIndex(withElement);
			//	this.animatePosition(withElement, replaceElement);
				
				this.repositionElement = null;
			
	
			}, 100);
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

		this.draggingElement.style.transition = "none";
		
		clearTimeout(this.animTimer);
		this.animTimer = setTimeout(() => {
			targetElement.style.transform = '';
			targetElement.style.transition = this.animPrevTransition;
			this.animTimer = null;
			this.animPrevTransition = null;
		}, this.animationSpeed);
		//animatingElement.clientTop
	}

	getChildIndex(element: HTMLElement)
	{
		return -1;
	}
		

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
	letters = [
		"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
	];

}
