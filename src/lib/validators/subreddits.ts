import z from "zod";

export const SubredditValidator = z.object({
	name: z.string().min(3).max(21).refine(s => !s.includes(" "), "Subreddit names must be between 3 and 21 characters in length and must not include spaces"),
});

export const SubredditSubscriptionValidator = z.object({
	subredditId: z.string()
});

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>
export type SubscribeToSubreddit = z.infer<typeof SubredditValidator>