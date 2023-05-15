import { type NextPage } from "next";
import { NewPostForm } from "~/components/NewPostForm";
import { InfinitePostsList } from "~/components/InfinitePostsList";
import { api } from "~/utils/api";




const Home: NextPage = () => {
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        
      </header>
      <NewPostForm/>
      <RecentPosts/>
    </>
  )
}

function RecentPosts(){
  const posts = api.post.infiniteFeed.useInfiniteQuery(
    {}, 
    {getNextPageParam: (lastPage) => lastPage.nextCursor}
  )

  return <InfinitePostsList posts={posts}/>
  
}
  

export default Home;

