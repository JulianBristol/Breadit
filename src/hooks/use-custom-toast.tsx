import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";
import React from "react";

export const useCustomToast = () => {
	const loginToast = () => {
		const {dismiss} = toast({
			title: "Login Required",
			description: "You need to be logged in to do that",
			variant: "destructive",
			action: (
				<Link 
					className={buttonVariants({ variant: "outline" })} 
					onClick={() => dismiss()} 
					href="/sign-in">Login</Link>
			)
		});
	};

	return { loginToast };
};
