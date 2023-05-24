import { TypeOf, undefined, z } from "zod";
import { Prisma } from "@prisma/client";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  createTRPCContext,
} from "~/server/api/trpc";
import { userAgent } from "next/server";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string()}))
    .query(async ({input: { id}, ctx}) => {
        const currentUserId = ctx.session?.user.id;
        const profile = await ctx.prisma.user.findUnique({ 
            where: {id}, 
            select:{
                name: true, 
                image: true, 
                _count: { select: { followers: true, follows: true, posts:true}},
                followers: currentUserId == null 
                    ? undefined  
                    : {where: {id: currentUserId}},
            },
        })
        
        if (profile == null) return 

        return {
            name: profile.name,
            image: profile.image,
            followersCount: profile._count.followers,
            followsCount: profile._count.follows,
            postCount: profile._count.posts,
            isFollowing: profile.followers.length > 0
        }
    }),
})

