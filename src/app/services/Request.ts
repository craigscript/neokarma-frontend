import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Config } from '../config';
import { Observable } from 'rxjs/Observable';
import { Router } from "@angular/router";
import 'rxjs/Rx';

@Injectable()
export class Request
{
	
	static DefaultError = {success: false, message: "Something Went wrong"};
	static ConnectionError = {success: false, message: "Connection error."};

	constructor(public http: Http, public router: Router)
	{
	}

	get(url, secure=true): Promise<any>
	{
		return this.http.get(Config.baseUrl + url, { withCredentials: true }).map(response => {
			return response.json() || Request.DefaultError;
		}).catch((error: Response | any) => {
			if(error.status == 0)
			{
				return Observable.throw(Request.ConnectionError);
			}
			return Observable.throw(error.json());
		}).toPromise().catch(error => {
			if(secure && error.login_required)
			{
				console.log("Login required");
				this.router.navigateByUrl("/auth/login");
			}
			console.log("Get Error", url, error);
			return Promise.resolve({succes: false, message: "Something went wrong."});
		});
	}

	getRedditData(url, secure=true): Promise<any>
	{
		return this.http.get(url, { withCredentials: false }).map(response => {
			return response.json() || Request.DefaultError;
		}).catch((error: Response | any) => {
			if(error.status == 0)
			{
				return Observable.throw(Request.ConnectionError);
			}
			return Observable.throw(error.json());
		}).toPromise().catch(error => {
			if(secure && error.login_required)
			{
				console.log("Login required");
				this.router.navigateByUrl("/auth/login");
			}
			console.log("Get Error", url, error);
			return Promise.resolve({succes: false, message: "Something went wrong."});
		});
	}

	post(url, body, secure=true): Promise<any>
	{
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		return this.http.post(Config.baseUrl + url, JSON.stringify( body ), { headers: headers, withCredentials: true }).map(response => {
			return response.json() || Request.DefaultError;
		}).catch((error: Response | any) => {
			if(error.status == 0)
			{
				return Observable.throw(Request.ConnectionError);
			}
			return Observable.throw(error.json());
		}).toPromise().catch(error => {
			if(secure && error.login_required)
			{
				console.log("Login required");
				this.router.navigateByUrl("/auth/login");
			}
			console.log("Post Error", url, error);
			return Promise.resolve({succes: false, message: "Something went wrong."});
		});
	}
}
