import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import InfiniteScroll from "react-infinite-scroll-component"
import { ProfileImage } from './ProfileImage'
import { VscHeart, VscHeartFilled} from "react-icons/vsc"
import { IconHoverEffect } from './IconHoverEffect'
import { api } from '~/utils/api'
import { LoadingSpinner } from './LoadingSpinner'

type Posts = {
  id:string
  content:string
  createdAt:Date
  likeCount: number
  likedByMe: boolean
  user: { id: string, image: string | null; name: string | null}
}

type Props = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewPosts: () => Promise<unknown>;
  posts?: Posts[];
}


export const InfinitePostsList = ({posts, isError, isLoading, fetchNewPosts, 
  hasMore=false}: Props) => {
  if (isLoading) return <LoadingSpinner/>
  if (isError) return <h1>Error</h1>
  if (posts == null || posts.length === 0) {
    return <h2>Pas de posts</h2>
  }

  return (
    <ul>
      <InfiniteScroll dataLength={posts.length}
      next={fetchNewPosts}
      hasMore={hasMore}
      loader={<LoadingSpinner/>}>
        {posts.map((post)=> {
          //return empèche le void ici
          return <div key={post.id}>{post.content}</div>
        })}

      </InfiniteScroll>
    </ul>
  )
}

const dateTimeFormatter = Intl.DateTimeFormat(undefined, {dateStyle:"short"})

function PostCard({id, user,content,createdAt, likeCount,likedByMe}: Posts) {
  const trpcUtils = api.useContext()
  const toggleLike = api.post.toggleLike.useMutation({
    onSuccess :async ({ addedLike }) => {
      const updateData : Parameters<typeof 
      trpcUtils.post.infiniteFeed.setInfiniteData>[1] = (oldData) => {
        if (oldData == null) return

        const countModifier = addedLike ? 1 : -1 

        return {
          ...oldData,
          page: oldData.pages.map(page => {
            return {
              ...page,
              posts: page.posts.map(post => {
                if (post.id === id) {
                  return {
                    ...post,
                    likeCount: post.likeCount + countModifier,
                    likedByMe: addedLike
                  }
                }

                return post
              })
            }
          })
        }
      }

      trpcUtils.post.infiniteFeed.setInfiniteData({}, updateData)
      trpcUtils.post.infiniteFeed.setInfiniteData({onlyFollowing: true}, updateData)
      trpcUtils.post.infiniteProfileFeed.setInfiniteData({userId: user.id}, updateData)
    },
})

  function handleToggleLike(){
    toggleLike.mutate({ id })
  }
  return (
    <li className='flex gap-4 border-b px-4 py-4'>

      <Link href={`/profile/${user.id}`}>
        <ProfileImage src={user.image}/>
      </Link>

      <div className='flex flex-grow flex-col'>
        <div className='flex gap-1'>
          <Link href={`/profile/${user.id}`} className="font-bold
          hover:underline outline-none focus-visible:underline">
            {user.name}
          </Link>
          <span className='text-gray-500'>-</span>
          <span className='text-gray-500'>{dateTimeFormatter.format(createdAt)}</span>
        </div>
        <p className='whitespace-pre-wrap'>{content}</p>
        <LikeButton onClick={handleToggleLike} isLoading={toggleLike.isLoading}
        likedByMe={likedByMe} likeCount={likeCount}/>
      </div>

    </li>
  )
}

type LikeIconProps = {
  onClick: ()=> void
  isLoading: boolean
  likedByMe: boolean
  likeCount: number
}

function LikeButton({likedByMe, likeCount, isLoading, onClick} : LikeIconProps) {
  const session = useSession()
  const LikeIcon = likedByMe ? VscHeartFilled : VscHeart;

  if (session.status !== "authenticated") {
    return <div className='mb-1 mt-1 flex items-center gap-3 self-start
    text-gray-500'>
      <LikeIcon/>
      <span>{likeCount}</span>
    </div>
  }
  return (
    <button disabled={isLoading}
    onClick={onClick}
    className={`group items-center gap-1 self-start flex
    transition-colors duration-200 ${likedByMe ? "text-red-500" : 
    "text-gray-500 hover:text-red-500 focus-visible:text-red-500"}
    `}>

      <IconHoverEffect children red/>

      <LikeIcon className={`transition-colors duration-200 ${likedByMe 
      ? "fill-red-500" 
      : "fill-gray-500 group-focus-visible:fill-red-500"}`
      }
      />
      <span>{likeCount}</span>

    </button>
  )
}
