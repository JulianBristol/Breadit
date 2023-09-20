import { VoteType } from "@prisma/client";

export type CachedPost = {
    id: string
    title: string
    authourUsername: string
    content: string
    currentVote: VoteType | null
    createdAt: Date
}