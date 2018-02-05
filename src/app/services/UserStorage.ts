import { Injectable } from '@angular/core';

@Injectable()
export class UserStorage
{
	Storage: any = {};

	// Retrieves data from localStorage and caches it
	loadStorage(key)
	{
		var storageData = localStorage.getItem(key)
		if(!storageData)
			return null;
		this.Storage[key] = JSON.parse(storageData);
		return this.Storage[key];
	}

	// Forces the save of the storage
	saveStorage(key)
	{
		localStorage.setItem(key, JSON.stringify(this.Storage[key]));
	}

	// Returns precached item from storage
	get(key)
	{
		if(!this.Storage[key])
			return this.loadStorage(key);
		return this.Storage[key];
	}

	// Sets data in storage
	set(key, value)
	{
		this.Storage[key] = value;
		this.saveStorage(key);
	}

	// Sets a key in the local storage
	unset(key)
	{
		this.Storage[key] = null;
		delete this.Storage[key];
		localStorage.removeItem(key);
	}

	// Clears the local storage entirely
	clear()
	{
		localStorage.clear();
		this.Storage = {};
	}

	// Returns all the keys available in the local storage
	keys()
	{
		var keys = []
		for(var i=0;i<localStorage.length;++i)
		{
			keys.push(localStorage.key(i));
		}
		return keys;
	}
}
