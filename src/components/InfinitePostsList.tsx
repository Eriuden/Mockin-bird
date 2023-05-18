import Link from 'next/link'
import React from 'react'
import InfiniteScroll from "react-infinite-scroll-component"
import { ProfileImage } from './ProfileImage'

type Posts = {
  id:string
  content:string
  createdAt:Date
  likeCount: number
  likedByMe: boolean
  user: { id: string, image: string | null; name: string | null}
}

type Props = {
  isLoading: boolean
  isError: boolean
  hasMore: boolean
  fetchNewPosts: () => Promise<unknown>
  posts?: Posts[]
}


export const InfinitePostsList = ({posts, isError, isLoading, fetchNewPosts, 
  hasMore}: Props) => {
  if (isLoading) return <h1>Loading...</h1>
  if (isLoading) return <h1>Error</h1>
  if (posts == null || posts.length === 0) {
    return <h2>Pas de posts</h2>
  }

  return (
    <ul>
      <InfiniteScroll dataLength={posts.length}
      next={fetchNewPosts}
      hasMore={hasMore}
      loader={"Loading..."}>
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
        <LikeButton/>
      </div>

    </li>
  )
}

function LikeButton() {
  return <h1>Like</h1>
}
