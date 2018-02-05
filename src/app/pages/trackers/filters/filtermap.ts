import { WordFilterDialog } from "./word.filter";
import { SentimentFilterDialog } from "./sentiment.filter";
import { UserFilterDialog } from "./user.filter";
import { CommentFilterDialog } from "./comment.filter";
import { ScoreFilterDialog } from "./score.filter";

export const FilterDialogs:any[] = [

	WordFilterDialog,
	SentimentFilterDialog,
	UserFilterDialog,
	CommentFilterDialog,
	ScoreFilterDialog
];

export var RedditFilterMap: any = {
	word: {
		icon: "fa-hashtag",
		name: "Word / Keyword Filter",
		DialogComponent: WordFilterDialog,
		description: "Filters series with words (MATCH / DONT MATCH / CONTAIN / DONT CONTAIN)",
	},
	sentiment: {
		icon: "fa-smile-o",
		name: "Sentiment Filter",
		DialogComponent: SentimentFilterDialog,
		description: "Filters series with sentiment limits (MIN / MAX)",
	},
	user: {
		icon: "fa-user",
		name: "User Filter",
		DialogComponent: UserFilterDialog,
		description: "Filters series with sentiment limits (MIN / MAX)",
	},
	title: {
		icon: "fa-header",
		name: "Title Filter",
		DialogComponent: WordFilterDialog,
		description: "Filters series for specific title.",
	},
	commentnum: {
		icon: "fa-comments",
		name: "Comment Limit",
		DialogComponent: CommentFilterDialog,
		description: "Filters series with comment limits (MIN / MAX)",
	},
	upvote: {
		icon: "fa-arrow-up",
		name: "Upvote Limit",
		DialogComponent: ScoreFilterDialog,
		description: "Filters series with upvote limits (MIN / MAX)",
	},
	downvote: {
		icon: "fa-arrow-down",
		name: "Downvote Limit",
		DialogComponent: ScoreFilterDialog,
		description: "Filters series with downvote limits (MIN / MAX)",
	},
	score: {
		icon: "fa-arrow-down",
		name: "Total Score Limit",
		DialogComponent: ScoreFilterDialog,
		description: "Filters series with up+down vote limits (MIN / MAX)",
	},
	// trending: {
	// 	icon: "fa-trophy",
	// 	name: "Trend Filter",
	// 	DialogComponent: ScoreFilterDialog,
	// 	description: "Filters graph with trending score limits (MIN / MAX)",
	// },
	// visitors: {
	// 	icon: "fa-eye",
	// 	name: "Visitors Filter",
	// 	DialogComponent: WordFilterDialog,
	// 	description: "Filters graph with visitors / readers limits (MIN / MAX)",
	// },
};

export var TwitterFilterMap: any = {
	word: {
		icon: "fa-hashtag",
		name: "Word / Keyword Filter",
		DialogComponent: WordFilterDialog,
		description: "Filters series with words (MATCH / DONT MATCH / CONTAIN / DONT CONTAIN)",
	},
	sentiment: {
		icon: "fa-smile-o",
		name: "Sentiment Filter",
		DialogComponent: SentimentFilterDialog,
		description: "Filters series with sentiment limits (MIN / MAX)",
	},
	user: {
		icon: "fa-user",
		name: "User Filter",
		DialogComponent: UserFilterDialog,
		description: "Filters series with sentiment limits (MIN / MAX)",
	},
	retweet: {
		icon: "fa-comments",
		name: "Retweet Filter",
		DialogComponent: CommentFilterDialog,
		description: "Filters series with retweet limits (MIN / MAX)",
	},
	country: {
		icon: "fa-map-marker",
		name: "Country Filter",
		DialogComponent: CommentFilterDialog,
		description: "Filters series with retweet limits (MIN / MAX)",
	},
	timezone: {
		icon: "fa-map",
		name: "Timezone Filter",
		DialogComponent: CommentFilterDialog,
		description: "Filters series with retweet limits (MIN / MAX)",
	},
	usertweets: {
		icon: "fa-hashtag",
		name: "Tweet Filter",
		DialogComponent: CommentFilterDialog,
		description: "How many tweets the users should have (MIN / MAX)",
	},
};
