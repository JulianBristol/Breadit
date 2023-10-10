"use client";

import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import React, { FC, useState } from "react";
import { Button } from "./ui/Button";

type PartialVote = Pick<CommentVote, "type">

interface CommentVoteProps {
    commentId: string,
    initialVotesAmt: number,
    initialVote?: PartialVote
}

const CommentVote: FC<CommentVoteProps> = ({
	commentId,
	initialVotesAmt,
	initialVote,
}) => {

	const { loginToast } = useCustomToast();
	const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
	const [currentVote, setCurrentVote] = useState(initialVote);
	const prevVote = usePrevious(currentVote);


	const {mutate: vote} = useMutation({
		mutationFn: async (type: VoteType) => {
			const payload: CommentVoteRequest = {
				commentId,
				voteType: type
			};

			await axios.patch("/api/subreddit/post/comment/vote", payload);
		},
		onError: (err, voteType) => {
			if(voteType === "UP"){
				setVotesAmt((prev) => prev - 1);
			}else{
				setVotesAmt((prev) => prev + 1);
			}

			//reset the current vote
			setCurrentVote(prevVote);

			if(err instanceof AxiosError){
				if(err.response?.status === 401){
					return loginToast();
				}
			}

			return toast({
				title: "Something Went Wrong",
				description: "Your vote was not registered, please try again",
				variant: "destructive"
			});
		},
		onMutate: (type: VoteType) => {
			if (currentVote?.type === type) {
				setCurrentVote(undefined);
				if (type === "UP"){
					setVotesAmt((prev) => prev -1);
				}
				else if (type === "DOWN") {
					setVotesAmt((prev) => prev + 1);
				}
			}else {
				setCurrentVote({ type });
				if (type === "UP") {
					setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
				} else if (type === "DOWN") {
					setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
				}
			}
		}
	});

	return (
		<div className="flex gap-1">
			<Button
				size='sm'
				variant="ghost"
				aria-label="upvote"
				onClick={() => vote("UP")}>
				<ArrowBigUp className={cn("h-5 w-5 text-zinc-700", {
					"text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
				})} />
			</Button>

			<p className="text-center py-2 font-medium text-sm text-zinc-900">{votesAmt}</p>
            
			<Button
				size='sm'
				variant="ghost"
				aria-label="downvote"
				onClick={() => vote("DOWN")}>
				<ArrowBigDown className={cn("h-5 w-5 text-zinc-700", {
					"text-red-500 fill-red-500": currentVote?.type === "DOWN",
				})} />
			</Button>
		</div>
	);};

export default CommentVote;