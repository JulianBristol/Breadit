"use client";

import React, { FC, useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";

interface CreateCommentProps {
  
}

const CreateComment: FC<CreateCommentProps> = ({}) => {

	const [input, setInput] = useState<string>();

	const {} = useMutation({
		mutationFn: async () => {
            
		}
	});

	return (
		<div className='grid w-full gap-1.5'>
			<Label htmlFor="comment">Your Comment</Label>
			<div className="mt-2">
				<Textarea
					id='comment'
					value={input}
					onChange={(e) => {setInput(e.target.value);}}
					rows={1}
					placeholder="What are your thoughts?"                
				/>

				<div className="mt-2 flex justify-end">
					<Button>Post</Button>
				</div>
			</div>
		</div>
	);};

export default CreateComment;