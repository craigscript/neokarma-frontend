import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from '../config';
import { WebSocketClient } from "./WebSocket/WebSocketClient";
import { Observable, Subscription } from 'rxjs/Rx';



@Injectable()
export class SocketService
{
	private Socket:WebSocketClient = new WebSocketClient(Config.socketAddress);	

	constructor()
	{
		
	}

	channel(channel): Observable<any>
	{
		return new Observable( observer => {
			let messageListenerFn = (channelin, payload) => {
				if(channelin == channel)
				{
					observer.next(payload);
				}
			};
			
			
			this.Socket.addMessageListener(messageListenerFn);
			this.Socket.subscribe(channel);
			observer.add(() => {
				this.Socket.unsubscribe(channel);
				this.Socket.removeMessageListener(messageListenerFn);
			});
		});
	}

	send(channel, message)
	{
		this.Socket.send(channel, message);
	}
}
