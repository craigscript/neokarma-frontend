import { WebhookTarget } from "./webhook.target";
import { EmailTarget } from "./email.target";

export const TargetComponents = [
	WebhookTarget,
	EmailTarget,
];

export const NotificationTargetMap: any = {
	webhook: {
		component: WebhookTarget,
		icon: "fa-globe",
		title: "Webhook",
		description: "Executes a webhook (GET, POST, PUT, DELETE) request via HTTP",
	},
	email: {
		component: EmailTarget,
		icon: "fa-envelope",
		title: "Email",
		description: "Send an email to an email address.",
	},

};