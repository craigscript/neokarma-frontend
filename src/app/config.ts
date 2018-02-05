import { environment } from '../environments/environment';

export class Config
{
	static get baseUrl(): string
	{
		return environment.remoteUrl;
	}

	static get socketAddress(): string
	{
		//return "ws://dev-api.neokarma.com:8880/";
		return "ws://ec2-18-218-53-179.us-east-2.compute.amazonaws.com:8880/";
	}
}

export const Recaptcha = {
	// Recaptcha public key
	SiteKey: "6LfXHSsUAAAAAOIIKpfbYgST3BaqTpt4_sg1rxyx"
};

export * from "./config/timezones";
export * from "./config/country-calling-codes";