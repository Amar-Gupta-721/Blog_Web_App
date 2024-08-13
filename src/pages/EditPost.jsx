import React, {useState, useEffect} from 'react'
import { Container, PostForm } from '../components'
import appwritreService from '../appwrite/config'
import { useNavigate, useParams } from 'react-router-dom'

function EditPost() {
    const [post, setPost] = useState(null)
    const {slug} = useParams()      
    const navigate = useNavigate()

    useEffect(()=>{
        if(slug){
            appwritreService.getPost(slug).then((post)=>{
                if(post){
                    setPost(post)

                    console.log("EditPost post is :   "+post);
                }
            })
        }
        else{
            navigate('/')
        }
    },[slug,navigate])
  return post ? (
    <div className="py-8">
        <Container>
            <PostForm post={post}/>
        </Container>
    </div>
  ) : null
}

export default EditPost