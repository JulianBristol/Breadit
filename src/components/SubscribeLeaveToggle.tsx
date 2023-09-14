"use client";

import React, { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
    subredditId: string
    subredditName: string
    isSubscribed: boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
	subredditId,
	subredditName,
	isSubscribed,
}) => {

	const { loginToast } = useCustomToast();
	const router = useRouter();

	const {mutate: subscribe, isLoading: isSubLoading} = useMutation({
		mutationFn: async () => {
			const payload: SubscribeToSubredditPayload = {
				name: subredditId,
			};

			const { data } = await axios.post("/api/subreddit/subscribe", payload);
			return data as string;
		},
		onError: (err) => {
			if (err instanceof AxiosError){
				if (err.response?.status === 401){
					return loginToast();
				}
			}

			return toast({
				title: "There was a problem",
				description: "Something went wrong, please try again",
				variant: "destructive"
			});
		},

		onSuccess: () => {
			startTransition(() => {
				router.refresh();
			});

			return toast({
				title: "Subscribed",
				description: `You are now subscribed to ${subredditName}`,
				variant: "default"
			});

		}
	});
	return isSubscribed ? (
		<Button className='w-full mt-1 mb-4'>Leave Community</Button>
	) : (
		<Button
			isLoading={isSubLoading}
			className='w-full mt-1 mb-4'
			onClick={() => subscribe()}
		>Join to Post</Button>
	);
};

export default SubscribeLeaveToggle;