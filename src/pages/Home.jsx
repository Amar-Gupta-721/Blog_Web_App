import React, {useState, useEffect} from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux'       
import { Link } from 'react-router-dom'

function Home() {
    const userData = useSelector(state=>state.auth.userData)    
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userData) {       
            appwriteService.getPosts().then((posts) => {
                if (posts) {
                    const active = posts.documents.filter(post => post.status=='active');
                    setPosts(active)
                }
                setLoading(false) 
            }).catch(() => {
                setLoading(false) 
            })
        }
        else{
            setLoading(false)
        }
    }, [userData])//

    if (loading) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <h1 className="text-2xl font-bold">Loading...</h1>
                </Container>
            </div>
        )
    }

  if(userData==null)return (
    <div className="w-full py-8 mt-4 text-center">
        <Container>
            <Link to="/login">
                <h1 className="text-2xl font-bold hover:text-gray-500">
                    Login to read posts
                </h1>
            </Link>
        </Container>
    </div>
  )

  if(posts.length === 0){
    return (
        <div className="w-full py-8 mt-4 text-center">
            <Container>
                <div className="flex flex-wrap">
                    <div className="p-2 w-full">
                        <h1 className="text-2xl font-bold">
                            No post has been created Yet...
                        </h1>
                        <br />
                        <Link to='/add-post'>
                            <span className='text-4xl font-bold underline text-neutral-600 hover:text-neutral-950 '>Add some Post..</span>
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    )
  }
  return (
    <div className="w-full py-8">
        <Container>
            <div className="flex flex-wrap">
                {posts.map((post)=>(
                    <div key={post.$id} className="p-2 w-full">
                        <PostCard post={post}/>
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default Home