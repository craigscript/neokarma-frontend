import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from '../config';
import { Observable } from 'rxjs/Observable';
import { Request, } from "./Request";
import { UserStorage } from "./UserStorage";
import 'rxjs/Rx';

@Injectable()
export class User
{
	get UserData()
	{
		return this.storage.get("user");
	}

	get Personal()
	{
		if(!this.UserData)
			return {};
		return this.UserData.personal;
	}

	constructor(public request: Request, public storage: UserStorage)
	{

	}

	// Authenticate(success, failed)
	// {
	// 	if(this.IsAuthenticated())
	// 	{
	// 		return success();
	// 	}

	// }

	logIn(username, password, remember)
	{
		if(this.IsAuthenticated())
		{
			return Promise.resolve(this.UserData);
		}

		return this.request.post("/auth/signIn", {
			email: username,
			password: password,
			rememberme: remember,
		}).then( response => {

			if(!response.success)
			{
				return Promise.reject(response.message);
			}
			this.storage.set("user", response.userData);
			return Promise.resolve(this.UserData);
		});
	}

	IsAuthenticated()
	{
		return this.UserData != null;
	}

	logOut()
	{
		this.storage.unset("user");
	}

	UpdateUserData()
	{
		this.request.get("/user").then( response => {
			if(response.success)
			{
				this.storage.set("user", response.userData);
			}
		});
	}

//	Data: any = null;

	// get PersonalData()
	// {
	// 	if(!this.Data || !this.Data.personal)
	// 		return {};
	// 	return this.Data.personal;
	// }

	// get UserData()
	// {
	// 	if(!this.Data)
	// 		return {};
	// 	return this.Data;
	// }

	// constructor(public req: Request)
	// {

	// }

	// UpdateUserData()
	// {
	// 	this.req.get("/user").then( response => {
	// 		if(response.success)
	// 		{
	// 			this.Data = response.userData;
	// 		}
	// 	});
	// }

	// IsAuthenticated()
	// {
	// 	return this.Data != null;
	// }


	// getQuota(quotaName)
	// {
	// 	if(!this.Data.quotas)
	// 		return { used: 0, max: 0, name: quotaName};

	// 	let quota = this.Data.quotas.find(( item ) => {
	// 		if(item.name == quotaName)
	// 		{
	// 			return item;
	// 		}
	// 	});

	// 	if(!quota)
	// 		return { used: 0, max: 0, name: quotaName};

	// 	return quota;
	// }

	// getUsedQuota(quotaName)
	// {
	// 	return this.getQuota(quotaName).used;
	// }

	// getMaxQuota(quotaName)
	// {
	// 	return this.getQuota(quotaName).max;
	// }
}
