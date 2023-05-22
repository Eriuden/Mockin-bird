import { type NextPage } from "next";
import { NewPostForm } from "~/components/NewPostForm";
import { InfinitePostsList } from "~/components/InfinitePostsList";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";


const TABS = ["Recent", "Following"] as const

const Home: NextPage = () => {
  const [selected, setSelected] = useState<(typeof TABS)[number]>("Recent")
  const session = useSession()
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        {session.status ==="authenticated" && (
          <div className="flex">
            {TABS.map(tab => {
              return <button key={tab} onClick={()=> setSelected(tab)}>
                {tab}
              </button>
            })}
          </div>
        )}
      </header>
      <NewPostForm/>
      {selected === "Recent" ? <RecentPosts/> : <FollowingPosts/> }
      
    </>
  )
}

function RecentPosts(){
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    {}, 
    {getNextPageParam: (lastPage) => lastPage.nextCursor}
  )


  return (
  <InfinitePostsList 
  posts={posts.data?.pages.flatMap((page)=> page.posts)}
  isError={posts.isError}
  isLoading={posts.isLoading}
  hasMore={posts.hasNextPage || false}
  fetchNewPosts={posts.fetchNextPage() ||}
  />
  )
}

function FollowingPosts(){
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    {onlyFollowing: true}, 
    {getNextPageParam: (lastPage) => lastPage.nextCursor}
  )


  return (
  <InfinitePostsList 
  posts={posts.data?.pages.flatMap((page)=> page.posts)}
  isError={posts.isError}
  isLoading={posts.isLoading}
  hasMore={posts.hasNextPage || false}
  fetchNewPosts={posts.fetchNextPage() ||}
  />
  )
}
  

export default Home;

