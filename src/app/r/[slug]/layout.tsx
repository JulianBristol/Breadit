import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import ToggleView from "@/components/ToggleView";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { RecoilRoot } from "recoil";

const Layout = async ({ 
	children,
	params: { slug },
}: { 
    children: React.ReactNode,
    params: {slug: string}
}) => {

	const session = await getAuthSession();
	const test = false;

	const subreddit = await db.subreddit.findFirst({
		where: {name: slug},
		include: {
			posts: {
				include: {
					author: true,
					votes: true,
				}
			}
		}
	});

	const subscription = !session?.user ? undefined : await db.subscription.findFirst({
		where: {
			subreddit: {
				name: slug
			},
			user: {
				id: session.user.id,
			}
		}
	});

	const isSubscribed = !!subscription;

	if (!subreddit) return notFound();

	const memberCount = await db.subscription.count({
		where: {
			subreddit: {
				name: slug,
			}
		}
	});

	return (
		<div className="sm:container max-w-7xl mx-auto h-full pt-12">
			<div>
				{/* TODO: Button to take us back */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
					<div className='flex flex-col col-span-2 space-y-6'>{children}</div>

					{/* Info Sidebar */}
					<RecoilRoot>
						<div className='md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last relative'>
							<div className="right-0 mx-6 my-6 sm:mx-8 sm:my-5 absolute w-4 h-4">
								<ToggleView toggle={test}/>
								<div className={`w-10 h-10 ${test ? "bg-green-500" : "bg-red-500"}`}></div>
							</div>
							<div className="px-6 py-4">
								<p className="font-semibold py-3">About r/{subreddit.name}</p>
							</div>

							<dl className={"divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white"}>
								<div className="flex justify-between gap-x-4 py-3">
									<dt className="text-gray-500">Created</dt>
									<dd className="text-gray-700">
										<time dateTime={subreddit.createdAt.toDateString()}>{format(subreddit.createdAt, "MMMM d, yyyy")}</time>
									</dd>
								</div>

								<div className="flex justify-between gap-x-4 py-3">
									<dt className="text-gray-500">Members</dt>
									<dd className="text-gray-700">
										<div className="text-gray-900">{memberCount}</div>
									</dd>
								</div>

								{subreddit.creatorId === session?.user.id ? (
									<div className="flex justify-between gap-x-4 py-3">
										<p className="text-gray-500">You created the community</p>
									</div>
								): null}

								{subreddit.creatorId !== session?.user.id ? (
									<SubscribeLeaveToggle 
										subredditId={subreddit.id} 
										subredditName={subreddit.name} 
										isSubscribed={isSubscribed}/>
								): null}

								<Link
									className={buttonVariants({
										variant: "outline",
										className: "w-full mb-6",
									})}
									href={`r/${slug}/submit`}>
								Create Post</Link>
							</dl>
						</div>
					</RecoilRoot>
				</div>
			</div>
		</div>
	);
};

export default Layout;