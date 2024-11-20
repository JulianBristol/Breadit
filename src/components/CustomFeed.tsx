import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
import React from "react";
import { getAuthSession } from "@/lib/auth";
/* import GeneralFeed from "./GeneralFeed";*/

const CustomFeed = async () => {
	const session = await getAuthSession();
    
	const followedCommunities = await db.subscription.findMany({
		where: {
			userId: session?.user.id,
		}, 
		include: {
			subreddit: true,
		},
	});

	const posts = await db.post.findMany({
		where: {
			subreddit: {
				name: {
					in: followedCommunities.map(({ subreddit }) => subreddit.id),
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			votes: true,
			author: true,
			comments: true,
			subreddit: true,
		},
		take: INFINITE_SCROLLING_PAGINATION_RESULTS,
	});

	/* if (posts.length === 0){
		{/* @ts-expect-error server component
		return <GeneralFeed />;
	}
	else  */
	return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;