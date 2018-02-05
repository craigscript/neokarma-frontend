import { Observable, Observer } from "rxjs";

export class WebSocketClient
{
	remoteAddress = null;

	public isConnected:boolean = false;

	private forceDisconnect: boolean = false;

	private Socket: WebSocket;

	private subscribedchannels = [];

	private MessageListeners = [];

	private messageBuffer = [];

	constructor(remoteAddress)
	{
		this.remoteAddress = remoteAddress;
		this.connect();
	}

	connect()
	{
		console.log("[WebSocket] Connecting to:", this.remoteAddress)
		this.Socket = new WebSocket(this.remoteAddress);
		this.Socket.onopen = () => {
			console.log("[WebSocket] Connected");
			this.connected();
		}

		this.Socket.onmessage = (data) => {
			this.handleMessage(data);
		};

		this.Socket.onclose = () => {
			this.Socket = null;
			this.disconnected();
		};
		this.Socket.onerror = (error) => {
			console.log("[WebSocket] Error:", error);
		};
	}

	private connected()
	{
		this.isConnected = true;
		for(var channel of this.subscribedchannels)
		{
			this.send("subscribe", {
				channelName: channel
			});
		}
	}

	disconnect()
	{
		this.forceDisconnect = true;
		this.Socket.close();
	}

	private disconnected()
	{
		console.log("[WebSocket] Disconnected");
		this.isConnected = false;
		if(this.forceDisconnect)
			return;
		
		setTimeout(() => {
			this.connect();
		}, 5000);
	}

	handleMessage(data)
	{
		try{
			var packet = JSON.parse(data);
			if(!packet.channel)
				return false;
			if(!packet.payload)
				return false;

			for(var listener of this.MessageListeners)
			{
				listener(packet.channel, packet.payload);
			}
		}catch( error )
		{
			console.log("[WebSocket] Packet Error:", error);
		}
		return false;
	}

	addMessageListener(callback)
	{
		this.MessageListeners.push(callback);
	}

	removeMessageListener(callback)
	{
		this.MessageListeners.splice(this.MessageListeners.indexOf(callback), 1);
	}

	send(channel: string, payload:any)
	{
		if(this.forceDisconnect)
			return;

		var message = JSON.stringify({
			channel: channel,
			payload: payload
		});

		if(!this.isConnected)
		{
			//this.messageBuffer.push(message);
			console.log("[WebSocket] Error: Trying to send message without connection.");
			return;
		}
		
		this.sendMessage(message);
	}

	sendMessage(message)
	{
		this.Socket.send(message);
	}

	// Subscribe for notifications on channel
	subscribe(channel: string)
	{
		this.subscribedchannels.push(channel);
		this.send("subscribe", {
			channelName: channel
		});
	
	}

	// Subscribe for notifications on channel
	unsubscribe(channel: string)
	{
		if(	this.subscribedchannels.includes(channel) )
		{
			this.subscribedchannels.splice(this.subscribedchannels.indexOf(channel), 1);
		}

		if(	!this.subscribedchannels.includes(channel) )
		{
			this.send("unsubscribe", {
				channelName: channel
			});
		}

		
	}

	subscriptions()
	{
		return this.subscribedchannels;
	}
};