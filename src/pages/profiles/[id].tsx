import  type { GetStaticPaths, GetStaticPathsContext, InferGetStaticPropsType, NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { GetStaticPropsContext } from 'next'
import { api } from '~/utils/api'
import ErrorPage from "next/error"
import { IconHoverEffect } from '~/components/IconHoverEffect'
import { VscArrowLeft } from 'react-icons/vsc'
import Link from 'next/link'
import { ProfileImage } from '~/components/ProfileImage'
import { InfinitePostsList } from '~/components/InfinitePostsList'
import { Button } from '~/components/Button'
import { useSession } from 'next-auth/react'




export const ProfilePage: NextPage <InferGetStaticPropsType <typeof getStaticProps>> = ({id}) => {
  const { data: profile} = api.profile.getById.useQuery({id})
  const posts = api.post.infiniteProfileFeed.useInfiniteQuery({ userId: id},
    { getNextPageParam: (lastPage) => lastPage.nextCursor})

    const trpcUtils = api.useContext()
    const toggleFollow = api.profile.toggleFollow.useMutation({ onSuccess: ({
        addedFollow }) => {
            trpcUtils.profile.getById.setData({ id} , oldData => {
                if (oldData == null) return 

                const countModifier = addedFollow ? 1 : -1 
                return {
                    ...oldData,
                    isFollowing: addedFollow,
                    followersCount: oldData.followersCount + countModifier,
                }
            })
        }
    })}

  if (profile == null || profile.name == null) 
    return <ErrorPage statusCode={404}/>

  return (
    <div>
        <Head>
            <title>{`Profil Mockinbird de ${user.name}`}</title>
        </Head>
        <header className='sticky top-0 z-10 flex items-center'>
            <Link href ="..">
                <IconHoverEffect>
                    <VscArrowLeft/>
                </IconHoverEffect>
            </Link>
            <ProfileImage src={profile.image}/>
            <div className='ml-2 flex-grow'>
                <h1>{profile.name}</h1>
                <div>
                    {profile.postCount} {""}
                    {getPlurial(profile.postCount, "post", "posts")} {""}
                    {profile.followersCount} {""}
                    {getPlurial(profile.followersCount, "follower", "followers")} {""}
                    {profile.followsCount} following        
                </div>
                <FollowButton 
                    isFollowing={profile.isFollowing} 
                    userId={id} 
                    onclick={()=> toggleFollow.mutate({ userId: id})}
                />
                <main>
                    <InfinitePostsList 
                        posts={posts.data?.pages.flatMap((page)=> page.posts)}
                        isError={posts.isError}
                        isLoading={posts.isLoading}
                        hasMore={posts.hasNextPage || false}
                        fetchNewPosts={posts.fetchNextPage}
                    />
                </main>
            </div>
        </header>
    </div>
  )
}

function FollowButton({userId, isFollowing, isLoading, onClick}: {userId: String,
isFollowing: boolean, isLoading: boolean, onClick: ()=> void}){
    const session = useSession()

    if (session.status !== "authenticated" || session.data.user.id === userId){
        return null
    }
    return (
        <Button disabled={isLoading} onClick={onClick} small gray={isFollowing}>
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        )
}

const pluralRules = new.Intl.PluralRules()
function getPlurial(number: number, singular: string, plural: string){
    return pluralRules.select(number) === "one" ? singular: plural
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],
        fallback:"blocking"
    }
}

export async function getStaticProps(context: GetStaticPropsContext<{id: string}) {
    const id = context.params?.id
    if (id == null) {
        return {
            redirect: {
                destination: "/"
            }
        }
    }

    const ssg = ssgHelper()
    ssg.profile.getById.prefetch({id})

    return {
        props: {
            id,
            trpcState: ssg.dehydrate(),

        }
    }
}
