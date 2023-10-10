"use client";

import React, { FC, useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentsVotes from "./CommentVotes";
import { Button } from "./ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "./ui/Label";

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
}

interface PostCommentProps {
    comment: ExtendedComment
	votesAmt: number
	currentVote: CommentVote | undefined
	postId: string
}

const PostComment: FC<PostCommentProps> = ({ comment, votesAmt, currentVote, postId }) => {

	const commentRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { data: session } = useSession();
	const [isReplying, setIsReplying] = useState<boolean>(false);

	return (
		<div ref={commentRef} className="flex flex-col">
			<div className="flex items-center">
				<UserAvatar
					user={{
						name: comment.author.name || null,
						image: comment.author.image || null,
					}} 
					className="h-6 w-6"
				/>

				<div className="ml-2 flex items-center gap-x-2">
					<p className="text-sm font-medium text-grey-900">
                        u/{comment.author.username}
					</p>
					<p className="max-h-40 truncate text-xs text-zinc-500">
						{formatTimeToNow(new Date(comment.createdAt))}
					</p>
				</div>
			</div> 
			<p className="text-sm mt-2 text-zinc-900">{comment.text}</p>

			<div className="flex gap-2 items-center">
				<CommentsVotes commentId={comment.id} initialVotesAmt={votesAmt} initialVote={currentVote} />

				<Button
					variant='ghost'
					size="xs"
					onClick={() => {
						if(!session) return router.push("/sign-in");
						setIsReplying(true);
					}}
				>
					<MessageSquare className="h-4 w-4 mr-1.5" />
					Reply
				</Button>

				{isReplying ? (
					<div className="grid w-full gap-1.5">
						<Label>Your comment</Label>
					</div>
				) : null }

			</div>
		</div>
	);};

export default PostComment;