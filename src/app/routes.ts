import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthGuard, UserGuard } from "./services/";

// Layouts
import { PublicLayout } from "./layouts/public";
import { UserLayout } from "./layouts/user";

import { AuthLayout } from "./layouts/auth";
// Pages

// Auth Pages
import { LoginPage } from "./pages/auth/login";
import { SignUpPage } from "./pages/auth/signup";
import { ForgotPasswordPage } from "./pages/auth/forgotpass";
import { RenewPasswordPage } from "./pages/auth/renewpass";
import { EmailVerificationPage } from "./pages/auth/email-verification";

// Error Pages
import { ErrorPage } from "./pages/error/error";
import { NotFoundPage } from "./pages/error/notfound";

// Dashboard
import { DashboardPage } from "./pages/dashboard/dashboard";

// FAQ
import { FaqPage } from "./pages/faq/faqpage";
import { Faq } from "./pages/faq/faq";

// Help Desk
import { HelpDeskPage } from "./pages/helpdesk/helpdesk";
import { Tickets } from "./pages/helpdesk/tickets";

// User
import {
	UserAccountPage,
	AffiliateSystemPage,
	NotificationHistoryPage,
	ChangePasswordDialog,
	UserUpdatePersonalDialog,
	PhoneNumberDialog,
	ChangeEmailDialog,
	PayoutAddressDialog,
} from "./pages/user";

// Trackers
import {
	TrackersMonitorPage,
	TrackersMyTrackersPage,
	TrackersNotifications,
	TrackersNotificationsWizard,
	TrackersNotificationsHistory,
	TrackersSourceFilterDialog,
	TrackersSourceWizard,
	TrackersTrackerWizard,
	SourceDialogs,
	TrackerDialogs,
	TrackersTrackerNameDialog,
	TrackersExporterDialog,
	TrackersNotificationDialog,
	TrackersNotificationConditionDialog,
	TrackersNotificationTargetDialog,
	NotificationRuleComponent,
	RuleComponents,
	NotificationTargetComponent,
	TargetComponents,
	// TrackersNotificationCreateDialog,
	// TrackersConditionCreateDialog,
	// SelectTrackerDialog,
	// MomentDataDialog,
	// TimeseriesDataDialog,
} from "./pages/trackers";

// Payment
import {
	PricingPlansPage,
	PayPalGatewayPage,
	CoinPaymentsGatewayPage
} from "./pages/pricing";

// Mentions
import {
	MentionsFeedPage,
	MentionsFeedList,
	MentionsMonitorPage,
	MentionsTrackersPage,
	MentionsTrackerWizardPage,
	MentionsNotificationPage,
	MentionRedditSourceDialog,
	MentionTwitterSourceDialog,
	MentionEmailTargetDialog,
	MentionSmsTargetDialog,
	MentionWebhookTargetDialog,
} from "./pages/mentions";

import {
	TrackingStatsPage
} from "./pages/stats";

// Market Search & Alerts
import {
	// Pages
	MarketSearchPage,
	MarketListingPage,
	MarketAlertsPage,
	MarketAlertListingComponent,
	MarketRedditPage,
	// Dialogs
	MarketAlertDialogs,


} from "./pages/markets";


export const appRoutes: Routes = [
	{
		path: 'app',
		component: UserLayout,
		data: { title: 'Neokarma' },
		resolve: {
			user: AuthGuard,
		},
		children: [
			// Dashboard
			{
				path: 'dashboard',
				component: DashboardPage,
				data: { title: 'Dashboard' },
			},
			// Payments & Plan change
			{
				path: 'plans',
				component: PricingPlansPage,
				data: { title: 'Pricing Plans' },
			},
			// Paypal -> Payment processing
			{
				path: 'payment/paypal/:planId/:currency',
				component: PayPalGatewayPage,
				data: { title: 'Pay via PayPal' },
			},
			// Paypal -> Confirm
			{
				path: 'payment/paypal-confirm/:paymentId',
				component: PayPalGatewayPage,
				data: { title: 'Pay via PayPal', status: "confirm"},
			},
			// Paypal -> Cancel
			{
				path: 'payment/paypal-cancel/:paymentId',
				component: PayPalGatewayPage,
				data: { title: 'Pay via PayPal', status: "cancel"},
			},
			// CoinPayments -> Processing
			{
				path: 'payment/coinpayments/:planId/:currency',
				component: CoinPaymentsGatewayPage,
				data: { title: 'Pricing Plans' },
			},

			// Mentions
			{
				path: 'trackers',
				children: [
					{
						path: 'monitor',
						component: TrackersMonitorPage,
						data: { title: 'Monitor' },
					},
					{
						path: 'my',
						component: TrackersMyTrackersPage,
						data: { title: 'My Trackers' },
					},
					{
						path: 'wizard/edit/:trackerId',
						component: TrackersTrackerWizard,
						data: { title: 'Tracker Wizard' },
					},
					{
						path: 'source/edit/:trackerId/:sourceId',
						component: TrackersSourceWizard,
						data: { title: 'Source Wizard' },
					},
					{
						path: 'notifications',
						component: TrackersNotifications,
						data: {title: "Trackers Notifications" }
					},
					{
						path: 'notification-wizard/:trackerId',
						component: TrackersNotificationsWizard,
						data: {title: "Trackers Notifications Wizard" }
					},
					{
						path: 'notification-history',
						component: TrackersNotificationsHistory,
						data: {title: "Trackers Notifications History" }
					}
				],
				data: { title: 'Mentions' },
			},
			// Mentions
			{
				path: 'mentions',
				children: [
					{
						path: 'monitor',
						component: MentionsMonitorPage,
						data: { title: 'Monitor' },
					},
					{
						path: 'feed',
						component: MentionsFeedPage,
						data: { title: 'Feed' },
					},
					{
						path: 'trackers',
						component: MentionsTrackersPage,
						data: { title: 'Mention Trackings' },
					},
					{
						path: 'sources/:trackerId',
						component: MentionsTrackerWizardPage,
						data: { title: 'Mention Sources' },
					},
					{
						path: 'create',
						component: MentionsTrackerWizardPage,
						data: { title: 'Mention Sources' },
					},
					{
						path: 'notification/:trackerId',
						component: MentionsNotificationPage,
						data: { title: 'Mentions Notification' },
					},
				],
				data: { title: 'Mentions' },
			},
			// User Account & Subscriptions
			{
				path: 'user',
				children: [
					{
						path: 'account',
						component: UserAccountPage,
						data: { title: 'User Account' },
					},
					{
						path: 'affiliate-system',
						component: AffiliateSystemPage,
						data: { title: 'Affiliate System' },
					},
					{
						path: 'notification-history',
						component: NotificationHistoryPage,
						data: { title: 'Notification History' }
					},
				],
				data: { title: 'User Account' },
			},
			// FAQ Page
			{
				path: 'faq',
				component: FaqPage,
				data: { title: 'FAQ' },
			},
			// Help Desk Page
			{
				path: 'helpdesk',
				component: HelpDeskPage,
				data: { title: 'Help Desk' },
			},
			{
				path: "stats",
				component: TrackingStatsPage,
				data: {title: "Tracking Stats"},
			},
			{
				path: '**',
				component: NotFoundPage
			}
		]
	},
	{
		path: "markets",
		component: PublicLayout,
		data: { title: "Neokarma" },
		resolve: {
			user: UserGuard,
		},
		children: [
			{
				path: "",
				component: MarketSearchPage,
			},
			{
				path: "alerts",
				component: MarketAlertsPage,
			},
			{
				path: ":market",
				component: MarketListingPage,
			},
			{
				path: '**',
				component: NotFoundPage
			}
		],
	},
	{
		path: "reddit",
		component: PublicLayout,
		data: { title: "Neokarma" },
		resolve: {
			user: UserGuard,
		},
		children: [
			{
				path: "",
				component: MarketRedditPage,
			},
			
		],
	},
	// Public Pages Used for authentication
	{
		path: 'auth',
		component: AuthLayout,
		children: [

			{
				path: 'login',
				component: LoginPage,
				data: { title: 'Login' }
			},
			{
				path: 'signup',
				component: SignUpPage,
				data: { title: 'Sign Up' }
			},
			{
				path: 'recovery/:recoveryKey/:email',
				component: RenewPasswordPage,
				data: { title: 'Recover Password' }
			},
			{
				path: 'forgot-password',
				component: ForgotPasswordPage,
				data: { title: 'Forgot Password' }
			},
			{
				path: 'email-verification/:emailToken/:emailAddress',
				component: EmailVerificationPage,
				data: { title: 'Email Verification' }
			},
			{
				path: '**',
				component: ErrorPage
			}
		]
	},
	{
		path: '',
		redirectTo: '/markets',
		pathMatch: 'full',
	},
	{
		path: '**',
		component: ErrorPage
	}
];
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { useHash: true }),
    ],
    exports: [
        RouterModule,
    ]
})
export class ApplicationRoutings { }

export const EntryComponents: any[] = [
	// Tracker Dialogs
	TrackersSourceFilterDialog,
	TrackersTrackerNameDialog,
	TrackersExporterDialog,

	SourceDialogs,
	TrackerDialogs,

	TrackersNotificationDialog,
	TrackersNotificationConditionDialog,
	TrackersNotificationTargetDialog,
	NotificationRuleComponent,
	RuleComponents,
	NotificationTargetComponent,
	TargetComponents,

	MentionsFeedList,

	// User Dialogs
	ChangePasswordDialog,
	UserUpdatePersonalDialog,
	PhoneNumberDialog,
	ChangeEmailDialog,
	PayoutAddressDialog,

	// Mention Dialogs
	MentionRedditSourceDialog,
	MentionTwitterSourceDialog,
	MentionEmailTargetDialog,
	MentionSmsTargetDialog,
	MentionWebhookTargetDialog,

	// Other
	Faq,
	Tickets,

	// Market dialogs
	MarketAlertDialogs,
	MarketAlertListingComponent
];

export const Pages: any[] = [
	// Layouts
	UserLayout,
	AuthLayout,
	PublicLayout,

	// Auth Pages
	LoginPage,
	SignUpPage,
	ForgotPasswordPage,
	RenewPasswordPage,
	EmailVerificationPage,
	// Error Page
	ErrorPage,

	// Stats page
	TrackingStatsPage,

	// Error Pages
	NotFoundPage,

	// Pages
	DashboardPage,
	FaqPage,
	HelpDeskPage,

	// User
	UserAccountPage,
	AffiliateSystemPage,
	NotificationHistoryPage,

	// Trackers
	TrackersMonitorPage,
	TrackersMyTrackersPage,
	TrackersNotifications,
	TrackersNotificationsWizard,
	TrackersNotificationsHistory,
	TrackersSourceWizard,
	TrackersTrackerWizard,

	// Mentions
	MentionsMonitorPage,
	MentionsFeedPage,
	MentionsTrackersPage,
	MentionsTrackerWizardPage,
	MentionsNotificationPage,

	// Pricing & Payment / Plans
	PricingPlansPage,
	PayPalGatewayPage,
	CoinPaymentsGatewayPage,

	// Free Pages
	MarketSearchPage,
	MarketListingPage,
	MarketAlertsPage,
];
