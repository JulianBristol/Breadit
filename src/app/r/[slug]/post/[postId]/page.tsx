import React, { FC } from "react";

interface PageProps {
    params: {
        postId: string
    }
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page: FC<PageProps> = ({ params }: PageProps) => {
	return (
		<div>7:10:00</div>
	);};

export default page;